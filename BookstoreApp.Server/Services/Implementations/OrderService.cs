using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Order;
using BookstoreApp.Server.DTOs.Payment;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly BookstoreDbContext _context;
        private readonly ICartService _cartService;
        private readonly IPaymentService _paymentService;

        public OrderService(
            BookstoreDbContext context,
            ICartService cartService,
            IPaymentService paymentService)
        {
            _context = context;
            _cartService = cartService;
            _paymentService = paymentService;
        }

        public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto dto)
        {
            // Get cart items
            var cart = await _cartService.GetCartAsync(userId);

            if (!cart.Items.Any())
                throw new InvalidOperationException("Cart is empty");

            // Validate stock availability
            foreach (var item in cart.Items)
            {
                var book = await _context.Books.FindAsync(item.BookId);
                if (book == null)
                    throw new KeyNotFoundException($"Book with ID {item.BookId} not found");

                if (book.StockQuantity < item.Quantity)
                    throw new InvalidOperationException($"Insufficient stock for '{book.Title}'. Only {book.StockQuantity} available.");
            }

            // Create order
            var order = new Order
            {
                UserId = userId,
                OrderNumber = GenerateOrderNumber(),
                TotalAmount = cart.TotalAmount,
                Status = OrderStatus.Pending,
                ShippingAddress = dto.ShippingAddress,
                ShippingPhone = dto.ShippingPhone,
                Note = dto.Note,
                OrderDate = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Create order items and reduce stock
            foreach (var cartItem in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    BookId = cartItem.BookId,
                    Quantity = cartItem.Quantity,
                    PriceAtOrder = cartItem.BookPrice
                };

                _context.OrderItems.Add(orderItem);

                // Reduce stock
                var book = await _context.Books.FindAsync(cartItem.BookId);
                if (book != null)
                {
                    book.StockQuantity -= cartItem.Quantity;

                    // Update book status if out of stock
                    if (book.StockQuantity == 0)
                        book.Status = BookStatus.OutOfStock;
                }
            }

            await _context.SaveChangesAsync();

            // Process payment
            var payment = await _paymentService.ProcessPaymentAsync(
                order.Id,
                order.TotalAmount,
                dto.PaymentMethod);

            // Update order status based on payment
            if (payment.Status == PaymentStatus.Completed)
            {
                order.Status = OrderStatus.Processing;
            }
            else
            {
                order.Status = OrderStatus.Cancelled;
                // Restore stock if payment failed
                await RestoreStockAsync(order.Id);
            }

            await _context.SaveChangesAsync();

            // Clear cart if payment successful
            if (payment.Status == PaymentStatus.Completed)
            {
                await _cartService.ClearCartAsync(userId);
            }

            // Return order with details
            return await GetOrderDetailsAsync(order.Id);
        }

        public async Task<List<OrderSummaryDto>> GetMyOrdersAsync(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => new OrderSummaryDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                OrderDate = o.OrderDate,
                ItemCount = o.OrderItems.Sum(oi => oi.Quantity)
            }).ToList();
        }

        public async Task<OrderDto> GetMyOrderDetailsAsync(int userId, int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                throw new KeyNotFoundException("Order not found");

            return MapToOrderDto(order);
        }

        public async Task<bool> CancelOrderAsync(int userId, int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                throw new KeyNotFoundException("Order not found");

            // Can only cancel pending or processing orders
            if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Processing)
                throw new InvalidOperationException($"Cannot cancel order with status '{order.Status}'");

            order.Status = OrderStatus.Cancelled;
            order.UpdatedAt = DateTime.UtcNow;

            // Restore stock
            await RestoreStockAsync(orderId);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<OrderDto>> GetAllOrdersAsync(int? status = null, int? userId = null)
        {
            var query = _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.User)
                .Include(o => o.Payment)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(o => (int)o.Status == status.Value);
            }

            if (userId.HasValue)
            {
                query = query.Where(o => o.UserId == userId.Value);
            }

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(MapToOrderDto).ToList();
        }

        public async Task<OrderDto> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.User)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                throw new KeyNotFoundException("Order not found");

            return MapToOrderDto(order);
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, int status)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
                throw new KeyNotFoundException("Order not found");

            if (status < 0 || status > 5)
                throw new ArgumentException("Invalid order status");

            var newStatus = (OrderStatus)status;

            // Set shipped/delivered dates
            if (newStatus == OrderStatus.Shipped && order.Status != OrderStatus.Shipped)
            {
                order.ShippedDate = DateTime.UtcNow;
            }
            else if (newStatus == OrderStatus.Delivered && order.Status != OrderStatus.Delivered)
            {
                order.DeliveredDate = DateTime.UtcNow;
            }

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        // Helper methods
        private async Task<OrderDto> GetOrderDetailsAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                throw new KeyNotFoundException("Order not found");

            return MapToOrderDto(order);
        }

        private async Task RestoreStockAsync(int orderId)
        {
            var orderItems = await _context.OrderItems
                .Include(oi => oi.Book)
                .Where(oi => oi.OrderId == orderId)
                .ToListAsync();

            foreach (var item in orderItems)
            {
                if (item.Book != null)
                {
                    item.Book.StockQuantity += item.Quantity;

                    // Update status if was out of stock
                    if (item.Book.Status == BookStatus.OutOfStock && item.Book.StockQuantity > 0)
                        item.Book.Status = BookStatus.Available;
                }
            }

            await _context.SaveChangesAsync();
        }

        private string GenerateOrderNumber()
        {
            // Format: ORD-YYYYMMDD-XXXXXX (e.g., ORD-20241209-001234)
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var randomPart = new Random().Next(100000, 999999);
            return $"ORD-{datePart}-{randomPart}";
        }

        private OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderNumber = order.OrderNumber,
                TotalAmount = order.TotalAmount,
                Status = order.Status.ToString(),
                ShippingAddress = order.ShippingAddress,
                ShippingPhone = order.ShippingPhone,
                Note = order.Note,
                OrderDate = order.OrderDate,
                ShippedDate = order.ShippedDate,
                DeliveredDate = order.DeliveredDate,
                OrderItems = order.OrderItems?.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    BookId = oi.BookId,
                    BookTitle = oi.Book?.Title ?? "",
                    BookAuthor = oi.Book?.Author ?? "",
                    BookImageUrl = oi.Book?.ImageUrl,
                    Quantity = oi.Quantity,
                    PriceAtOrder = oi.PriceAtOrder,
                    Subtotal = oi.PriceAtOrder * oi.Quantity
                }).ToList() ?? new List<OrderItemDto>(),
                Payment = order.Payment != null ? new PaymentDto
                {
                    Id = order.Payment.Id,
                    OrderId = order.Payment.OrderId,
                    PaymentMethod = order.Payment.PaymentMethod,
                    Amount = order.Payment.Amount,
                    Status = order.Payment.Status.ToString(),
                    TransactionId = order.Payment.TransactionId,
                    FailureReason = order.Payment.FailureReason,
                    CreatedAt = order.Payment.CreatedAt,
                    CompletedAt = order.Payment.CompletedAt
                } : null
            };
        }
    }
}

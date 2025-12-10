using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Cart;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class CartService: ICartService
    {
        private readonly ApplicationDbContext _context;

        public CartService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CartSummaryDto> GetCartAsync(int userId)
        {
            var cartItems = await _context.CartItems
                .Include(ci => ci.Book)
                .Where(ci => ci.UserId == userId)
                .OrderByDescending(ci => ci.AddedAt)
                .ToListAsync();

            var items = cartItems.Select(MapToCartItemDto).ToList();

            return new CartSummaryDto
            {
                Items = items,
                TotalItems = items.Sum(i => i.Quantity),
                TotalAmount = items.Sum(i => i.Subtotal)
            };
        }

        public async Task<CartItemDto> AddToCartAsync(int userId, AddToCartDto dto)
        {
            // Check if book exists
            var book = await _context.Books.FindAsync(dto.BookId);
            if (book == null)
                throw new KeyNotFoundException("Book not found");

            // Check stock availability
            if (book.StockQuantity < dto.Quantity)
                throw new InvalidOperationException($"Only {book.StockQuantity} items available in stock");

            // Check if book is already in cart
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.BookId == dto.BookId);

            if (existingCartItem != null)
            {
                // Update quantity
                var newQuantity = existingCartItem.Quantity + dto.Quantity;

                if (newQuantity > book.StockQuantity)
                    throw new InvalidOperationException($"Cannot add more. Only {book.StockQuantity} items available");

                existingCartItem.Quantity = newQuantity;
                await _context.SaveChangesAsync();

                // Reload with book details
                await _context.Entry(existingCartItem).Reference(ci => ci.Book).LoadAsync();
                return MapToCartItemDto(existingCartItem);
            }

            // Add new cart item
            var cartItem = new CartItem
            {
                UserId = userId,
                BookId = dto.BookId,
                Quantity = dto.Quantity,
                AddedAt = DateTime.UtcNow
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            // Reload with book details
            await _context.Entry(cartItem).Reference(ci => ci.Book).LoadAsync();
            return MapToCartItemDto(cartItem);
        }

        public async Task<CartItemDto> UpdateCartItemAsync(int userId, int bookId, UpdateCartItemDto dto)
        {
            var cartItem = await _context.CartItems
                .Include(ci => ci.Book)
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.BookId == bookId);

            if (cartItem == null)
                throw new KeyNotFoundException("Cart item not found");

            // Check stock availability
            if (cartItem.Book!.StockQuantity < dto.Quantity)
                throw new InvalidOperationException($"Only {cartItem.Book.StockQuantity} items available in stock");

            cartItem.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();

            return MapToCartItemDto(cartItem);
        }

        public async Task<bool> RemoveFromCartAsync(int userId, int bookId)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.BookId == bookId);

            if (cartItem == null)
                throw new KeyNotFoundException("Cart item not found");

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            if (cartItems.Any())
            {
                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<int> GetCartItemCountAsync(int userId)
        {
            return await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .SumAsync(ci => ci.Quantity);
        }

        private CartItemDto MapToCartItemDto(CartItem cartItem)
        {
            return new CartItemDto
            {
                Id = cartItem.Id,
                UserId = cartItem.UserId,
                BookId = cartItem.BookId,
                BookTitle = cartItem.Book?.Title ?? "",
                BookAuthor = cartItem.Book?.Author ?? "",
                BookImageUrl = cartItem.Book?.ImageUrl,
                BookPrice = cartItem.Book?.Price ?? 0,
                Quantity = cartItem.Quantity,
                Subtotal = (cartItem.Book?.Price ?? 0) * cartItem.Quantity,
                StockQuantity = cartItem.Book?.StockQuantity ?? 0,
                AddedAt = cartItem.AddedAt
            };
        }
    }
}

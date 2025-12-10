using BookstoreApp.Server.DTOs.Order;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface IOrderService
    {
        // Customer operations
        Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto dto);
        Task<List<OrderSummaryDto>> GetMyOrdersAsync(int userId);
        Task<OrderDto> GetMyOrderDetailsAsync(int userId, int orderId);
        Task<bool> CancelOrderAsync(int userId, int orderId);

        // Admin/Staff operations
        Task<List<OrderDto>> GetAllOrdersAsync(int? status = null, int? userId = null);
        Task<OrderDto> GetOrderByIdAsync(int orderId);
        Task<bool> UpdateOrderStatusAsync(int orderId, int status);
    }
}

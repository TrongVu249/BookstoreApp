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
        Task<List<AdminOrderSummaryDto>> GetAllOrdersForAdminAsync(
            int? status = null,
            int? userId = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            string? search = null);
        Task<List<OrderDto>> GetAllOrdersAsync(int? status = null, int? userId = null);
        Task<OrderDto> GetOrderByIdAsync(int orderId);
        Task<bool> UpdateOrderStatusAsync(int orderId, int status);
        Task<bool> CancelOrderByAdminAsync(int orderId);
        Task<OrderStatisticsDto> GetOrderStatisticsAsync();
    }
}

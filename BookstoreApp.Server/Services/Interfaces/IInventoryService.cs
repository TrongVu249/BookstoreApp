using BookstoreApp.Server.DTOs.Inventory;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface IInventoryService
    {
        Task UpdateStockAsync(int bookId, int userId, UpdateStockDto dto);
        Task<List<InventoryLogDto>> GetInventoryLogsAsync(
            int? bookId = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            int? userId = null);
        Task<List<LowStockBookDto>> GetLowStockBooksAsync(int threshold = 5);
        Task LogInventoryChangeAsync(int bookId, int userId, int quantityChange, int quantityAfter, string reason, string? notes = null);
    }
}
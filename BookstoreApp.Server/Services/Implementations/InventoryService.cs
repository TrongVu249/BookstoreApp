using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Inventory;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class InventoryService : IInventoryService
    {
        private readonly BookstoreDbContext _context;

        public InventoryService(BookstoreDbContext context)
        {
            _context = context;
        }

        public async Task UpdateStockAsync(int bookId, int userId, UpdateStockDto dto)
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
                throw new KeyNotFoundException($"Book with ID {bookId} not found");

            var oldQuantity = book.StockQuantity;
            var newQuantity = oldQuantity + dto.QuantityChange;

            if (newQuantity < 0)
                throw new InvalidOperationException($"Cannot reduce stock below 0. Current stock: {oldQuantity}, Requested change: {dto.QuantityChange}");

            // Update book stock
            book.StockQuantity = newQuantity;

            // Update book status based on stock
            if (newQuantity == 0)
            {
                book.Status = BookStatus.OutOfStock;
            }
            else if (book.Status == BookStatus.OutOfStock && newQuantity > 0)
            {
                book.Status = BookStatus.Available;
            }

            book.UpdatedAt = DateTime.UtcNow;

            // Create inventory log
            await LogInventoryChangeAsync(
                bookId,
                userId,
                dto.QuantityChange,
                newQuantity,
                dto.Reason,
                dto.Notes);

            await _context.SaveChangesAsync();
        }

        public async Task<List<InventoryLogDto>> GetInventoryLogsAsync(
            int? bookId = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            int? userId = null)
        {
            var query = _context.InventoryLogs
                .Include(il => il.Book)
                .Include(il => il.User)
                .AsQueryable();

            if (bookId.HasValue)
                query = query.Where(il => il.BookId == bookId.Value);

            if (dateFrom.HasValue)
                query = query.Where(il => il.LoggedAt >= dateFrom.Value);

            if (dateTo.HasValue)
                query = query.Where(il => il.LoggedAt <= dateTo.Value);

            if (userId.HasValue)
                query = query.Where(il => il.UserId == userId.Value);

            var logs = await query
                .OrderByDescending(il => il.LoggedAt)
                .ToListAsync();

            return logs.Select(il => new InventoryLogDto
            {
                Id = il.Id,
                BookId = il.BookId,
                BookTitle = il.Book?.Title ?? "",
                UserId = il.UserId,
                UserName = il.User?.UserName ?? "",
                QuantityChange = il.QuantityChange,
                QuantityAfter = il.QuantityAfter,
                Reason = il.Reason,
                Notes = il.Notes,
                LoggedAt = il.LoggedAt
            }).ToList();
        }

        public async Task<List<LowStockBookDto>> GetLowStockBooksAsync(int threshold = 5)
        {
            var books = await _context.Books
                .Where(b => b.StockQuantity < threshold && b.Status != BookStatus.Discontinued)
                .OrderBy(b => b.StockQuantity)
                .ToListAsync();

            return books.Select(b => new LowStockBookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                StockQuantity = b.StockQuantity,
                Status = b.Status.ToString(),
                Price = b.Price
            }).ToList();
        }

        public async Task LogInventoryChangeAsync(
            int bookId,
            int userId,
            int quantityChange,
            int quantityAfter,
            string reason,
            string? notes = null)
        {
            var log = new InventoryLog
            {
                BookId = bookId,
                UserId = userId,
                QuantityChange = quantityChange,
                QuantityAfter = quantityAfter,
                Reason = reason,
                Notes = notes,
                LoggedAt = DateTime.UtcNow
            };

            _context.InventoryLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
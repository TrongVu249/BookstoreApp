using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Wishlist;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class WishlistService : IWishlistService
    {
        private readonly BookstoreDbContext _context;

        public WishlistService(BookstoreDbContext context)
        {
            _context = context;
        }

        public async Task<List<WishlistItemDto>> GetWishlistAsync(int userId)
        {
            var wishlistItems = await _context.WishlistItems
                .Include(wi => wi.Book)
                .Where(wi => wi.UserId == userId)
                .OrderByDescending(wi => wi.AddedAt)
                .ToListAsync();

            return wishlistItems.Select(MapToWishlistItemDto).ToList();
        }

        public async Task<WishlistItemDto> AddToWishlistAsync(int userId, AddToWishlistDto dto)
        {
            // Check if book exists
            var book = await _context.Books.FindAsync(dto.BookId);
            if (book == null)
                throw new KeyNotFoundException("Book not found");

            // Check if already in wishlist
            var existingItem = await _context.WishlistItems
                .FirstOrDefaultAsync(wi => wi.UserId == userId && wi.BookId == dto.BookId);

            if (existingItem != null)
                throw new InvalidOperationException("Book is already in your wishlist");

            // Add to wishlist
            var wishlistItem = new WishlistItem
            {
                UserId = userId,
                BookId = dto.BookId,
                AddedAt = DateTime.UtcNow
            };

            _context.WishlistItems.Add(wishlistItem);
            await _context.SaveChangesAsync();

            // Reload with book details
            await _context.Entry(wishlistItem).Reference(wi => wi.Book).LoadAsync();
            return MapToWishlistItemDto(wishlistItem);
        }

        public async Task<bool> RemoveFromWishlistAsync(int userId, int bookId)
        {
            var wishlistItem = await _context.WishlistItems
                .FirstOrDefaultAsync(wi => wi.UserId == userId && wi.BookId == bookId);

            if (wishlistItem == null)
                throw new KeyNotFoundException("Wishlist item not found");

            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsInWishlistAsync(int userId, int bookId)
        {
            return await _context.WishlistItems
                .AnyAsync(wi => wi.UserId == userId && wi.BookId == bookId);
        }

        public async Task<bool> ClearWishlistAsync(int userId)
        {
            var wishlistItems = await _context.WishlistItems
                .Where(wi => wi.UserId == userId)
                .ToListAsync();

            if (wishlistItems.Any())
            {
                _context.WishlistItems.RemoveRange(wishlistItems);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        private WishlistItemDto MapToWishlistItemDto(WishlistItem wishlistItem)
        {
            return new WishlistItemDto
            {
                Id = wishlistItem.Id,
                UserId = wishlistItem.UserId,
                BookId = wishlistItem.BookId,
                BookTitle = wishlistItem.Book?.Title ?? "",
                BookAuthor = wishlistItem.Book?.Author ?? "",
                BookImageUrl = wishlistItem.Book?.ImageUrl,
                BookPrice = wishlistItem.Book?.Price ?? 0,
                StockQuantity = wishlistItem.Book?.StockQuantity ?? 0,
                BookStatus = wishlistItem.Book?.Status.ToString() ?? "",
                AddedAt = wishlistItem.AddedAt
            };
        }
    }
}

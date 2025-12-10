using BookstoreApp.Server.DTOs.Wishlist;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface IWishlistService
    {
        Task<List<WishlistItemDto>> GetWishlistAsync(int userId);
        Task<WishlistItemDto> AddToWishlistAsync(int userId, AddToWishlistDto dto);
        Task<bool> RemoveFromWishlistAsync(int userId, int bookId);
        Task<bool> IsInWishlistAsync(int userId, int bookId);
        Task<bool> ClearWishlistAsync(int userId);
    }
}

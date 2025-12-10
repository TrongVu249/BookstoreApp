using BookstoreApp.Server.DTOs.Cart;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface ICartService
    {
        Task<CartSummaryDto> GetCartAsync(int userId);
        Task<CartItemDto> AddToCartAsync(int userId, AddToCartDto dto);
        Task<CartItemDto> UpdateCartItemAsync(int userId, int bookId, UpdateCartItemDto dto);
        Task<bool> RemoveFromCartAsync(int userId, int bookId);
        Task<bool> ClearCartAsync(int userId);
        Task<int> GetCartItemCountAsync(int userId);
    }
}

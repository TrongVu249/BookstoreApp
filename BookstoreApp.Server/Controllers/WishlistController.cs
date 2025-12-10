using BookstoreApp.Server.DTOs.Wishlist;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookstoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        // Get current user's wishlist
        [HttpGet]
        public async Task<ActionResult<List<WishlistItemDto>>> GetWishlist()
        {
            var userId = GetCurrentUserId();
            var wishlist = await _wishlistService.GetWishlistAsync(userId);
            return Ok(wishlist);
        }

        // Add book to wishlist
        [HttpPost]
        public async Task<ActionResult<WishlistItemDto>> AddToWishlist([FromBody] AddToWishlistDto addToWishlistDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var wishlistItem = await _wishlistService.AddToWishlistAsync(userId, addToWishlistDto);
                return Ok(wishlistItem);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Remove book from wishlist
        [HttpDelete("{bookId}")]
        public async Task<ActionResult> RemoveFromWishlist(int bookId)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _wishlistService.RemoveFromWishlistAsync(userId, bookId);
                return Ok(new { message = "Book removed from wishlist" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Check if book is in wishlist
        [HttpGet("check/{bookId}")]
        public async Task<ActionResult> CheckWishlist(int bookId)
        {
            var userId = GetCurrentUserId();
            var isInWishlist = await _wishlistService.IsInWishlistAsync(userId, bookId);
            return Ok(new { isInWishlist });
        }

        // Clear entire wishlist
        [HttpDelete]
        public async Task<ActionResult> ClearWishlist()
        {
            var userId = GetCurrentUserId();
            await _wishlistService.ClearWishlistAsync(userId);
            return Ok(new { message = "Wishlist cleared successfully" });
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }
    }
}

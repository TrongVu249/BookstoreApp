using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.Wishlist
{
    public class AddToWishlistDto
    {
        [Required]
        public int BookId { get; set; }
    }
}

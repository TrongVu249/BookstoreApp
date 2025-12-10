using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.Cart
{
    public class AddToCartDto
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; } = 1;
    }
}

using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.Cart
{
    public class UpdateCartItemDto
    {
        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}

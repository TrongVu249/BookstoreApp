using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; } = 1;

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}

using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.Models
{
    public class WishlistItem
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int BookId { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties, represent relationships with other entities
        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}

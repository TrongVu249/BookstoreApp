using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.Models
{
    public class InventoryLog
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public int QuantityChange { get; set; }

        [Required]
        public int QuantityAfter { get; set; }

        [Required]
        [MaxLength(200)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Notes { get; set; }

        public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties, represent relationships with other entities
        public User User { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}

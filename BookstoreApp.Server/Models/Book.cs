using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.Models
{
    public enum BookStatus
    {
        Available = 0,
        OutOfStock = 1,
        Discontinued = 2,
        ComingSoon = 3
    }

    public class Book
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string ISBN { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Url]
        public string? ImageUrl { get; set; }

        [Required]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        [MaxLength(100)]
        public string? Publisher { get; set; }

        public DateTime? PublishDate { get; set; }

        public int PageCount { get; set; }

        [MaxLength(50)]
        public string Language { get; set; } = "English";

        [Required]
        public int CategoryId { get; set; }

        public BookStatus Status { get; set; } = BookStatus.Available;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }


        public Category Category { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
        public ICollection<InventoryLog> InventoryLogs { get; set; } = new List<InventoryLog>();
    }
}

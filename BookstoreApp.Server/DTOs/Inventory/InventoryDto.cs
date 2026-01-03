using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.Inventory
{
    public class UpdateStockDto
    {
        [Required]
        public int QuantityChange { get; set; } // Can be positive or negative

        [Required]
        [MaxLength(200)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Notes { get; set; }
    }

    public class InventoryLogDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int QuantityChange { get; set; }
        public int QuantityAfter { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime LoggedAt { get; set; }
    }

    public class LowStockBookDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
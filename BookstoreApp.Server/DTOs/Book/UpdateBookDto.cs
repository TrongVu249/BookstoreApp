using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.Book
{
    public class UpdateBookDto
    {
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
        [Range(0.01, 10000)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }

        [MaxLength(100)]
        public string? Publisher { get; set; }

        public DateTime? PublishDate { get; set; }

        [Range(1, 10000)]
        public int PageCount { get; set; }

        [MaxLength(50)]
        public string? Language { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [Range(0, 3)]
        public int Status { get; set; }
    }
}

namespace BookstoreApp.Server.DTOs.Book
{
    public class BookDto
    {
        public int Id { get; set; }
        public string ISBN { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? Publisher { get; set; }
        public DateTime? PublishDate { get; set; }
        public int? PageCount { get; set; }
        public string? Language { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

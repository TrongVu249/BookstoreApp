namespace BookstoreApp.Server.DTOs.Book
{
    public class BookSearchDto
    {
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Status { get; set; }
        public string? SortBy { get; set; } // "title", "price", "author", "date"
        public bool SortDescending { get; set; } = false;
    }
}

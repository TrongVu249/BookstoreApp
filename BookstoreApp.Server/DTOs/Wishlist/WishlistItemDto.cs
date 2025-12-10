namespace BookstoreApp.Server.DTOs.Wishlist
{
    public class WishlistItemDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string BookAuthor { get; set; } = string.Empty;
        public string? BookImageUrl { get; set; }
        public decimal BookPrice { get; set; }
        public int StockQuantity { get; set; }
        public string BookStatus { get; set; } = string.Empty;
        public DateTime AddedAt { get; set; }
    }
}

namespace BookstoreApp.Server.DTOs.Cart
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string BookAuthor { get; set; } = string.Empty;
        public string? BookImageUrl { get; set; }
        public decimal BookPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public int StockQuantity { get; set; }
        public DateTime AddedAt { get; set; }
    }
}

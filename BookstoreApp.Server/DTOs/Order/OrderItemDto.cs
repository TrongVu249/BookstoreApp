namespace BookstoreApp.Server.DTOs.Order
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string BookAuthor { get; set; } = string.Empty;
        public string? BookImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal PriceAtOrder { get; set; }
        public decimal Subtotal { get; set; }
    }
}

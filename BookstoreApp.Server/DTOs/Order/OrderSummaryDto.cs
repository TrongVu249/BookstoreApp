namespace BookstoreApp.Server.DTOs.Order
{
    public class OrderSummaryDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public int ItemCount { get; set; }
    }
}

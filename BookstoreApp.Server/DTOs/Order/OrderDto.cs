using BookstoreApp.Server.DTOs.Payment;

namespace BookstoreApp.Server.DTOs.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public string? ShippingPhone { get; set; }
        public string? Note { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
        public PaymentDto? Payment { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.Models
{
    public enum OrderStatus
    {
        Pending = 0,
        Processing = 1,
        Packed = 2,
        Shipped = 3,
        Delivered = 4,
        Cancelled = 5
    }

    public class Order
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        public int UserId { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [Required]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ShippingPhone { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Note { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public DateTime? ShippedDate { get; set; }

        public DateTime? DeliveredDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property, represents relationship with User, OrderItem and Payment entity
        public User User { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public Payment? Payment { get; set; }  // singular payment for the order
    }
}

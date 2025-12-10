using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.Order
{
    public class CreateOrderDto
    {
        [Required]
        [MaxLength(200)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string ShippingPhone { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Note { get; set; }

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "CreditCard"; // CreditCard, DebitCard, PayPal, etc.
    }
}

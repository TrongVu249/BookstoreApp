using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; }

        [Required]
        public decimal PriceAtOrder { get; set; }

        public Order Order { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}

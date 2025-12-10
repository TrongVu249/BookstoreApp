using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Payment;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly BookstoreDbContext _context;

        public PaymentService(BookstoreDbContext context)
        {
            _context = context;
        }

        public async Task<Payment> ProcessPaymentAsync(int orderId, decimal amount, string paymentMethod)
        {
            // Mock payment processing
            // In future, integrate with Stripe, PayPal, etc.

            var payment = new Payment
            {
                OrderId = orderId,
                PaymentMethod = paymentMethod,
                Amount = amount,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            // Simulate payment processing
            await Task.Delay(1000); // Simulate API call delay

            // Mock: 90% success rate
            var random = new Random();
            var isSuccess = random.Next(1, 11) <= 9; // 90% chance

            if (isSuccess)
            {
                payment.Status = PaymentStatus.Completed;
                payment.TransactionId = GenerateTransactionId();
                payment.CompletedAt = DateTime.UtcNow;
            }
            else
            {
                payment.Status = PaymentStatus.Failed;
                payment.FailureReason = "Payment declined by bank. Please try another payment method.";
            }

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return payment;
        }

        public async Task<PaymentDto> GetPaymentByOrderIdAsync(int orderId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId);

            if (payment == null)
                throw new KeyNotFoundException("Payment not found");

            return MapToPaymentDto(payment);
        }

        private string GenerateTransactionId()
        {
            // Generate a mock transaction ID
            return $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        }

        private PaymentDto MapToPaymentDto(Payment payment)
        {
            return new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                PaymentMethod = payment.PaymentMethod,
                Amount = payment.Amount,
                Status = payment.Status.ToString(),
                TransactionId = payment.TransactionId,
                FailureReason = payment.FailureReason,
                CreatedAt = payment.CreatedAt,
                CompletedAt = payment.CompletedAt
            };
        }
    }
}

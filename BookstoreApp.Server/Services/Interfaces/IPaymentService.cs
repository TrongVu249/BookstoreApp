using BookstoreApp.Server.DTOs.Payment;
using BookstoreApp.Server.Models;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<Payment> ProcessPaymentAsync(int orderId, decimal amount, string paymentMethod);
        Task<PaymentDto> GetPaymentByOrderIdAsync(int orderId);
    }
}

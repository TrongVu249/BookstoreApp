using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Dashboard;
using BookstoreApp.Server.DTOs.Inventory;
using BookstoreApp.Server.DTOs.Order;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly BookstoreDbContext _context;

        public DashboardService(BookstoreDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatistics> GetStatisticsAsync()
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            var startOfToday = now.Date;

            // Count users by role
            var totalUsers = await _context.Users.CountAsync(u => u.IsActive);
            var totalCustomers = await _context.Users.CountAsync(u => u.Role == UserRole.Customer && u.IsActive);
            var totalStaff = await _context.Users.CountAsync(u => u.Role == UserRole.Staff && u.IsActive);
            var totalAdmins = await _context.Users.CountAsync(u => u.Role == UserRole.Admin && u.IsActive);

            // Count books by status
            var totalBooks = await _context.Books.CountAsync();
            var availableBooks = await _context.Books.CountAsync(b => b.Status == BookStatus.Available);
            var outOfStockBooks = await _context.Books.CountAsync(b => b.Status == BookStatus.OutOfStock);

            // Count total orders
            var totalOrders = await _context.Orders.CountAsync();

            // Calculate revenue (only count orders with completed payments)
            var totalRevenue = await _context.Orders
                .Include(o => o.Payment)
                .Where(o => o.Payment != null && o.Payment.Status == PaymentStatus.Completed)
                .SumAsync(o => o.TotalAmount);

            var revenueThisMonth = await _context.Orders
                .Include(o => o.Payment)
                .Where(o => o.OrderDate >= startOfMonth
                    && o.Payment != null
                    && o.Payment.Status == PaymentStatus.Completed)
                .SumAsync(o => o.TotalAmount);

            var revenueToday = await _context.Orders
                .Include(o => o.Payment)
                .Where(o => o.OrderDate >= startOfToday
                    && o.Payment != null
                    && o.Payment.Status == PaymentStatus.Completed)
                .SumAsync(o => o.TotalAmount);

            // Calculate average order value
            var completedOrdersCount = await _context.Orders
                .Include(o => o.Payment)
                .CountAsync(o => o.Payment != null && o.Payment.Status == PaymentStatus.Completed);

            var averageOrderValue = completedOrdersCount > 0 ? totalRevenue / completedOrdersCount : 0;

            return new DashboardStatistics
            {
                TotalUsers = totalUsers,
                TotalCustomers = totalCustomers,
                TotalStaff = totalStaff,
                TotalAdmins = totalAdmins,
                TotalBooks = totalBooks,
                AvailableBooks = availableBooks,
                OutOfStockBooks = outOfStockBooks,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                RevenueThisMonth = revenueThisMonth,
                RevenueToday = revenueToday,
                AverageOrderValue = averageOrderValue
            };
        }

        // The following methods are commented out for now but can be implemented as needed.
        /*
        public async Task<DashboardDto> GetDashboardDataAsync()
        {
            var dashboard = new DashboardDto
            {
                Statistics = await GetStatisticsAsync(),
                OrdersByStatus = await GetOrdersByStatusAsync(),
                RecentOrders = await GetRecentOrdersAsync(10),
                LowStockBooks = await GetLowStockBooksAsync(5),
                RevenueChart = await GetRevenueChartDataAsync()
            };

            return dashboard;
        }

        private async Task<Dictionary<string, int>> GetOrdersByStatusAsync()
        {
            var orderCounts = await _context.Orders
                .GroupBy(o => o.Status)
                .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
                .ToListAsync();

            return orderCounts.ToDictionary(x => x.Status, x => x.Count);
        }

        private async Task<List<AdminOrderSummaryDto>> GetRecentOrdersAsync(int count = 10)
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .Include(o => o.Payment)
                .OrderByDescending(o => o.OrderDate)
                .Take(count)
                .ToListAsync();

            return orders.Select(o => new AdminOrderSummaryDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = o.User?.UserName ?? "",
                UserEmail = o.User?.Email ?? "",
                OrderNumber = o.OrderNumber,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                OrderDate = o.OrderDate,
                ItemCount = o.OrderItems.Sum(oi => oi.Quantity),
                PaymentMethod = o.Payment?.PaymentMethod,
                PaymentStatus = o.Payment?.Status.ToString()
            }).ToList();
        }

        private async Task<List<LowStockBookDto>> GetLowStockBooksAsync(int threshold = 5)
        {
            var books = await _context.Books
                .Where(b => b.StockQuantity < threshold && b.Status != BookStatus.Discontinued)
                .OrderBy(b => b.StockQuantity)
                .Take(20)
                .ToListAsync();

            return books.Select(b => new LowStockBookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                StockQuantity = b.StockQuantity,
                Status = b.Status.ToString(),
                Price = b.Price
            }).ToList();
        }

        private async Task<RevenueChartData> GetRevenueChartDataAsync()
        {
            var now = DateTime.UtcNow;
            var sixMonthsAgo = now.AddMonths(-6);
            var sevenDaysAgo = now.AddDays(-7).Date;

            // Monthly revenue for last 6 months
            var monthlyRevenue = await _context.Orders
                .Include(o => o.Payment)
                .Where(o => o.OrderDate >= sixMonthsAgo
                    && o.Payment != null
                    && o.Payment.Status == PaymentStatus.Completed)
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new MonthlyRevenue
                {
                    Month = $"{new DateTime(g.Key.Year, g.Key.Month, 1):MMM yyyy}",
                    Revenue = g.Sum(o => o.TotalAmount),
                    OrderCount = g.Count()
                })
                .OrderBy(x => x.Month)
                .ToListAsync();

            // Daily revenue for last 7 days
            var dailyRevenue = await _context.Orders
                .Include(o => o.Payment)
                .Where(o => o.OrderDate >= sevenDaysAgo
                    && o.Payment != null
                    && o.Payment.Status == PaymentStatus.Completed)
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new DailyRevenue
                {
                    Date = g.Key.ToString("MMM dd"),
                    Revenue = g.Sum(o => o.TotalAmount),
                    OrderCount = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return new RevenueChartData
            {
                MonthlyRevenue = monthlyRevenue,
                Last7Days = dailyRevenue
            };
        }
        */
    }
}
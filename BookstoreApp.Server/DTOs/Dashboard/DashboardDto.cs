using BookstoreApp.Server.DTOs.Inventory;
using BookstoreApp.Server.DTOs.Order;

namespace BookstoreApp.Server.DTOs.Dashboard
{
    public class DashboardDto
    {
        public DashboardStatistics Statistics { get; set; } = new();
        public Dictionary<string, int> OrdersByStatus { get; set; } = new();
        public List<AdminOrderSummaryDto> RecentOrders { get; set; } = new();
        public List<LowStockBookDto> LowStockBooks { get; set; } = new();
        public RevenueChartData? RevenueChart { get; set; }
    }

    public class DashboardStatistics
    {
        public int TotalUsers { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalStaff { get; set; }
        public int TotalAdmins { get; set; }
        public int TotalBooks { get; set; }
        public int AvailableBooks { get; set; }
        public int OutOfStockBooks { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal RevenueThisMonth { get; set; }
        public decimal RevenueToday { get; set; }
        public decimal AverageOrderValue { get; set; }
    }

    public class RevenueChartData
    {
        public List<MonthlyRevenue> MonthlyRevenue { get; set; } = new();
        public List<DailyRevenue> Last7Days { get; set; } = new();
    }

    public class MonthlyRevenue
    {
        public string Month { get; set; } = string.Empty; // e.g., "Jan 2024"
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
    }

    public class DailyRevenue
    {
        public string Date { get; set; } = string.Empty; // e.g., "Dec 25"
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
    }
}
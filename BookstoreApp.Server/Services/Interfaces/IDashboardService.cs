using BookstoreApp.Server.DTOs.Dashboard;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboardDataAsync();
        Task<DashboardStatistics> GetStatisticsAsync();
    }
}
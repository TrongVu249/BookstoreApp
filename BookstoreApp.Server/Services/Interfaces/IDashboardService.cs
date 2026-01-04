using BookstoreApp.Server.DTOs.Dashboard;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatistics> GetStatisticsAsync();
        //Task<DashboardDto> GetDashboardDataAsync();
    }
}
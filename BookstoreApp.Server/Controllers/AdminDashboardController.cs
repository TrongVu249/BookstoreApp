using BookstoreApp.Server.DTOs.Dashboard;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreApp.Server.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public AdminDashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Get comprehensive dashboard data including stats, charts, and alerts
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<DashboardDto>> GetDashboardData()
        {
            try
            {
                var dashboard = await _dashboardService.GetDashboardDataAsync();
                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get only statistics (faster, for quick stats display)
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<DashboardStatistics>> GetStatistics()
        {
            try
            {
                var stats = await _dashboardService.GetStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
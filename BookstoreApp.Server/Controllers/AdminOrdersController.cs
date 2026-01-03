using BookstoreApp.Server.DTOs.Order;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreApp.Server.Controllers
{
    [Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/admin/orders")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public AdminOrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Get all orders from all users (Admin/Staff only)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<AdminOrderSummaryDto>>> GetAllOrders(
            [FromQuery] int? status = null,
            [FromQuery] int? userId = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string? search = null)
        {
            try
            {
                var orders = await _orderService.GetAllOrdersForAdminAsync(
                    status, userId, dateFrom, dateTo, search);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get specific order by ID (any user's order)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                return Ok(order);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update order status
        /// </summary>
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus(
            int id,
            [FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                await _orderService.UpdateOrderStatusAsync(id, dto.Status);
                return Ok(new { message = "Order status updated successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get order statistics for dashboard
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("statistics")]
        public async Task<ActionResult<OrderStatisticsDto>> GetStatistics()
        {
            try
            {
                var stats = await _orderService.GetOrderStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Cancel any user's order (Admin only)
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/cancel")]
        public async Task<ActionResult> CancelOrder(int id)
        {
            try
            {
                await _orderService.CancelOrderByAdminAsync(id);
                return Ok(new { message = "Order cancelled successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
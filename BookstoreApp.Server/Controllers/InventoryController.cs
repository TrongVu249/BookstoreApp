using BookstoreApp.Server.DTOs.Inventory;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookstoreApp.Server.Controllers
{
    [Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/inventory")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        /// Update book stock quantity and log the change
        [HttpPut("{bookId}")]
        public async Task<ActionResult> UpdateStock(
            int bookId,
            [FromBody] UpdateStockDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user" });
                }

                await _inventoryService.UpdateStockAsync(bookId, userId, dto);
                return Ok(new { message = "Stock updated successfully" });
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

        /// Get inventory change logs with filters
        [HttpGet("logs")]
        public async Task<ActionResult<List<InventoryLogDto>>> GetLogs(
            [FromQuery] int? bookId = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] int? userId = null)
        {
            try
            {
                var logs = await _inventoryService.GetInventoryLogsAsync(
                    bookId, dateFrom, dateTo, userId);
                return Ok(logs);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// Get books with low stock (below threshold)
        [HttpGet("low-stock")]
        public async Task<ActionResult<List<LowStockBookDto>>> GetLowStockBooks(
            [FromQuery] int threshold = 5)
        {
            try
            {
                var books = await _inventoryService.GetLowStockBooksAsync(threshold);
                return Ok(books);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
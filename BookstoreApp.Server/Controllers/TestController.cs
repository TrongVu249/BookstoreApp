using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreApp.Server.Data;
using BookstoreApp.Server.Models;

namespace BookstoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly BookstoreDbContext _context;

        public TestController(BookstoreDbContext context)
        {
            _context = context;
        }

        /*
        [HttpGet("status")]
        public async Task<ActionResult> GetStatus()
        {
            try
            {
                var stats = new
                {
                    DatabaseConnected = true,
                    Users = await _context.Users.CountAsync(),
                    Categories = await _context.Categories.CountAsync(),
                    Books = await _context.Books.CountAsync(),
                    Timestamp = DateTime.UtcNow
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    DatabaseConnected = false,
                    Error = ex.Message
                });
            }
        }
        */

        /*
        [HttpGet("categories")]
        public async Task<ActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.IsActive,
                    BookCount = c.Books.Count
                })
                .ToListAsync();

            return Ok(categories);
        }
        */


        /*
        [HttpGet("books")]
        public async Task<ActionResult> GetBooks()
        {
            var books = await _context.Books
                .Include(b => b.Category)
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.Price,
                    b.StockQuantity,
                    Status = b.Status.ToString(),
                    Category = b.Category.Name
                })
                .ToListAsync();

            return Ok(books);
        }
        */

        /*
        [HttpGet("admin")]
        public async Task<ActionResult> GetAdmin()
        {
            var admin = await _context.Users
                .Where(u => u.Role == UserRole.Admin)
                .Select(u => new {
                    u.Id,
                    u.UserName,
                    u.Email,
                    u.FullName,
                    Role = u.Role.ToString()
                })
                .FirstOrDefaultAsync();

            if (admin == null)
                return NotFound("Admin user not found");

            return Ok(admin);
        }
        */
    }
}

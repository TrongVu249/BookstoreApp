using BookstoreApp.Server.DTOs.Book;
using BookstoreApp.Server.Services.Implementations;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/admin/books")]
    [Authorize]
    public class AdminBooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public AdminBooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // Get all books (including all statuses)
        [HttpGet]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<ActionResult<List<BookDto>>> GetAllBooks([FromQuery] BookSearchDto searchDto)
        {
            var books = await _bookService.GetAllBooksAsync(searchDto);
            return Ok(books);
        }

        // Get book by ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            try
            {
                var book = await _bookService.GetBookByIdAsync(id);
                return Ok(book);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Create new book
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BookDto>> CreateBook([FromBody] CreateBookDto dto)
        {
            try
            {
                var book = await _bookService.CreateBookAsync(dto);
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update book
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateBook(int id, [FromBody] UpdateBookDto dto)
        {
            try
            {
                await _bookService.UpdateBookAsync(id, dto);
                return Ok(new { message = "Book updated successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Delete book
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            try
            {
                await _bookService.DeleteBookAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update book stock quantity
        [HttpPatch("{id}/stock")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateStock(int id, [FromBody] int quantity)
        {
            try
            {
                await _bookService.UpdateStockAsync(id, quantity);
                return Ok(new { message = "Stock updated successfully", quantity });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}


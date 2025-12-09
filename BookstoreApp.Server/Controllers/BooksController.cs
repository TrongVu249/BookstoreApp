using BookstoreApp.Server.DTOs.Book;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        /// Get all books with optional search and filters (public access)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<BookDto>>> GetBooks([FromQuery] BookSearchDto searchDto)
        {
            var books = await _bookService.GetAllBooksAsync(searchDto);
            return Ok(books);
        }

        /// Get book by ID (public access)
        [HttpGet("{id}")]
        [AllowAnonymous]
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

        /// Search books by title or author (public access)
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<List<BookDto>>> SearchBooks([FromQuery] string query)
        {
            var searchDto = new BookSearchDto { Search = query };
            var books = await _bookService.GetAllBooksAsync(searchDto);
            return Ok(books);
        }
    }
}

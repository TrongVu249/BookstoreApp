using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Book;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class BookService : IBookService
    {
        private readonly BookstoreDbContext _context;
        private readonly ICategoryService _categoryService;

        public BookService(BookstoreDbContext context, ICategoryService categoryService)
        {
            _context = context;
            _categoryService = categoryService;
        }

        public async Task<List<BookDto>> GetAllBooksAsync(BookSearchDto? searchDto = null)
        {
            var query = _context.Books
                .Include(b => b.Category)
                .AsQueryable();

            // Apply filters
            if (searchDto != null)
            {
                // Search by title or author
                if (!string.IsNullOrWhiteSpace(searchDto.Search))
                {
                    query = query.Where(b =>
                        b.Title.Contains(searchDto.Search) ||
                        b.Author.Contains(searchDto.Search) ||
                        b.ISBN.Contains(searchDto.Search));
                }

                // Filter by category
                if (searchDto.CategoryId.HasValue)
                {
                    query = query.Where(b => b.CategoryId == searchDto.CategoryId.Value);
                }

                // Filter by price range
                if (searchDto.MinPrice.HasValue)
                {
                    query = query.Where(b => b.Price >= searchDto.MinPrice.Value);
                }

                if (searchDto.MaxPrice.HasValue)
                {
                    query = query.Where(b => b.Price <= searchDto.MaxPrice.Value);
                }

                // Filter by status
                if (searchDto.Status.HasValue)
                {
                    query = query.Where(b => (int)b.Status == searchDto.Status.Value);
                }

                // Apply sorting
                query = searchDto.SortBy?.ToLower() switch
                {
                    "title" => searchDto.SortDescending
                        ? query.OrderByDescending(b => b.Title)
                        : query.OrderBy(b => b.Title),
                    "price" => searchDto.SortDescending
                        ? query.OrderByDescending(b => b.Price)
                        : query.OrderBy(b => b.Price),
                    "author" => searchDto.SortDescending
                        ? query.OrderByDescending(b => b.Author)
                        : query.OrderBy(b => b.Author),
                    "date" => searchDto.SortDescending
                        ? query.OrderByDescending(b => b.CreatedAt)
                        : query.OrderBy(b => b.CreatedAt),
                    _ => query.OrderBy(b => b.Title)
                };
            }
            else
            {
                query = query.OrderBy(b => b.Title);
            }

            var books = await query.ToListAsync();

            return books.Select(MapToBookDto).ToList();
        }

        public async Task<BookDto> GetBookByIdAsync(int id)
        {
            var book = await _context.Books
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                throw new KeyNotFoundException("Book not found");

            return MapToBookDto(book);
        }

        public async Task<BookDto> CreateBookAsync(CreateBookDto createBookDto)
        {
            // Validate category exists
            if (!await _categoryService.CategoryExistsAsync(createBookDto.CategoryId))
                throw new InvalidOperationException("Category not found");

            // Check if ISBN already exists
            if (await _context.Books.AnyAsync(b => b.ISBN == createBookDto.ISBN))
                throw new InvalidOperationException("Book with this ISBN already exists");

            var book = new Book
            {
                ISBN = createBookDto.ISBN,
                Title = createBookDto.Title,
                Author = createBookDto.Author,
                Description = createBookDto.Description,
                ImageUrl = createBookDto.ImageUrl,
                Price = createBookDto.Price,
                StockQuantity = createBookDto.StockQuantity,
                Publisher = createBookDto.Publisher,
                PublishDate = createBookDto.PublishDate,
                PageCount = createBookDto.PageCount,
                Language = createBookDto.Language,
                CategoryId = createBookDto.CategoryId,
                Status = (BookStatus)createBookDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Reload with category
            return await GetBookByIdAsync(book.Id);
        }

        public async Task<bool> UpdateBookAsync(int id, UpdateBookDto updateBookDto)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
                throw new KeyNotFoundException("Book not found");

            // Validate category exists
            if (!await _categoryService.CategoryExistsAsync(updateBookDto.CategoryId))
                throw new InvalidOperationException("Category not found");

            // Check if ISBN conflicts with another book
            if (await _context.Books.AnyAsync(b => b.ISBN == updateBookDto.ISBN && b.Id != id))
                throw new InvalidOperationException("Book with this ISBN already exists");

            book.ISBN = updateBookDto.ISBN;
            book.Title = updateBookDto.Title;
            book.Author = updateBookDto.Author;
            book.Description = updateBookDto.Description;
            book.ImageUrl = updateBookDto.ImageUrl;
            book.Price = updateBookDto.Price;
            book.StockQuantity = updateBookDto.StockQuantity;
            book.Publisher = updateBookDto.Publisher;
            book.PublishDate = updateBookDto.PublishDate;
            book.PageCount = updateBookDto.PageCount;
            book.Language = updateBookDto.Language;
            book.CategoryId = updateBookDto.CategoryId;
            book.Status = (BookStatus)updateBookDto.Status;
            book.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
                throw new KeyNotFoundException("Book not found");

            // Check if book is in any cart items
            var inCart = await _context.CartItems.AnyAsync(ci => ci.BookId == id);
            if (inCart)
                throw new InvalidOperationException("Cannot delete book that is in customer carts");

            // Check if book is in any orders
            var inOrders = await _context.OrderItems.AnyAsync(oi => oi.BookId == id);
            if (inOrders)
                throw new InvalidOperationException("Cannot delete book that has been ordered");

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStockAsync(int id, int quantity)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
                throw new KeyNotFoundException("Book not found");

            if (quantity < 0)
                throw new ArgumentException("Stock quantity cannot be negative");

            book.StockQuantity = quantity;
            book.UpdatedAt = DateTime.UtcNow;

            // Auto-update status based on stock
            if (quantity == 0)
                book.Status = BookStatus.OutOfStock;
            else if (book.Status == BookStatus.OutOfStock)
                book.Status = BookStatus.Available;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BookExistsAsync(int id)
        {
            return await _context.Books.AnyAsync(b => b.Id == id);
        }

        private BookDto MapToBookDto(Book book)
        {
            return new BookDto
            {
                Id = book.Id,
                ISBN = book.ISBN,
                Title = book.Title,
                Author = book.Author,
                Description = book.Description,
                ImageUrl = book.ImageUrl,
                Price = book.Price,
                StockQuantity = book.StockQuantity,
                Publisher = book.Publisher,
                PublishDate = book.PublishDate,
                PageCount = book.PageCount,
                Language = book.Language,
                CategoryId = book.CategoryId,
                CategoryName = book.Category?.Name ?? "",
                Status = book.Status.ToString(),
                CreatedAt = book.CreatedAt,
                UpdatedAt = book.UpdatedAt
            };
        }
    }
}

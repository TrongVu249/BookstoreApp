using BookstoreApp.Server.DTOs.Book;

namespace BookstoreApp.Server.Services.Interfaces
{
    public interface IBookService
    {
        Task<List<BookDto>> GetAllBooksAsync(BookSearchDto? searchDto = null);
        Task<BookDto> GetBookByIdAsync(int id);
        Task<BookDto> CreateBookAsync(CreateBookDto createBookDto);
        Task<bool> UpdateBookAsync(int id, UpdateBookDto updateBookDto);
        Task<bool> DeleteBookAsync(int id);
        Task<bool> UpdateStockAsync(int id, int quantity);
        Task<bool> BookExistsAsync(int id);
    }
}

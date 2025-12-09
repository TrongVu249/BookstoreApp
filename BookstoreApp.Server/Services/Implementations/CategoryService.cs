using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.Category;
using BookstoreApp.Server.Models;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services.Implementations
{
    public class CategoryService: ICategoryService
    {
        private readonly BookstoreDbContext _context;

        public CategoryService(BookstoreDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryDto>> GetAllCategoriesAsync(bool? isActive = null)
        {
            var query = _context.Categories.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(c => c.IsActive == isActive.Value);
            }

            var categories = await query
                .OrderBy(c => c.Name)
                .ToListAsync();

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList();
        }

        public async Task<CategoryDto> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            // Check if category name already exists
            if (await _context.Categories.AnyAsync(c => c.Name == createCategoryDto.Name))
                throw new InvalidOperationException("Category name already exists");

            var category = new Category
            {
                Name = createCategoryDto.Name,
                Description = createCategoryDto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt
            };
        }

        public async Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            // Check if new name conflicts with existing category
            if (await _context.Categories.AnyAsync(c => c.Name == updateCategoryDto.Name && c.Id != id))
                throw new InvalidOperationException("Category name already exists");

            category.Name = updateCategoryDto.Name;
            category.Description = updateCategoryDto.Description;
            category.IsActive = updateCategoryDto.IsActive;
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            // Check if category has books
            var hasBooks = await _context.Books.AnyAsync(b => b.CategoryId == id);
            if (hasBooks)
                throw new InvalidOperationException("Cannot delete category with existing books");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleCategoryStatusAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                throw new KeyNotFoundException("Category not found");

            category.IsActive = !category.IsActive;
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return category.IsActive;
        }

        public async Task<bool> CategoryExistsAsync(int id)
        {
            return await _context.Categories.AnyAsync(c => c.Id == id);
        }
    }
}

using BookstoreApp.Server.DTOs.Category;
using BookstoreApp.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/admin/categories")]
    [Authorize(Roles = "Admin")]
    public class AdminCategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public AdminCategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// Get all categories (including inactive)
        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetAllCategories([FromQuery] bool? isActive)
        {
            var categories = await _categoryService.GetAllCategoriesAsync(isActive);
            return Ok(categories);
        }

        /// Get category by id
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryByID(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                return Ok(category);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// Create new category
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(dto);
                return CreatedAtAction(nameof(GetCategoryByID), new { id = category.Id }, category);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// Update category
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
        {
            try
            {
                await _categoryService.UpdateCategoryAsync(id, dto);
                return Ok(new { message = "Category updated successfully" });
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

        /// Delete category
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            try
            {
                await _categoryService.DeleteCategoryAsync(id);
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

        /// Toggle category active status
        [HttpPatch("{id}/toggle-status")]
        public async Task<ActionResult> ToggleStatus(int id)
        {
            try
            {
                var isActive = await _categoryService.ToggleCategoryStatusAsync(id);
                return Ok(new
                {
                    message = $"Category {(isActive ? "activated" : "deactivated")} successfully",
                    isActive
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}

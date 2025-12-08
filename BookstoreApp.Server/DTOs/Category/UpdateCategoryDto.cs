using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.Category
{
    public class UpdateCategoryDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace BookstoreApp.Server.DTOs.User
{
    public class UpdateUserDto
    {
        [Required(ErrorMessage ="Full name is required")]
        [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
        public string FullName { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number")]
        public string? PhoneNumber { get; set; }

        [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters")]
        public string? Address { get; set; }

        [Range(0,2, ErrorMessage ="Role must be 0 (Customer), 1 (Staff), or 2 (Admin)")]
        public int Role { get; set; }

        public bool IsActive { get; set; }
    }
}

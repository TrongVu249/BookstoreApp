using BookstoreApp.Server.DTOs.User;

namespace BookstoreApp.Server.Services
{
    public interface IUserService
    {
        Task<UserDto> GetProfileAsync(int userId);
        Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto updateProfileDto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);

        // Admin operations - User Management
        Task<List<UserDto>> GetAllUsersAsync(string? search = null, int? role = null, bool? isActive = null);
        Task<UserDto> GetUserByIdAsync(int userId);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<bool> UpdateUserAsync(int userId, UpdateUserDto updateUserDto);
        Task<bool> ToggleUserStatusAsync(int userId, int currentAdminId);
        Task<bool> AssignRoleAsync(int userId, int role);

        // Validation helpers
        Task<bool> EmailExistsAsync(string email);
        Task<bool> UsernameExistsAsync(string username);
    }
}

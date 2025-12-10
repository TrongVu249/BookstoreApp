using BookstoreApp.Server.Data;
using BookstoreApp.Server.DTOs.User;
using BookstoreApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Services
{
    public class UserService : IUserService
    {
        private readonly BookstoreDbContext _context;
        public UserService(BookstoreDbContext context)
        {
            _context = context;
        }
        public async Task<UserDto> GetProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return MapToUserDto(user);
        }

        public async Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.FullName = updateProfileDto.FullName;
            user.PhoneNumber = updateProfileDto.PhoneNumber;
            user.Address = updateProfileDto.Address;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToUserDto(user);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                throw new Exception("Current password is incorrect");
            }

            // Hash new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }


        /////// ADMIN functionalities below

        // Get all users (Admin only)
        public async Task<List<UserDto>> GetAllUsersAsync(string? search = null, int? role = null, bool? isActive = null)
        {
            var query = _context.Users.AsQueryable();

            // Search by username, email, or full name
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u =>
                    u.UserName.Contains(search) ||
                    u.Email.Contains(search) ||
                    u.FullName.Contains(search));
            }

            // Filter by role
            if (role.HasValue)
            {
                query = query.Where(u => (int)u.Role == role.Value);
            }

            // Filter by active status
            if (isActive.HasValue)
            {
                query = query.Where(u => u.IsActive == isActive.Value);
            }

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    Role = u.Role.ToString(),
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync();

            return users;
        }

        // Get user by ID (Admin only)
        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return MapToUserDto(user);
        }

        // Create new user (Admin only)
        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Check if email already exists
            if (await EmailExistsAsync(createUserDto.Email))
                throw new InvalidOperationException("Email already exists");

            // Check if username already exists
            if (await UsernameExistsAsync(createUserDto.UserName))
                throw new InvalidOperationException("Username already taken");

            var user = new User
            {
                UserName = createUserDto.UserName,
                Email = createUserDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                FullName = createUserDto.FullName,
                PhoneNumber = createUserDto.PhoneNumber,
                Address = createUserDto.Address,
                Role = (UserRole)createUserDto.Role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return MapToUserDto(user);
        }

        // Update user (Admin only)
        public async Task<bool> UpdateUserAsync(int userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.FullName = updateUserDto.FullName;
            user.PhoneNumber = updateUserDto.PhoneNumber;
            user.Address = updateUserDto.Address;
            user.Role = (UserRole)updateUserDto.Role;
            user.IsActive = updateUserDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleUserStatusAsync(int userId, int currentAdminId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            // Prevent admin from deactivating themselves
            if (userId == currentAdminId)
                throw new InvalidOperationException("Cannot deactivate your own account");

            user.IsActive = !user.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return user.IsActive;
        }

        public async Task<bool> AssignRoleAsync(int userId, int role)
        {
            if (role < 0 || role > 2)
                throw new ArgumentException("Invalid role. Must be 0 (Customer), 1 (Staff), or 2 (Admin)");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            user.Role = (UserRole)role;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        // Validation Helpers

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.UserName == username);
        }

        // Mapping to DTO
        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}

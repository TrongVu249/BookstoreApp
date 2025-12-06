using BookstoreApp.Server.DTOs.User;

namespace BookstoreApp.Server.Services
{
    public interface IUserService
    {
        Task<UserDto> GetProfileAsync(int userId);
        Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto updateProfileDto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);

    }
}

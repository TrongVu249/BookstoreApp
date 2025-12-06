using BookstoreApp.Server.DTOs.Auth;    

namespace BookstoreApp.Server.Services
{
    public interface IAuthService
    {
        //Create Auth Interface for Dependency Injection

        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<bool> UserExistsAsync(string email);
    }
}

namespace BookstoreApp.Server.DTOs.Auth
{
    public class AuthResponseDto
    {
        // Return user info and token after login or register to frontend

        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime TokenExpiration { get; set; }
    }
}

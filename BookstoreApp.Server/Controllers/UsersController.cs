using BookstoreApp.Server.DTOs.User;
using BookstoreApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookstoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require authentication
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// Get current user's profile
        [HttpGet("profile")]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var response = await _userService.GetProfileAsync(userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// Update current user's profile
        [HttpPut("profile")]
        public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var response = await _userService.UpdateProfileAsync(userId, updateDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// Change password for authenticated user
        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var success = await _userService.ChangePasswordAsync(userId, changePasswordDto);

                if (success)
                {
                    return Ok(new { message = "Password changed successfully" });
                }

                return BadRequest(new { message = "Failed to change password" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
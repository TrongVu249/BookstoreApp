using BookstoreApp.Server.DTOs.User;
using BookstoreApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookstoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController: ControllerBase
    {
        private readonly IUserService _userService;

        public AdminUsersController(IUserService userService)
        {
            _userService = userService;
        }

        // Get all users with optional filters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers(
            [FromQuery] string? search,
            [FromQuery] int? role,
            [FromQuery] bool? isActive)
        {
            var users = await _userService.GetAllUsersAsync(search, role, isActive);
            return Ok(users);
        }

        // Get user by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Create new user
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update user
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                await _userService.UpdateUserAsync(id, updateUserDto);
                return Ok(new { message = "User updated successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Toggle user active status
        [HttpPatch("{id}/toggle-active")]
        public async Task<ActionResult> ToggleUserStatusStatus(int id)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var isActive = await _userService.ToggleUserStatusAsync(id, currentUserId);

                return Ok(new
                {
                    message = $"User {(isActive ? "activated" : "deactivated")} successfully",
                    isActive
                });
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

        // Assign role to user
        [HttpPatch("{id}/assign-role")]
        public async Task<ActionResult> AssignRole(int id, [FromBody] int role)
        {
            try
            {
                await _userService.AssignRoleAsync(id, role);

                // Get updated user to return current role
                var user = await _userService.GetUserByIdAsync(id);

                return Ok(new
                {
                    message = "Role assigned successfully",
                    role = user.Role
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

using BankingSystem.DTOs;
using BankingSystem.Entities;
using BankingSystem.Enums;
using BankingSystem.Interfaces;
using BankingSystem.Models;
using BankingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ITransactionRepository _transactionRepo;

        public UserController(UserService userService)
        {
            _userService = userService;
        }
        //should be public
        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var token = _userService.Login(request.Username, request.Password);

            if (token == null)
                return Unauthorized("Invalid username or password");

            return Ok(new { token });
        }
        //should be public
        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            var result = _userService.Register(request);

            if (result.Contains("already"))
                return BadRequest(result);

            return Ok(result); 
        }


        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMyAccountInfo()
        {
            var username = User.Identity.Name; // Extract username from JWT

            var user = _userService.GetUserByUsername(username);

            if (user == null)
            {

                return NotFound("User not found");
            }
            else
            {
                return Ok(new
                {
                    user.Username,
                    user.CNIC,
                    user.PhoneNumber,
                    user.DOB,
                    user.AccountNumber,
                    Balance = user.Balance  // assuming Balance is added
                });
            }
        }
        [Authorize]
        [HttpPost("changepassword")]
        public IActionResult ChangePassword(ChangePasswordRequest request)
        {
            var username = User.Identity.Name;
            try
            {
                var result = _userService.ChangePassword(username, request.OldPassword, request.NewPassword);
                if(result == 0)
                    return BadRequest("No User logged in.");
                if (result == 1)
                    return BadRequest("Old password incorrect");
                if (result == 2)
                    return BadRequest("Password is too weak. It must be atleast 8 characters.");

                return Ok("Password updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Send error message like "Password too weak"
            }
        }

        [Authorize]
        [HttpPost("transfer")]
        public IActionResult Transfer(TransferRequest request) {

            var senderUsername = User.FindFirst(ClaimTypes.Name)?.Value;
            if (senderUsername == null)
                return Unauthorized();

            // ✅ Validation: Require description if category is Other
            if (request.Category == TransactionCategory.Other && string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest("Description is required when category is 'Other'.");
            }

            var result = _userService.TransferMoney(
                senderUsername,
                request.ToAccountNumber,
                request.Amount,
                request.Category,            // enum value, already parsed by model binder
                request.Description,
                request.IsSalaryCredit);

            if (result == "Transfer successful")
                return Ok(result);

            return BadRequest(result);
        }
        [Authorize]
        [HttpGet("transactions")]
        public IActionResult GetTransactionHistory([FromQuery] string filter)
        {
            var username = User.Identity.Name;
            var user = _userService.GetUserByUsername(username);

            if (user == null)
                return NotFound("User not found");

            DateTime? from = null;
            DateTime? to = DateTime.UtcNow;

            switch (filter?.ToLower())
            {
                case "lastmonth":
                    from = DateTime.UtcNow.AddMonths(-1);
                    break;
                case "last6months":
                    from = DateTime.UtcNow.AddMonths(-6);
                    break;
                case "lastyear":
                    from = DateTime.UtcNow.AddYears(-1);
                    break;
                case "last15days":
                    from = DateTime.UtcNow.AddDays(-15);
                    break;
                case "all":
                default:
                    from = null;
                    break;
            }

            var allTx = _userService.GetFilteredTransactions(
                user.AccountNumber,
                from,
                to,
                null,
                null
            );

            var sent = allTx.Where(t => t.FromAccount == user.AccountNumber);
            var received = allTx.Where(t => t.ToAccount == user.AccountNumber);

            return Ok(new
            {
                sent = sent.Select(t => new {
                    toAccountNumber = t.ToAccount,
                    toFullName = _userService.GetUserByAccountNumber(t.ToAccount)?.FullName,
                    amount = t.Amount,
                    date = t.Timestamp,
                    category = t.Category.ToString()
                }),
                received = received.Select(t => new {
                    fromAccountNumber = t.FromAccount,
                    fromFullName = _userService.GetUserByAccountNumber(t.FromAccount)?.FullName,
                    amount = t.Amount,
                    date = t.Timestamp,
                    category = t.Category.ToString()
                })
            });
        }


    }
}
/*When you POST /api/user/login with credentials, it checks login.
If valid, it sends back a JWT token.
Else, returns 401 Unauthorized.
*/
/*RegisterRequest.cs is in Models

You’ve using BankingSystem.Models; at the top of UserController.cs

UserService is injected properly (which you’ve done) */
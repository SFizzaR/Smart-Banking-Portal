using Azure.Core;
using BankingSystem.DTOs;
using BankingSystem.Entities;
using BankingSystem.Enums;
using BankingSystem.Interfaces;
using BankingSystem.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BankingSystem.Services
{
    public class UserService
    {
        private readonly IUserAccountRespositry _userRepo;
        private readonly IConfiguration _config;
        private readonly ITransactionRepository _transactionRepo;

        public UserService(
            IUserAccountRespositry userRepo,
            IConfiguration config,
            ITransactionRepository transactionRepo)
        {
            _userRepo = userRepo;
            _config = config;
            _transactionRepo = transactionRepo;
        }


        // Generates JWT token after login
        public string Login(string username, string password)
        {
            var user = _userRepo.GetByUsername(username);
            if (user == null || !user.CheckPassword(password))
                return null;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.AccountNumber),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string Register(RegisterRequest request)
        {
            if (_userRepo.UsernameExists(request.Username))
                return "Username already taken.";

            if (_userRepo.CnicExists(request.CNIC))
                return "CNIC already registered.";

            // Validate CNIC format: must be 13 digits
            if (string.IsNullOrWhiteSpace(request.CNIC) || request.CNIC.Length != 13 || !request.CNIC.All(char.IsDigit))
                return "Invalid CNIC. It must be 13 digits only.";

            // You can add similar validation for PhoneNumber
            if (string.IsNullOrWhiteSpace(request.PhoneNumber) || !request.PhoneNumber.All(char.IsDigit))
                return "Invalid phone number.";

            if (request.Password.Length < 8)
                return ("Password too weak. Must be atleast 8 characters.");

            var newUser = new UserAccount(
                request.CNIC,
                request.FullName,
                request.Username,
                request.Password,
                request.DOB,
                request.PhoneNumber
            );

            newUser.Balance = 1000M;
            _userRepo.Create(newUser);
            return "User registered successfully.";
        }
        public UserAccount GetUserByUsername(string username)
        {
            return _userRepo.GetByUsername(username);
        }
        public UserAccount GetUserByAccountNumber(string accountNumber)
        {
            return _userRepo.GetByAccountNumber(accountNumber);
        }

        // Transfers money and records a transaction with optional category/salary flags
        public string TransferMoney(string senderUsername, string receiverAcc, decimal amount, TransactionCategory category, string description, bool isSalary = false)
        {
            var sender = _userRepo.GetByUsername(senderUsername);
            var receiver = _userRepo.GetByAccountNumber(receiverAcc);

            if (receiver == null)
                return "Receiver not found";

            if (sender.Balance < amount)
                return "Insufficient funds";

            // Balance transfer
            sender.Balance -= amount;
            receiver.Balance += amount;

            _userRepo.Update(sender);
            _userRepo.Update(receiver);

            var transaction = new Transaction
            {
                FromAccount = sender.AccountNumber,
                ToAccount = receiver.AccountNumber,
                Amount = amount,
                Timestamp = DateTime.UtcNow,
                Category = category,
                Description = description, // add this line
                IsSalaryCredit = isSalary
            };


            _transactionRepo.RecordTransaction(transaction);

            return "Transfer successful";
        }

        // Updates user password after verifying old password
        public int ChangePassword(string username, string oldPass, string newPass)
        {
            var user = _userRepo.GetByUsername(username);

            if (user == null)
                return 0; // or throw an exception if preferred

            if (!user.CheckPassword(oldPass))
                return 1;

            // Validate new password strength
            if (string.IsNullOrEmpty(newPass) || newPass.Length < 8)
                return 2;

            user.SetPassword(newPass);
            _userRepo.Update(user); // Make sure this saves changes (e.g. calls DbContext.SaveChanges())

            return 3;
        }

        public IEnumerable<Transaction> GetTransactions(string username)
        {
            var user = _userRepo.GetByUsername(username);
            return _transactionRepo.GetTransactionsByAccount(user.AccountNumber);
        }
        public IEnumerable<Transaction> GetFilteredTransactions(
        string accountNumber,
        DateTime? from,
        DateTime? to,
        TransactionCategory? category,
        bool? isSalaryCredit)
        {
            return _transactionRepo.GetFilteredTransactions(accountNumber, from, to, category, isSalaryCredit);
        }

    }
}

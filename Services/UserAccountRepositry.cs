using BankingSystem.DBContext;
using BankingSystem.Entities;
using BankingSystem.Interfaces;
using Microsoft.EntityFrameworkCore;
//This is where you talk to the database using EF Core.
namespace BankingSystem.Services
{
    public class UserAccountRepository : IUserAccountRespositry
    {
        private readonly AppDbContext _context;

        public UserAccountRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Create(UserAccount user)
        {
            _context.UserAccounts.Add(user);
            _context.SaveChanges();
        }

        public UserAccount GetByUsername(string username)
        {
            return _context.UserAccounts.FirstOrDefault(u => u.Username == username);
        }

        public UserAccount GetByAccountNumber(string accountNumber)
        {
            return _context.UserAccounts.FirstOrDefault(u => u.AccountNumber == accountNumber);
        }

        public bool UsernameExists(string username) //Used to prevent duplicate signup
        {
            return _context.UserAccounts.Any(u => u.Username == username); //That’s EF Core talking to the UserAccounts table in your DB
        }

        public bool CnicExists(string cnic)
        {
            return _context.UserAccounts.Any(u => u.CNIC == cnic);
        }
        public void Update(UserAccount user)
        {
            _context.UserAccounts.Update(user);
            _context.SaveChanges();
        }

    }
}
//Now create the real repository that implements the interface and talks to the DB.

/*
 Where is the data stored?
Every time someone signs up:

Your UserAccount object is created.

It’s passed to the IUserAccountRepository.Create() method.

Then SqlUserAccountRepository uses Entity Framework Core to .Add() and .SaveChanges() the user to the database — specifically to the UserAccounts table in the BankingSystemDB database (as configured in your appsettings.json).*/
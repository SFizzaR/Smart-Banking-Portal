using Microsoft.EntityFrameworkCore;
using System; //System is the default namespace that gives you access to classes like DateTime, Exception, Guid, etc.
using System.ComponentModel.DataAnnotations; // This is needed

namespace BankingSystem.Entities //Namespace organizes your code, Core Layer with Entities folder 
{
    public class UserAccount //custom class to represent a user's bank account
    {
        [Key] //It tells EF Core: “Hey, this property(AccountNumber) is the unique ID for each user.”
        public string AccountNumber { get; private set; } //outside code can see the value (get) but only this class can change it (set)
        public string CNIC { get; set; } //we allow both get and set since these values are user-provided.

        public string FullName { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; private set; } //never store plain passwords, store a hashed version of password for security, 
        public DateTime DOB { get; set; } //DateTime is the .NET data type for dates 
        public string PhoneNumber { get; set; }
        public decimal Balance { get; set; } // Represents user's account balance
        //Constructor , its called when you create a new object like: var user = new UserAccount (...);
        protected UserAccount() { } //EF Core needs this protected means you and EF can use it, but nobody else from outside your class should use this basic constructor.
        public UserAccount( string cnic, string fullname, string username, string rawPassword, DateTime dob, string phoneNumber)
        {

            AccountNumber = GenerateUniqueAccountNumber();
            CNIC = cnic;
            FullName = fullname;
            Username = username;
            SetPassword(rawPassword); //send password to a method that validates and hashes it
            DOB = dob;
            PhoneNumber = phoneNumber;
            Balance = 1000M; //m tells .NET that this is a decimal, not a double or float 
        }
        private string GenerateUniqueAccountNumber()
        {
            return $"ACC{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}";
        }
        public void SetPassword(string rawPassword)
        {
            
            //simple ex : using hash library to encrypt
            PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(rawPassword));
            //Real systems use BCrypt, PBKDF2, or ASP.NET Identity instead for secure hashing.
        }
        public bool CheckPassword (string enteredpassword)
        {
            var enteredHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(enteredpassword));
            return enteredHash == PasswordHash;
        }
        

    }
}
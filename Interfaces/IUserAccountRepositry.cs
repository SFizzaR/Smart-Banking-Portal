using BankingSystem.Entities;

namespace BankingSystem.Interfaces
{
    public interface IUserAccountRespositry
    {
        void Create(UserAccount user); //saves a new user to DB
        UserAccount GetByUsername(string username); //Used During Login to fetch user by username
        UserAccount GetByAccountNumber(string accountNumber); //fetch a user by their account number
        bool UsernameExists(string username); //check if username is taken during sign up 
        bool CnicExists(string cnic); //same cnic but for check
        void Update(UserAccount user);
    }
}
//why user an interface ? It follows the D in SOLID -> Dependency Inversion Principle - high level modules should not depend on low level modules , both should depend on interfaces 
//my business logic will not depend on EF CORE OR SQL, Just on this interface
//makes unit testing and swapping database tech (sql, mongo etc) super easy.
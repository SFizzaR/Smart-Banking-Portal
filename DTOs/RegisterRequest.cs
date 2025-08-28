namespace BankingSystem.Models
{
    public class RegisterRequest
    {
        public string CNIC { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime DOB { get; set; }
        public string PhoneNumber { get; set; }
    }
}

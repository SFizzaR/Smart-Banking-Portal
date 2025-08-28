using BankingSystem.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Transaction
{
    public int Id { get; set; }

    [Required]
    public string FromAccount { get; set; }

    [Required]
    public string ToAccount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.Now;

    public TransactionCategory Category { get; set; }  // Enum — required

    public string? Description { get; set; }  // NEW — optional user-written info like “internet bill”

    public bool IsSalaryCredit { get; set; }
}

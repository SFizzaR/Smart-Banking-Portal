using BankingSystem.Enums;
using System.Text.Json.Serialization;

public class TransferRequest
{
    public string ToAccountNumber { get; set; }
    public decimal Amount { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]  // Add this
    public TransactionCategory Category { get; set; } // existing (will map to enum)

    public string Description { get; set; } // NEW: user-written detail

    public bool IsSalaryCredit { get; set; } = false;
}

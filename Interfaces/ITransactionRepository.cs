using BankingSystem.Entities;
using BankingSystem.Enums;
using System;
using System.Collections.Generic;

namespace BankingSystem.Interfaces
{
    public interface ITransactionRepository
    {
        void RecordTransaction(Transaction transaction);

        IEnumerable<Transaction> GetTransactionsByAccount(string accountNumber);

        IEnumerable<Transaction> GetFilteredTransactions(
            string accountNumber,
            DateTime? from,
            DateTime? to,
            TransactionCategory? category,
            bool? isSalaryCredit);
    }
}

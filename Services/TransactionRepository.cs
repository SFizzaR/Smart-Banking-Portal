using BankingSystem.DBContext;
using BankingSystem.Entities;
using BankingSystem.Enums;
using BankingSystem.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace BankingSystem.Services
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _context;

        public TransactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public void RecordTransaction(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            _context.SaveChanges();
        }

        public IEnumerable<Transaction> GetFilteredTransactions(
    string accountNumber,
    DateTime? from,
    DateTime? to,
    TransactionCategory? category,
    bool? isSalaryCredit)
        {
            var query = _context.Transactions
                .Where(t => t.FromAccount == accountNumber || t.ToAccount == accountNumber);

            if (from.HasValue)
                query = query.Where(t => t.Timestamp >= from.Value);

            if (to.HasValue)
                query = query.Where(t => t.Timestamp <= to.Value);

            if (category.HasValue)
                query = query.Where(t => t.Category == category.Value);

            if (isSalaryCredit.HasValue)
                query = query.Where(t => t.IsSalaryCredit == isSalaryCredit.Value);

            return query.OrderByDescending(t => t.Timestamp).ToList();
        }
        public IEnumerable<Transaction> GetTransactionsByAccount(string accountNumber)
        {
            return _context.Transactions
                .Where(t => t.FromAccount == accountNumber || t.ToAccount == accountNumber)
                .OrderByDescending(t => t.Timestamp)
                .ToList();
        }


    }
}

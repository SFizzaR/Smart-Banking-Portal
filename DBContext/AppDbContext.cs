//EF Core Database class that talks to SQL Server, knows about the tables in your database, controls adding / deleting / updating data 
using Microsoft.EntityFrameworkCore;
using BankingSystem.Entities;

namespace BankingSystem.DBContext
{
    public class AppDbContext : DbContext //This means: I’m telling EF Core what my database looks like.
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { } //This means: I’m telling EF Core what my database looks like.
        public DbSet<UserAccount> UserAccounts { get; set; } //This line says: “EF Core, please create a table called UserAccounts in SQL for me, based on this C# class.”
        public DbSet<Transaction> Transactions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Add this line below
            modelBuilder.Entity<Transaction>()
                .Property(t => t.Category)
                .HasConversion<string>();
        }


    }
}
//This tells EF Core to create a UserAccounts table based on your class.

//lAYERS : Core -> business logic, Infrastructure -> Data Access( EF, SQL) , Web/API/UI -> Presentation , program.cs, controllers

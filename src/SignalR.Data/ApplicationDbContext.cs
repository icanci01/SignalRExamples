using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SignalR.Data.Models;

namespace SignalRExamples.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Orders { get; set; }
    public DbSet<ChatRoom> ChatRoom { get; set; }
    public DbSet<MessageHistory> MessageHistory { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ChatRoom>()
            .HasMany(c => c.MessageHistory)
            .WithOne(e => e.ChatRoom)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<MessageHistory>()
            .HasOne(e => e.ChatRoom)
            .WithMany(c => c.MessageHistory)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
using Microsoft.AspNetCore.SignalR;
using SignalRExamples.Data;

namespace SignalRExamples.Hubs;

public class AdvancedChatHub : Hub
{
    private readonly ApplicationDbContext _dbContext;

    public AdvancedChatHub(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
}
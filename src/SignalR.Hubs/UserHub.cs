using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalR.Data;
using SignalR.Data.Models;

namespace SignalR.Hubs;

public class UserHub : Hub
{
    private readonly AppDbContext _dbContext;
    public static int TotalUsers { get; set; }

    public UserHub(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public override Task OnConnectedAsync()
    {
        TotalUsers++;
        Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        TotalUsers--;
        Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
        return base.OnDisconnectedAsync(exception);
    }

    public async Task NewWindowLoaded()
    {
        var pageStatistic = await _dbContext.PageStatistics.Where(x => x.Id == 1).FirstOrDefaultAsync();

        if (pageStatistic == null)
        {
            pageStatistic = new PageStatistic { TotalViews = 1 };
            await _dbContext.PageStatistics.AddAsync(pageStatistic);
            await _dbContext.SaveChangesAsync();
        }
        else
        {
            pageStatistic.TotalViews++;
            _dbContext.PageStatistics.Update(pageStatistic);
            await _dbContext.SaveChangesAsync();
        }

        await Clients.All.SendAsync("updateTotalViews", pageStatistic.TotalViews);
    }
}
using Microsoft.AspNetCore.SignalR;
using SignalR.Api.Common;

namespace SignalR.Api.Hubs;

public class DeathlyHallowsHub : Hub
{
    public Dictionary<string, int> GetRaceStatus()
    {
        return SD.DeathlyHallowRace;
    }
}
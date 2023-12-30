using Microsoft.AspNetCore.SignalR;
using SignalR.Hubs.Common;

namespace SignalR.Hubs;

public class DeathlyHallowsHub : Hub
{
    public Dictionary<string, int> GetRaceStatus()
    {
        return SD.DeathlyHallowRace;
    }
}
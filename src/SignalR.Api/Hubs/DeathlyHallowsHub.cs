using Microsoft.AspNetCore.SignalR;
using SignalRExamples.Common;

namespace SignalRExamples.Hubs;

public class DeathlyHallowsHub : Hub
{
    public Dictionary<string, int> GetRaceStatus()
    {
        return SD.DeathlyHallowRace;
    }
}
using Microsoft.AspNetCore.SignalR;
using SignalR.Hubs.Common;

namespace SignalR.Hubs;

public class VotingHub : Hub
{
    public Dictionary<string, int> GetVotingStatus()
    {
        return SD.SpaceMissionVoting;
    }
}
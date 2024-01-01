using Microsoft.AspNetCore.SignalR;
using SignalR.Hubs.Common;
using SignalR.Hubs.DTOs;

namespace SignalR.Hubs;

public class VotingHub : Hub
{
    public VotingStatus GetVotingStatus()
    {
        return new VotingStatus { VotingStatusDictionary = SD.SpaceMissionVoting, HasVoted = false };
    }
}
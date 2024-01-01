namespace SignalR.Hubs.DTOs;

public class VotingStatus
{
    public Dictionary<string, int> VotingStatusDictionary { get; set; }
    public bool HasVoted { get; set; }
}
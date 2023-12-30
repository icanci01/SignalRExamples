﻿namespace SignalR.Api.Hubs;

public static class HubConnections
{
    public static Dictionary<string, List<string>> Users = new();

    public static bool HasUserConnection(string UserId, string ConnectionId)
    {
        try
        {
            if (Users.TryGetValue(UserId, out var user))
                return user.Any(p => p.Contains(ConnectionId));
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return false;
    }

    public static bool HasUser(string UserId)
    {
        try
        {
            if (Users.TryGetValue(UserId, out var user))
                return user.Any();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return false;
    }

    public static void AddUserConnection(string UserId, string ConnectionId)
    {
        if (!string.IsNullOrEmpty(UserId) && !HasUserConnection(UserId, ConnectionId))
        {
            if (Users.TryGetValue(UserId, out var value))
                value.Add(ConnectionId);
            else
                Users.Add(UserId, new List<string> { ConnectionId });
        }
    }

    public static List<string> OnlineUsers()
    {
        return Users.Keys.ToList();
    }
}
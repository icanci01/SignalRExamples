using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using SignalR.Data;
using SignalR.Hubs.Helpers;

namespace SignalR.Hubs;

public class AdvancedChatHub : Hub
{
    private readonly ApplicationDbContext _dbContext;

    public AdvancedChatHub(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public override Task OnConnectedAsync()
    {
        var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!string.IsNullOrEmpty(userId))
        {
            var userName = _dbContext.Users.FirstOrDefault(u => u.Id == userId)?.UserName;
            Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", userId, userName, HubConnections.HasUser(userId));

            HubConnections.AddUserConnection(userId, Context.ConnectionId);
        }

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            throw new Exception("User not found");

        if (HubConnections.HasUserConnection(userId, Context.ConnectionId))
        {
            var userConnections = HubConnections.Users[userId];
            userConnections.Remove(Context.ConnectionId);

            if (userConnections.Any())
                HubConnections.Users.Add(userId, userConnections);
        }

        var userName = _dbContext.Users.FirstOrDefault(u => u.Id == userId)?.UserName;
        Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisconnected", userId, userName, HubConnections.HasUser(userId));

        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
    {
        var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = _dbContext.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

        if (string.IsNullOrEmpty(userId))
            throw new Exception("User not found");

        await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, userId, userName);
    }

    public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
    {
        var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = _dbContext.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

        if (string.IsNullOrEmpty(userId))
            throw new Exception("User not found");

        await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, userId, userName);
    }

    public async Task SendPublicMessage(int roomId, string roomName, string message)
    {
        var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = _dbContext.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

        if (string.IsNullOrEmpty(userId))
            throw new Exception("User not found");

        await Clients.All.SendAsync("ReceivePublicMessage", roomId, roomName, message, userId, userName);
    }

    public async Task SendPrivateMessage(string receiverId, string receiverName, string message)
    {
        var senderId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
        var senderName = _dbContext.Users.FirstOrDefault(u => u.Id == senderId)?.UserName;

        if (string.IsNullOrEmpty(senderId))
            throw new Exception("User not found");

        var users = new[] { senderId, receiverId };

        await Clients.Users(users).SendAsync("ReceivePrivateMessage", senderId, senderName, receiverId, receiverName, message, Guid.NewGuid());
    }

    public async Task SendOpenPrivateChat(string receiverId)
    {
        var userId = Context.User!.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = _dbContext.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

        await Clients.User(receiverId).SendAsync("ReceiveOpenPrivateChat", userId, userName);
    }

    public async Task SendDeletePrivateChat(string chartId)
    {
        await Clients.All.SendAsync("ReceiveDeletePrivateChat", chartId);
    }
}
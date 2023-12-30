using Microsoft.AspNetCore.SignalR;

namespace SignalR.Api.Hubs;

public class NotificationsHub : Hub
{
    public static List<string> Notifications { get; set; } = new();
    public static int NotificationCount { get; set; }

    public async Task SendNotification(string message)
    {
        if (!string.IsNullOrWhiteSpace(message))
        {
            NotificationCount++;
            Notifications.Add(message);
            await Clients.All.SendAsync("notificationReceived", message, NotificationCount);
        }
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("notificationStatus", Notifications, NotificationCount);
        await base.OnConnectedAsync();
    }
}
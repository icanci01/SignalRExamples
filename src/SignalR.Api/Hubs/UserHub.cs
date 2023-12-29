using Microsoft.AspNetCore.SignalR;

namespace SignalRExamples.Hubs
{
    public class UserHub : Hub
    {
        public static int TotalViewsSimple { get; set; } = 0;
        public static int TotalViewsReturn { get; set; } = 0;
        public static string TotalViewsParams { get; set; } = "";
        public static int TotalUsers { get; set; } = 0;

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
            TotalViewsSimple++;
            await Clients.All.SendAsync("updateTotalViews", TotalViewsSimple);
        }

        /*
        public async Task<string> NewWindowLoadedWithReturn()
        {
            TotalViewsReturn++;
            await Clients.All.SendAsync("updateTotalViewsWithReturn", TotalViewsReturn);
            return $"Total views: {TotalViewsReturn}";
        }

        public async Task NewWindowLoadedWithParams(string message)
        {
            TotalViewsParams = message + " " + TotalViewsSimple;
            await Clients.All.SendAsync("updateTotalViewsWithParams", TotalViewsParams);
        }
        */

        /*
        // All signalR connections
        await Clients.All.SendAsync("ReceiveMessage", user, message);
        await Client.Caller.SendAsync("ReceiveMessage", user, message);
        await Clients.Others.SendAsync("ReceiveMessage", user, message);
        await Clients.Client("Connection Id - A").SendAsync("ReceiveMessage", user, message);
        await Clients.Clients("Connection Id - A", "Connection Id - B").SendAsync("ReceiveMessage", user, message);
        await Clients.AllExcept("Connection Id - A").SendAsync("ReceiveMessage", user, message);
        await Clients.User("ben@mail.com").SendAsync("ReceiveMessage", user, message);
        await Clients.Users("ben@mail.com", "alice@mail.com").SendAsync("ReceiveMessage", user, message);
        await Groups.AddToGroupAsync(Context.ConnectionId, "GroupName");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "GroupName");
        await Clients.Group("admin").SendAsync("ReceiveMessage", user, message);
        await Clients.OthersInGroup("admin").SendAsync("ReceiveMessage", user, message);
        await Clients.Groups("admin", "moderator").SendAsync("ReceiveMessage", user, message);
        await Clients.GroupExcept("admin", "bob@mail.com").SendAsync("ReceiveMessage", user, message);
        */
    }
}
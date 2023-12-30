using Microsoft.AspNetCore.SignalR;

namespace SignalR.Api.Hubs;

public class SubscribeListsHub : Hub
{
    public static List<string> GroupsJoined { get; set; } = new();

    public async Task JoinSubscriptionList(string listName)
    {
        var groupName = Context.ConnectionId + ":" + listName;

        if (!GroupsJoined.Contains(groupName))
        {
            GroupsJoined.Add(groupName);

            var subscriptionList = "";
            foreach (var str in GroupsJoined)
                if (str.Contains(Context.ConnectionId))
                    subscriptionList += str.Split(':')[1] + " ";

            await Clients.Caller.SendAsync("subscriptionStatus", subscriptionList, listName, true);
            await Clients.Others.SendAsync("subscriptionUpdate", listName, true);
            await Groups.AddToGroupAsync(Context.ConnectionId, listName);
        }
    }

    public async Task LeaveSubscriptionList(string listName)
    {
        var groupName = Context.ConnectionId + ":" + listName;

        if (GroupsJoined.Contains(groupName))
        {
            GroupsJoined.Remove(groupName);

            var subscriptionList = "";
            foreach (var str in GroupsJoined)
                if (str.Contains(Context.ConnectionId))
                    subscriptionList += str.Split(':')[1] + " ";

            await Clients.Caller.SendAsync("subscriptionStatus", subscriptionList, listName, false);
            await Clients.Others.SendAsync("subscriptionUpdate", listName, false);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, listName);
        }
    }

    public async Task TriggerListNotify(string listName)
    {
        await Clients.Group(listName).SendAsync("triggerListNotification", listName);
    }
}
namespace SignalRExamples.Models.ViewModel;

public class ChatViewModel
{
    public ChatViewModel()
    {
        Rooms = new List<ChatRoom>();
    }

    public int MaxRoomsAllowed { get; set; }

    public IList<ChatRoom> Rooms { get; set; }

    public string? UserId { get; set; }

    public bool AllowAddRoom => Rooms.Count < MaxRoomsAllowed;
}
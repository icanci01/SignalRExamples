namespace SignalR.Data.Models;

public class MessageHistory
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public string? UserName { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedDate { get; set; }
    public int ChatRoomId { get; set; }
    public ChatRoom? ChatRoom { get; set; }
}
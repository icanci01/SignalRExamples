using System.ComponentModel.DataAnnotations;

namespace SignalR.Data.Models;

public class ChatRoom
{
    [Key] public int Id { get; set; }

    [Required] public string Name { get; set; } = string.Empty;

    public IList<MessageHistory> MessageHistory { get; set; } = new List<MessageHistory>();
}
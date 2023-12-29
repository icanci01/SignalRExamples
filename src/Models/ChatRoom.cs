using System.ComponentModel.DataAnnotations;

namespace SignalRExamples.Models;

public class ChatRoom
{
    [Key] public int Id { get; set; }

    [Required] public string Name { get; set; } = string.Empty;
}
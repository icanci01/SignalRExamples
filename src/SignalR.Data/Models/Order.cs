using System.ComponentModel.DataAnnotations;

namespace SignalR.Data.Models;

public class Order
{
    [Key] public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public int Count { get; set; }
}
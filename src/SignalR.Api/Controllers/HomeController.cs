using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalR.Api.ViewModel;
using SignalR.Data;
using SignalR.Data.Models;
using SignalR.Hubs;
using SignalR.Hubs.Common;

namespace SignalR.Api.Controllers;

public class HomeController : Controller
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<VotingHub> _spaceMissionHubContext;
    private readonly IHubContext<OrderHub> _orderHubContext;

    public HomeController(AppDbContext dbContext,
        IHubContext<VotingHub> spaceMissionHubContext,
        IHubContext<OrderHub> orderHubContext)
    {
        _spaceMissionHubContext = spaceMissionHubContext;
        _orderHubContext = orderHubContext;
        _dbContext = dbContext;
    }

    public IActionResult Index()
    {
        return View();
    }

    public async Task<IActionResult> SpaceMission(string type)
    {
        if (SD.SpaceMissionVoting.TryGetValue(type, out var value))
            SD.SpaceMissionVoting[type] = ++value;

        await _spaceMissionHubContext.Clients.All.SendAsync("updateVotingCount",
            SD.SpaceMissionVoting[SD.Apollo],
            SD.SpaceMissionVoting[SD.Voyager],
            SD.SpaceMissionVoting[SD.Hubble],
            SD.SpaceMissionVoting[SD.Mars]);

        return Accepted();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    public IActionResult Voting()
    {
        return View();
    }

    public IActionResult SubscribeLists()
    {
        return View();
    }

    public IActionResult Notifications()
    {
        return View();
    }

    public IActionResult BasicChat()
    {
        return View();
    }

    [Authorize]
    public IActionResult AdvancedChat()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        ChatViewModel chatViewModel = new()
        {
            Rooms = _dbContext.ChatRoom.ToList(),
            MaxRoomsAllowed = 4,
            UserId = userId
        };

        return View(chatViewModel);
    }

    public IActionResult FinalChat()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        ChatViewModel chatViewModel = new()
        {
            Rooms = _dbContext.ChatRoom.ToList(),
            MaxRoomsAllowed = 4,
            UserId = userId
        };

        return View(chatViewModel);
    }

    [ActionName("Order")]
    public Task<IActionResult> Order()
    {
        string[] name = { "Bhrugen", "Ben", "Jess", "Laura", "Ron" };
        string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

        var index = new Random().Next(name.Length);

        var order = new Order
        {
            Name = name[index],
            ItemName = itemName[index],
            Count = index
        };

        return Task.FromResult<IActionResult>(View(order));
    }

    [ActionName("Order")]
    [HttpPost]
    public async Task<IActionResult> OrderPost(Order order)
    {
        _dbContext.Orders.Add(order);
        _dbContext.SaveChanges();
        await _orderHubContext.Clients.All.SendAsync("newOrderPlaced");
        return RedirectToAction(nameof(Order));
    }

    [ActionName("OrderList")]
    public Task<IActionResult> OrderList()
    {
        return Task.FromResult<IActionResult>(View());
    }

    [HttpGet]
    public IActionResult GetAllOrder()
    {
        var productList = _dbContext.Orders.ToList();
        return Json(new { data = productList });
    }
}
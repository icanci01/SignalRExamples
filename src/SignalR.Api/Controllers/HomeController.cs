using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalR.Data.Models;
using SignalRExamples.Common;
using SignalRExamples.Data;
using SignalRExamples.Hubs;
using SignalRExamples.Models;
using SignalRExamples.Models.ViewModel;

namespace SignalRExamples.Controllers;

public class HomeController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IHubContext<DeathlyHallowsHub> _deathlyHallowsHubContext;
    private readonly ILogger<HomeController> _logger;
    private readonly IHubContext<OrderHub> _orderHubContext;

    public HomeController(ILogger<HomeController> logger,
        IHubContext<DeathlyHallowsHub> deathlyHallowsHubContext,
        IHubContext<OrderHub> orderHubContext,
        ApplicationDbContext dbContext)
    {
        _logger = logger;
        _deathlyHallowsHubContext = deathlyHallowsHubContext;
        _orderHubContext = orderHubContext;
        _dbContext = dbContext;
    }

    public IActionResult Index()
    {
        return View();
    }

    public async Task<IActionResult> DeathlyHallows(string type)
    {
        if (SD.DeathlyHallowRace.ContainsKey(type))
            SD.DeathlyHallowRace[type]++;

        await _deathlyHallowsHubContext.Clients.All.SendAsync("updateDeathlyHallowCount",
            SD.DeathlyHallowRace[SD.Wand],
            SD.DeathlyHallowRace[SD.Sword],
            SD.DeathlyHallowRace[SD.Stone],
            SD.DeathlyHallowRace[SD.Cloak]);

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

    public IActionResult DeathlyHallow()
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

        var rand = new Random();
        // Generate a random index less than the size of the array.
        var index = rand.Next(name.Length);

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
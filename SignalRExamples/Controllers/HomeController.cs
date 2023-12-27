using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRExamples.Common;
using SignalRExamples.Hubs;
using SignalRExamples.Models;

namespace SignalRExamples.Controllers;

public class HomeController : Controller
{
    private readonly IHubContext<DeathlyHallowsHub> _deathlyHallowsHubContext;
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger, IHubContext<DeathlyHallowsHub> deathlyHallowsHubContext)
    {
        _logger = logger;
        _deathlyHallowsHubContext = deathlyHallowsHubContext;
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
}
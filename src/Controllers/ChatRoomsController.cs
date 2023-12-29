using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignalRExamples.Data;
using SignalRExamples.Models;

namespace SignalRExamples.Controllers;

[ApiController]
public class ChatRoomsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public ChatRoomsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    [Route("api/[controller]/GetChatRooms")]
    public async Task<ActionResult<IEnumerable<ChatRoom>>> GetChatRoom()
    {
        return await _dbContext.ChatRoom.ToListAsync();
    }

    [HttpGet]
    [Route("api/[controller]/GetChatUsers")]
    public async Task<ActionResult<IEnumerable<object>>> GetChatUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var users = await _dbContext.Users.ToListAsync();

        return users.Where(u => u.Id != userId).Select(u => new { u.Id, u.UserName }).ToList();
    }

    [HttpPost]
    [Route("api/[controller]/PostChatRoom")]
    public async Task<ActionResult<ChatRoom>> PostChatRoom(ChatRoom chatRoom)
    {
        _dbContext.ChatRoom.Add(chatRoom);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction("GetChatRoom", new { id = chatRoom.Id }, chatRoom);
    }

    [HttpDelete]
    [Route("api/[controller]/DeleteChatRoom/{id}")]
    public async Task<IActionResult> DeleteChatRoom(int id)
    {
        var chatRoom = await _dbContext.ChatRoom.FindAsync(id);

        if (chatRoom == null) return NotFound();

        _dbContext.ChatRoom.Remove(chatRoom);
        await _dbContext.SaveChangesAsync();

        var room = await _dbContext.ChatRoom.FirstOrDefaultAsync();

        return Ok(new { deleted = id, selected = room?.Id ?? 0 });
    }
}
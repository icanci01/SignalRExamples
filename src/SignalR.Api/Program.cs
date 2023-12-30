using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SignalR.Api.Hubs;
using SignalR.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

builder.Services.AddSignalR();

// var connectionAzureSignalR = builder.Configuration.GetConnectionString("AzureSignalRConnection") ?? throw new InvalidOperationException("Connection string 'AzureSignalRConnection' not found.");
// builder.Services.AddSignalR().AddAzureSignalR(connectionAzureSignalR);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

// SignalR Hubs
app.MapHub<UserHub>("/hubs/userCount");
app.MapHub<DeathlyHallowsHub>("/hubs/deathlyHallows");
app.MapHub<SubscribeListsHub>("/hubs/subscribeLists");
app.MapHub<NotificationsHub>("/hubs/notifications");
app.MapHub<BasicChatHub>("/hubs/basicChat");
app.MapHub<AdvancedChatHub>("/hubs/advancedChat");
app.MapHub<OrderHub>("/hubs/order");

app.Run();
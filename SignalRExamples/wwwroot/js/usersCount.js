// Create connection
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build();

/*
// Change transport type
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets).build(); // Default
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount", signalR.HttpTransportType.ServerSentEvents).build();
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount", signalR.HttpTransportType.LongPolling).build();
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount", signalR.HttpTransportType.None).build(); // Not recommended
*/

/*
// Configure logging
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").configureLogging(signalR.LogLevel.Information).build(); // Default
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").configureLogging(signalR.LogLevel.Trace).build();
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").configureLogging(signalR.LogLevel.Debug).build();
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").configureLogging(signalR.LogLevel.Warning).build();
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").configureLogging(signalR.LogLevel.Error).build();
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").configureLogging(signalR.LogLevel.Critical).build();
let connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").configureLogging(signalR.LogLevel.None).build();
*/

// Connect to methods that hub invokes aka receive notifications from hub
connectionUserCount.on("updateTotalViews", (value) => {
    let newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value;
});

/*
connectionUserCount.on("updateTotalViewsReturn", (value) => {
    let newCountSpan = document.getElementById("totalViewsReturn");
    newCountSpan.innerText = value;
});

connectionUserCount.on("updateTotalViewsWithParams", (value) => {
    let newCountSpan = document.getElementById("totalViewsParams");
    newCountSpan.innerText = value;
});
*/

connectionUserCount.on("updateTotalUsers", (value) => {
    let newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = value;
});

// Invoke hub methods aka send notifications
function newWindowLoadedOnClient() {
    // Send example
    connectionUserCount.send("NewWindowLoaded");

    /*
    // Invoke example with return
    connectionUserCount.invoke("NewWindowLoadedWithReturn").then((value) => {
        let newCountSpan = document.getElementById("totalViewsReturn");
        newCountSpan.innerText = value;
    });

    // Invoke example with parameter
    connectionUserCount.send("NewWindowLoadedWithParams", "Hello World");
    */
}

// Start connection
function fulfilled() {
    // do something on start
    console.log("Connection to User Hub Successful");
    newWindowLoadedOnClient();
}

function rejected() {
    // rejected logs
    console.log("Connection to User Hub Rejected");
}

connectionUserCount.start().then(fulfilled, rejected);
// Create connection
let connectionUserCount = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.None)
    .withAutomaticReconnect()
    .withUrl("/hubs/userCount")
    .build();

// Connect to methods that hub invokes aka receive notifications from hub
connectionUserCount.on("updateTotalViews", (value) => {
    let newCountSpan = document.getElementById("totalVisits");
    newCountSpan.innerText = value;
});

connectionUserCount.on("updateTotalUsers", (value) => {
    let newCountSpan = document.getElementById("activeConnections");
    newCountSpan.innerText = value;
});

// Invoke hub methods aka send notifications
function newWindowLoadedOnClient() {
    connectionUserCount.send("NewWindowLoaded");
}

connectionUserCount.onreconnecting((error) => {
    setStatusReconnecting();
});

connectionUserCount.onreconnected((connectionId) => {
    setStatusConnected();
});

connectionUserCount.onclose(() => {
    setStatusDisconnected();
});

// Start connection
function fulfilled() {
    console.log("Connection to User Hub Successful");
    setStatusConnected();
    newWindowLoadedOnClient();
}

function rejected() {
    console.log("Connection to User Hub Rejected");
}

connectionUserCount.start().then(fulfilled, rejected);
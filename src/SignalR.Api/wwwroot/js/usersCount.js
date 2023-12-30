// Create connection
let connectionUserCount = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 5000, null])
    .configureLogging(signalR.LogLevel.None)
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
connectionUserCount.onreconnecting(() => {
    setStatusReconnecting();
});

connectionUserCount.onreconnected(() => {
    setStatusConnected();
});

connectionUserCount.onclose(() => {
    setStatusDisconnected();
});

// Start connection
function fulfilled() {
    setStatusConnected();
    connectionUserCount.send("NewWindowLoaded");
}

function rejected() {
    setStatusFailed();
}

connectionUserCount.start().then(fulfilled, rejected);
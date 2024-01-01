function setStatusConnected() {
    document.getElementById("connectionHubStatusText").innerText = "Connected";
    document.getElementById("connectionStatus").style.color = "green";
}

function setStatusReconnecting() {
    document.getElementById("connectionHubStatusText").innerText = "Reconnecting";
    document.getElementById("connectionStatus").style.color = "orange";
}

function setStatusDisconnected() {
    document.getElementById("connectionHubStatusText").innerText = "Disconnected";
    document.getElementById("connectionStatus").style.color = "red";
}

function setStatusFailed() {
    document.getElementById("connectionHubStatusText").innerText = "Failed";
    document.getElementById("connectionStatus").style.color = "red";
}
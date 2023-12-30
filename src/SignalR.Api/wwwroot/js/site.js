function setStatusConnected() {
    document.getElementById("connectionStatusText").innerText = "Connected";
    document.getElementById("connectionStatus").style.color = "green";
}

function setStatusReconnecting() {
    document.getElementById("connectionStatusText").innerText = "Reconnecting";
    document.getElementById("connectionStatus").style.color = "orange";
}

function setStatusDisconnected() {
    document.getElementById("connectionStatusText").innerText = "Disconnected";
    document.getElementById("connectionStatus").style.color = "red";
}

function setStatusFailed() {
    document.getElementById("connectionStatusText").innerText = "Failed";
    document.getElementById("connectionStatus").style.color = "red";
}
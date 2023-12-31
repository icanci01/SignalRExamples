let apolloCounter = document.getElementById("apolloCounter");
let swordElement = document.getElementById("voyagerCounter");
let hubbleCounter = document.getElementById("hubbleCounter");
let marsCounter = document.getElementById("marsCounter");

// Create connection
let connectionVoting = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 5000, null])
    .configureLogging(signalR.LogLevel.None)
    .withUrl("/hubs/voting")
    .build();

// Connect to methods that hub invokes aka receive notifications from hub
connectionVoting.on("updateVotingCount", (apollo, voyager, hubble, mars) => {
    apolloCounter.innerText = apollo.toString();
    swordElement.innerText = voyager.toString();
    hubbleCounter.innerText = hubble.toString();
    marsCounter.innerText = mars.toString();
});

connectionVoting.onreconnecting(() => {
    setStatusReconnecting();
});

connectionVoting.onreconnected(() => {
    setStatusConnected();
});

connectionVoting.onclose(() => {
    setStatusDisconnected();
});

// Start connection
function fulfilled() {
    setStatusConnected();
    connectionVoting.invoke("GetVotingStatus").then((value) => {
        apolloCounter.innerText = value["apollo"].toString();
        swordElement.innerText = value["voyager"].toString();
        hubbleCounter.innerText = value["hubble"].toString();
        marsCounter.innerText = value["mars"].toString();
    });
}

function rejected() {
    setStatusFailed();
}

connectionVoting.start().then(fulfilled, rejected);

document.getElementById("btnApollo").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/SpaceMission?type=apollo", {
        method: "GET"
    }).then();
});

document.getElementById("btnVoyager").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/SpaceMission?type=voyager", {
        method: "GET"
    }).then();
});

document.getElementById("btnHubble").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/SpaceMission?type=hubble", {
        method: "GET"
    }).then();
});

document.getElementById("btnMars").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/SpaceMission?type=mars", {
        method: "GET"
    }).then();
});
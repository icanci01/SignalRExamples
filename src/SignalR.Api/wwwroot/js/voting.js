let apolloCounter = document.getElementById("apolloCounter");
let swordElement = document.getElementById("voyagerCounter");
let hubbleCounter = document.getElementById("hubbleCounter");
let marsCounter = document.getElementById("marsCounter");

// Example JavaScript function to update a progress bar and counter
function updateMissionProgress(missionId, votes, totalVotes) {
    let percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
    document.getElementById(missionId + "Progress").style.width = percent + "%";
    document.getElementById(missionId + "Counter").textContent = votes + " Votes";
    document.getElementById(missionId + "Percentage").textContent = percent.toFixed(2) + "%";
}

// Create connection
let connectionVoting = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 5000, null])
    .configureLogging(signalR.LogLevel.None)
    .withUrl("/hubs/voting")
    .build();

// Connect to methods that hub invokes aka receive notifications from hub
connectionVoting.on("updateVotingCount", (apollo, voyager, hubble, mars) => {
    let totalVotes = apollo + voyager + hubble + mars;
    updateMissionProgress("apollo", apollo, totalVotes);
    updateMissionProgress("voyager", voyager, totalVotes);
    updateMissionProgress("hubble", hubble, totalVotes);
    updateMissionProgress("mars", mars, totalVotes);
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
        let totalVotes = value["apollo"] + value["voyager"] + value["hubble"] + value["mars"];
        updateMissionProgress("apollo", value["apollo"], totalVotes);
        updateMissionProgress("voyager", value["voyager"], totalVotes);
        updateMissionProgress("hubble", value["hubble"], totalVotes);
        updateMissionProgress("mars", value["mars"], totalVotes);
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
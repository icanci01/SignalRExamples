let missions = ["apollo", "voyager", "hubble", "mars"];
let missionsCapitalized = missions.map(mission => mission.charAt(0).toUpperCase() + mission.slice(1));

disableVotingButtons(missionsCapitalized);

let connectionVoting = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 5000, null])
    .configureLogging(signalR.LogLevel.None)
    .withUrl("/hubs/voting")
    .build();

connectionVoting.on("updateVotingCount", (apollo, voyager, hubble, mars) => {
    let totalVotes = apollo + voyager + hubble + mars;
    updateMissionProgress("apollo", apollo, totalVotes);
    updateMissionProgress("voyager", voyager, totalVotes);
    updateMissionProgress("hubble", hubble, totalVotes);
    updateMissionProgress("mars", mars, totalVotes);
});

function fetchAndProcessVotingStatus() {
    connectionVoting.invoke("GetVotingStatus").then((statusValue) => {
        if (statusValue["hasVoted"]) {
            disableVotingForSession(missionsCapitalized);
        } else {
            enableVotingButtons(missionsCapitalized);
        }

        const votingStatusDictionary = statusValue["votingStatusDictionary"];
        let totalVotes = missions.reduce((total, mission) => total + votingStatusDictionary[mission], 0);

        missions.forEach(mission => {
            updateMissionProgress(mission, votingStatusDictionary[mission], totalVotes);
        });
    });
}

connectionVoting.onreconnecting(() => {
    setStatusReconnecting();
    disableVotingButtons(missionsCapitalized);
});

connectionVoting.onreconnected(() => {
    setStatusConnected();
    fetchAndProcessVotingStatus();
});

connectionVoting.onclose(() => {
    setStatusDisconnected();
    disableVotingButtons(missionsCapitalized);
});

function fulfilled() {
    setStatusConnected();
    fetchAndProcessVotingStatus();
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
    disableVotingForSession(missionsCapitalized);
});

document.getElementById("btnVoyager").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/SpaceMission?type=voyager", {
        method: "GET"
    }).then();
    disableVotingForSession(missionsCapitalized);
});

document.getElementById("btnHubble").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/SpaceMission?type=hubble", {
        method: "GET"
    }).then();
    disableVotingForSession(missionsCapitalized);
});

document.getElementById("btnMars").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/SpaceMission?type=mars", {
        method: "GET"
    }).then();
    disableVotingForSession(missionsCapitalized);
});
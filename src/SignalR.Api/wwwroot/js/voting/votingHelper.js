function updateMissionProgress(missionId, votes, totalVotes) {
    let percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
    document.getElementById(missionId + "Progress").style.width = percent + "%";
    document.getElementById(missionId + "Counter").textContent = votes + " Votes";
    document.getElementById(missionId + "Percentage").textContent = percent.toFixed(2) + "%";
}

function disableVotingButtons(missionsCapitalized) {
    missionsCapitalized.forEach(id => {
        document.getElementById("btn" + id).disabled = true;
    });
}

function enableVotingButtons(missionsCapitalized) {
    missionsCapitalized.forEach(id => {
        document.getElementById("btn" + id).disabled = false;
    });
}

function disableVotingForSession(missionsCapitalized) {
    disableVotingButtons(missionsCapitalized);
    document.getElementById("alertVoted").style.display = "block";
}
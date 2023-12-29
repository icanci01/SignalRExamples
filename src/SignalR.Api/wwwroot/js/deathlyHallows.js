let wandElement = document.getElementById("wandCounter");
let swordElement = document.getElementById("swordCounter");
let stoneElement = document.getElementById("stoneCounter");
let cloakElement = document.getElementById("cloakCounter");

// Create connection
let connectionDeathlyHallows = new signalR.HubConnectionBuilder().withUrl("/hubs/deathlyHallows").build();

// Connect to methods that hub invokes aka receive notifications from hub
connectionDeathlyHallows.on("updateDeathlyHallowCount", (wand, sword, stone, cloak) => {
    wandElement.innerText = wand.toString();
    swordElement.innerText = sword.toString();
    stoneElement.innerText = stone.toString();
    cloakElement.innerText = cloak.toString();
});

// Start connection
function fulfilled() {
    // do something on start
    console.log("Connection to Deathly Hallows Hub Successful");

    connectionDeathlyHallows.invoke("GetRaceStatus").then((value) => {
        wandElement.innerText = value["wand"].toString();
        swordElement.innerText = value["sword"].toString();
        stoneElement.innerText = value["stone"].toString();
        cloakElement.innerText = value["cloak"].toString();
    });
}

function rejected() {
    // rejected logs
    console.log("Connection to Deathly Hallows Hub Rejected");
}

connectionDeathlyHallows.start().then(fulfilled, rejected);

document.getElementById("btnWand").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/DeathlyHallows?type=wand", {
        method: "GET"
    }).then();
});

document.getElementById("btnSword").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/DeathlyHallows?type=sword", {
        method: "GET"
    }).then();
});

document.getElementById("btnStone").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/DeathlyHallows?type=stone", {
        method: "GET"
    }).then();
});

document.getElementById("btnCloak").addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/Home/DeathlyHallows?type=cloak", {
        method: "GET"
    }).then();
});
let lbl_listJoined = document.getElementById("lbl_listJoined");

let btn_newsUpdates = document.getElementById("btn_newsUpdates");
let btn_weatherAlerts = document.getElementById("btn_weatherAlerts");
let btn_stockMarket = document.getElementById("btn_stockMarket");
let btn_sportScores = document.getElementById("btn_sportScores");

let btn_un_newsUpdates = document.getElementById("btn_un_newsUpdates");
let btn_un_weatherAlerts = document.getElementById("btn_un_weatherAlerts");
let btn_un_stockMarket = document.getElementById("btn_un_stockMarket");
let btn_un_sportScores = document.getElementById("btn_un_sportScores");

let trigger_newsUpdates = document.getElementById("trigger_newsUpdates");
let trigger_weatherAlerts = document.getElementById("trigger_weatherAlerts");
let trigger_stockMarket = document.getElementById("trigger_stockMarket");
let trigger_sportScores = document.getElementById("trigger_sportScores");

// Create connection
let connectionSubscribeLists = new signalR.HubConnectionBuilder().withUrl("/hubs/subscribeLists").build();

// Connect to methods that hub invokes aka receive notifications from hub
btn_newsUpdates.addEventListener("click", function (event) {
    connectionSubscribeLists.send("JoinSubscriptionList", "News Updates");
    event.preventDefault();
});

btn_weatherAlerts.addEventListener("click", function (event) {
    connectionSubscribeLists.send("JoinSubscriptionList", "Weather Alerts");
    event.preventDefault();
});

btn_stockMarket.addEventListener("click", function (event) {
    connectionSubscribeLists.send("JoinSubscriptionList", "Stock Market");
    event.preventDefault();
});

btn_sportScores.addEventListener("click", function (event) {
    connectionSubscribeLists.send("JoinSubscriptionList", "Sport Scores");
    event.preventDefault();
});

btn_un_newsUpdates.addEventListener("click", function (event) {
    connectionSubscribeLists.send("LeaveSubscriptionList", "News Updates");
    event.preventDefault();
});

btn_un_weatherAlerts.addEventListener("click", function (event) {
    connectionSubscribeLists.send("LeaveSubscriptionList", "Weather Alerts");
    event.preventDefault();
});

btn_un_stockMarket.addEventListener("click", function (event) {
    connectionSubscribeLists.send("LeaveSubscriptionList", "Stock Market");
    event.preventDefault();
});

btn_un_sportScores.addEventListener("click", function (event) {
    connectionSubscribeLists.send("LeaveSubscriptionList", "Sport Scores");
    event.preventDefault();
});

trigger_newsUpdates.addEventListener("click", function (event) {
    connectionSubscribeLists.send("TriggerListNotify", "News Updates");
    event.preventDefault();
});

trigger_weatherAlerts.addEventListener("click", function (event) {
    connectionSubscribeLists.send("TriggerListNotify", "Weather Alerts");
    event.preventDefault();
});

trigger_stockMarket.addEventListener("click", function (event) {
    connectionSubscribeLists.send("TriggerListNotify", "Stock Market");
    event.preventDefault();
});

trigger_sportScores.addEventListener("click", function (event) {
    connectionSubscribeLists.send("TriggerListNotify", "Sport Scores");
    event.preventDefault();
});

connectionSubscribeLists.on("subscriptionStatus", (strGroupJoined, listName, hasSubscribed) => {
    lbl_listJoined.innerHTML = strGroupJoined;

    if (hasSubscribed) {
        // Subscribe button is hidden, show unsubscribe button
        switch (listName) {
            case "News Updates":
                btn_newsUpdates.style.display = "none";
                btn_un_newsUpdates.style.display = "";
                break;
            case "Weather Alerts":
                btn_weatherAlerts.style.display = "none";
                btn_un_weatherAlerts.style.display = "";
                break;
            case "Stock Market":
                btn_stockMarket.style.display = "none";
                btn_un_stockMarket.style.display = "";
                break;
            case "Sport Scores":
                btn_sportScores.style.display = "none";
                btn_un_sportScores.style.display = "";
                break;
            default:
                break;
        }

        toastr.success(`You have Subscribed Successfully. ${listName}`);

    } else {
        // Unsubscribe button is hidden, show subscribe button
        switch (listName) {
            case "News Updates":
                btn_newsUpdates.style.display = "";
                btn_un_newsUpdates.style.display = "none";
                break;
            case "Weather Alerts":
                btn_weatherAlerts.style.display = "";
                btn_un_weatherAlerts.style.display = "none";
                break;
            case "Stock Market":
                btn_stockMarket.style.display = "";
                btn_un_stockMarket.style.display = "none";
                break;
            case "Sport Scores":
                btn_sportScores.style.display = "";
                btn_un_sportScores.style.display = "none";
                break;
            default:
                break;
        }

        toastr.success(`You have Unsubscribed Successfully. ${listName}`);
    }
});

connectionSubscribeLists.on("subscriptionUpdate", (listName, hasSubscribed) => {
    if (hasSubscribed) {
        toastr.success(`A member has Subscribed to ${listName}`);
    } else {
        toastr.warning(`A member has Unsubscribed from ${listName}`);
    }
});

connectionSubscribeLists.on("triggerListNotification", (listName) => {
    toastr.success(`A notification for ${listName} has been triggered`);
});

// Start connection
function fulfilled() {
    // do something on start
    console.log("Connection to Subscribe Lists Hub Successful");
}

function rejected() {
    // rejected logs
    console.log("Connection to Subscribe Lists Hub Rejected");
}

connectionSubscribeLists.start().then(fulfilled, rejected);
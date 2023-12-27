let notificationMessage = document.getElementById("notificationInput");
let btn_sendNotification = document.getElementById("sendButton");
let notificationCounter = document.getElementById("notificationCounter");
let notificationsList = document.getElementById("messageList");

btn_sendNotification.disabled = true;

// Create connection
let connectionNotifications = new signalR.HubConnectionBuilder().withUrl("/hubs/notifications").build();

btn_sendNotification.addEventListener("click", function (event) {
    connectionNotifications.send("SendNotification", notificationMessage.value).then(function () {
        notificationMessage.value = "";
    });
    event.preventDefault();
});

// Connect to methods that hub invokes aka receive notifications from hub
connectionNotifications.on("notificationReceived", function (message, count) {
    let li = document.createElement("li");
    li.textContent = "Notification - " + message;
    notificationsList.appendChild(li);
    notificationCounter.innerHTML = "<span>(" + count + ")</span>";
});

// Start connection
function fulfilled() {
    btn_sendNotification.disabled = false;
    connectionNotifications.on("notificationStatus", (notifications, count) => {
        notifications.forEach(notification => {
            let li = document.createElement("li");
            li.textContent = "Notification - " + notification;
            notificationsList.appendChild(li);
        });
        notificationCounter.innerHTML = "<span>(" + count + ")</span>";
    });
}

function rejected() {
    console.log("Connection to Subscribe Lists Hub Rejected");
}

connectionNotifications.start().then(fulfilled, rejected);
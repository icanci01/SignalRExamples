let senderEmail = document.getElementById("senderEmail");
let receiverEmail = document.getElementById("receiverEmail");
let chatMessage = document.getElementById("chatMessage");
let btn_send = document.getElementById("sendMessage");
let messageList = document.getElementById("messagesList");

btn_send.disabled = true;

// Create connection
let connectionBasicChat = new signalR.HubConnectionBuilder().withUrl("/hubs/basicChat").build();

btn_send.addEventListener("click", function (event) {
    if (receiverEmail.value !== "") {
        // Send message to a specific user
        connectionBasicChat.send("SendMessageToReceiver", senderEmail.value, receiverEmail.value, chatMessage.value);
        receiverEmail.value = "";
    } else {
        // Send message to all of the users
        connectionBasicChat.send("SendMessageToAll", senderEmail.value, chatMessage.value);
    }

    chatMessage.value = "";
    event.preventDefault();
});

// Connect to methods that hub invokes aka receive notifications from hub
connectionBasicChat.on("MessageReceived", function (user, message) {
    let li = document.createElement("li");
    li.textContent = `${user} says ${message}`;
    messageList.appendChild(li);

    toastr.success(`New message from ${user}`);
});

// Start connection
function fulfilled() {
    console.log("Connection to Basic Chat Hub Established");
    btn_send.disabled = false;
}

function rejected() {
    // rejected logs
    console.log("Connection to Basic Chat Hub Rejected");
}

connectionBasicChat.start().then(fulfilled, rejected);
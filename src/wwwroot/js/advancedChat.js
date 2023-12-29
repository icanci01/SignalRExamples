// Create connection
let connectionAdvancedChat = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 5000, null])
    .withUrl("/hubs/advancedChat")
    .build();

// Connect to methods that hub invokes aka receive notifications from hub
connectionAdvancedChat.on("ReceiveUserConnected", function (userId, userName) {
    addMessage(`${userName} has joined the chat`);
});

connectionAdvancedChat.on("ReceiveUserDisconnected", function (userId, userName) {
    addMessage(`${userName} has left the chat`);
});

connectionAdvancedChat.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    addMessage(`${userName} has created room ${roomName}`);
    fillRoomDropDown();
});

connectionAdvancedChat.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, userId, userName) {
    addMessage(`${userName} has deleted room ${roomName}`);
    fillRoomDropDown();
});

connectionAdvancedChat.on("ReceivePublicMessage", function (roomId, roomName, message, userId, userName) {
    addMessage(`[Public Message - ${roomName}] ${userName} says: ${message}`);
});

connectionAdvancedChat.on("ReceivePrivateMessage", function (senderId, senderName, receiverId, receiverName, message, chatId) {
    addMessage(`[Private Message to ${receiverName}] ${senderName} says: ${message}`);
});

document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
})

function addNewRoom(maxRoom) {

    let createRoomName = document.getElementById('createRoomName');
    let roomName = createRoomName.value;

    if (roomName == null || roomName === '') {
        return;
    }

    $.ajax({
        url: '/api/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({id: 0, name: roomName}),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            connectionAdvancedChat.send("SendAddRoomMessage", maxRoom, json.id, json.name).catch(function (err) {
                return console.error(err.toString());
            });
            createRoomName.value = '';
        },
        error: function (xhr) {
            alert('error');
        }
    })
}

function deleteRoom() {

    let ddlDelRoom = document.getElementById("ddlDelRoom");

    let roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;

    let text =`Are you sure you want to delete Chat Room ${roomName}?`;

    if (!confirm(text)) {
        return;
    }

    if (roomName == null || roomName === '') {
        return;
    }

    let roomId = ddlDelRoom.value;

    $.ajax({
        url: `/api/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json; charset=utf-8',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            connectionAdvancedChat.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName).catch(function (err) {
                return console.error(err.toString());
            });
        },
        error: function (xhr) {
            alert('error');
        }
    })
}

function sendPublicMessage(){
    let inputMessage = document.getElementById('txtPublicMessage');
    let roomSelected = document.getElementById('ddlSelRoom');

    let roomId = roomSelected.value;
    let roomName = roomSelected.options[roomSelected.selectedIndex].text;
    let message = inputMessage.value;

    if (message == null || message === '') {
        return;
    }

    connectionAdvancedChat.send("SendPublicMessage", Number(roomId), roomName, message);
    inputMessage.value = '';
}

function sendPrivateMessage() {
    let inputMessage = document.getElementById('txtPrivateMessage');
    let userSelected = document.getElementById('ddlSelUser');

    let receiverId = userSelected.value;
    let receiverName = userSelected.options[userSelected.selectedIndex].text;
    let message = inputMessage.value;

    if (message == null || message === '') {
        return;
    }

    connectionAdvancedChat.send("SendPrivateMessage", receiverId, receiverName, message);
    inputMessage.value = '';
}

function fillUserDropDown() {

    $.getJSON('/api/ChatRooms/GetChatUsers')
        .done(function (json) {

            let ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                let newOption = document.createElement("option");
                newOption.text = item.userName;
                newOption.value = item.id;
                ddlSelUser.add(newOption);
            });

        })
        .fail(function (jqxhr, textStatus, error) {
            let err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function fillRoomDropDown() {

    $.getJSON('/api/ChatRooms/GetChatRooms')
        .done(function (json) {
            let ddlDelRoom = document.getElementById("ddlDelRoom");
            let ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                let newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);

                let newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });

        })
        .fail(function (jqxhr, textStatus, error) {
            let err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function addMessage(msg) {
    if (msg == null || msg === "") {
        return;
    }

    let ui = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);
}

// Start connection
function fulfilled() {
    console.log("Connection to Advanced Chat Hub Fulfilled");
}

function rejected() {
    // rejected logs
    console.log("Connection to Advanced Chat Hub Rejected");
}

connectionAdvancedChat.start().then(fulfilled, rejected);
"use strict";

let connectionFinalChat = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/advancedChat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

connectionFinalChat.on("ReceiveOnlineUsers", function (response) {
    for (let i = 0; i < response.length; i++) {
        let spanOnline = document.getElementById(`spanOnline${response[i]}`);
        if (typeof spanOnline != "undefined" && spanOnline != null) {
            spanOnline.classList.add("bg-success");
            spanOnline.classList.remove("bg-danger");
            spanOnline.setAttribute("title", "Online");
        }
    }
});

connectionFinalChat.on("ReceiveUserConnected", function (userId, userName) {
    let spanOnline = document.getElementById(`spanOnline${userId}`);
    if (typeof spanOnline != "undefined" && spanOnline != null) {
        spanOnline.classList.add("bg-success");
        spanOnline.classList.remove("bg-danger");
        spanOnline.setAttribute("title", "Online");
    }
});

connectionFinalChat.on("ReceiveUserDisconnected", function (userId, userName) {
    let spanOnline = document.getElementById(`spanOnline${userId}`);
    if (typeof spanOnline != "undefined" && spanOnline != null) {
        // Exists.
        spanOnline.classList.remove("bg-success");
        spanOnline.classList.add("bg-danger");
        spanOnline.setAttribute("title", "Offline");
    }
});

connectionFinalChat.on("ReceivePublicMessage", function (roomId, roomName, message, userId, userName) {
    receivePublicMessage(roomId, userId, userName, message);
});

connectionFinalChat.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    receiveAddNewRoomMessage(maxRoom, roomId, roomName, userId);
});

connectionFinalChat.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, userId, userName) {
    receiveDeleteRoomMessage(deleted, selected);
});

connectionFinalChat.on("ReceivePrivateMessage", function (senderId, senderName, receiverId, receiverName, message, chatId) {
    receivePrivateMessage(senderId, senderName, receiverId, message, chatId);
});

connectionFinalChat.on("ReceiveOpenPrivateChat", function (userId, userName) {
    receiveOpenPrivateChat(userId, userName, false);
});

connectionFinalChat.on("ReceiveDeletePrivateChat", function (chatId) {
    receiveDeletePrivateChat(chatId);
});

function sendPublicMessage(roomId) {
    let sendButton = document.getElementById(`btnMessage${roomId}`);
    let inputMsg = document.getElementById(`inputMessage${roomId}`);

    let message = inputMsg.value;

    connectionFinalChat
        .invoke("SendPublicMessage", roomId, "", message)
        .catch(function (err) {
            inputMsg.value = message;
            sendButton.disabled = false;
            return console.error(err.toString());
        });

    inputMsg.value = "";
    sendButton.disabled = true;
}

function addNewRoom(maxRoom) {
    let roomName = prompt("What will your chat room name be?\r\nIf you leave it blank, a name will be generated automatically!!");

    if (roomName == null) {
        return;
    }

    /*POST*/
    $.ajax({
        url: "/api/ChatRooms/PostChatRoom",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({id: 0, name: roomName}),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            connectionFinalChat
                .invoke("SendAddRoomMessage", maxRoom, json.id, json.name)
                .catch(function (err) {
                    return console.error(err.toString());
                });
        },
        error: function (xhr) {
            alert("error");
        },
    });
}

function deleteRoom(roomId, roomName) {
    let text = `Do you want to delete Chat Room ${roomName}?`;

    if (!confirm(text)) {
        return;
    }

    /*DELETE*/
    $.ajax({
        url: `/api/ChatRooms/DeleteChatRoom/${roomId}`, dataType: "json", type: "DELETE", contentType: "application/json;", async: true, processData: false, cache: false, success: function (json) {
            connectionFinalChat.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName).catch(function (err) {
                return console.error(err.toString());
            });
        }, error: function (xhr) {
            alert("error");
        },
    });

}

function sendPrivateMessage() {
    let receiverId = document.getElementById("hdchatUserId").value;
    let inputMsg = document.getElementById("inputMessagePrivate");

    let message = inputMsg.value;


    connectionFinalChat.send("SendPrivateMessage", receiverId, "", message).catch(function (err) {
        inputMsg.value = message;
        return console.error(err.toString());
    });

    inputMsg.value = "";
}

function openPrivateChat(userId, userName) {
    connectionFinalChat.send("SendOpenPrivateChat", userId).catch(function (err) {
        return console.error(err.toString());
    });

    receiveOpenPrivateChat(userId, userName, true);
}

function deletePrivateChat(chatId) {
    connectionFinalChat.invoke("SendDeletePrivateChat", chatId).catch(function (err) {
        return console.error(err.toString());
    });
}

// Start connectionFinalChat
function fulfilled() {
    console.log("Connection to Advanced Chat Hub Fulfilled");
}

function rejected() {
    // rejected logs
    console.log("Connection to Advanced Chat Hub Rejected");
}

connectionFinalChat.start().then(fulfilled, rejected);


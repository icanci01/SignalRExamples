// Create connection
let connectionAdvancedChat = new signalR.HubConnectionBuilder().withUrl("/hubs/advancedChat").build();

// Connect to methods that hub invokes aka receive notifications from hub

// Start connection
function fulfilled() {
    console.log("Connection to Basic Chat Hub Established");
}

function rejected() {
    // rejected logs
    console.log("Connection to Basic Chat Hub Rejected");
}

connectionAdvancedChat.start().then(fulfilled, rejected);
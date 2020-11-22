var tmi = require("tmi.js");

var options = {
    options : {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "betmebot",
        password: "oauth:0jex6wfgda7jk3bsskhuve0g5nv82t"
    },
    channels: ["yasuoplayer1"]

};

var client = new tmi.client(options);
client.connect();

client.on("chat", function(channel, user, message, self) {
    if (message == "!twitter") {
        client.action("yasuoplayer1", "twitter.com/realdonaldtrump");    
    }

    client.action("yasuoplayer1", user["display-name"] + " bet me dude");
})

client.on("connected", function(address, port) {
    console.log("Address: " + address + "Port " + port);

    client.action("yasuoplayer1", "Hello I'm BetMeBot, let's make a bet.");

});

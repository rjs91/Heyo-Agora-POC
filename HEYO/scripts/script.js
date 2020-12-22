const AgoraRTC = require('AgoraRTCSDK-3.3.1')

// Handle errors.
let handleError = function(err){
    console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId){
    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};

const APPID ='e2611baedf7e46c584c590442b663464';
const TEMP_TOKEN='006e2611baedf7e46c584c590442b663464IADYrw+TtJ0hNNE527wrpPwISQS0qTFcfbOOckdJEeMOrd+pr8cAAAAAEAD26wA6Hx7jXwEAAQARHuNf';
var client = AgoraRTC.createClient({mode: 'live', codec: "h264"});

client.init(APPID, function () {
  console.log("AgoraRTC client initialized");
}, function (err) {
  console.log("AgoraRTC client init failed", err);
});

// localStream.init(function() {
//   console.log("getUserMedia successfully");
//   localStream.play('agora_local');
// }, function (err) {
//   console.log("getUserMedia failed", err);
// });

// Join a channel
client.join("yourToken", "myChannel", null, (uid)=>{
    // Create a local stream
    let localStream = AgoraRTC.createStream({
        audio: true,
        video: true,
    });
    // Initialize the local stream
    localStream.init(()=>{
        // Play the local stream
        localStream.play("me");
        // Publish the local stream
        client.publish(localStream, handleError);
    }, handleError);
  }, handleError);

  // Subscribe to the remote stream when it is published
client.on("stream-added", function(evt){
    client.subscribe(evt.stream, handleError);
});
// Play the remote stream when it is subsribed
client.on("stream-subscribed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});
// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
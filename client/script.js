let pc = new RTCPeerConnection(servers);

// ICE
const servers = {
  iceServers: [
    { urls: ["stun1.l.google.com:19302", "stun2.l.google.com:19302"] },
  ],
  iceCandidatePoolSize: 10,
};

let localStream = null;
let remoteStream = null;

// HTML elements
const webcamButton = document.getElementById("webcamButton");
const webcamVideo = document.getElementById("webcamVideo");
const callButton = document.getElementById("callButton");
const callInput = document.getElementById("callInput");
const answerButton = document.getElementById("answerButton");
const remoteVideo = document.getElementById("remoteVideo");
const hangupButton = document.getElementById("hangupButton");

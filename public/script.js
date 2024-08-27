// const socket = io("/");
// const chatInputBox = document.getElementById("chat_message");
// const all_messages = document.getElementById("all_messages");
// const main__chat__window = document.getElementById("main__chat__window");
// const videoGrid = document.getElementById("video-grid");
// const myVideo = document.createElement("video");
// myVideo.muted = true;

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: "3030",
// });


// // var peer = new Peer(undefined, {
// //   host: "https://zoom-clone-j681.onrender.com",
// //   port: 443,
// //   secure: true,
// //   path: "/peerjs",
// // });

// let myVideoStream;

// var getUserMedia =
//   navigator.getUserMedia ||
//   navigator.webkitGetUserMedia ||
//   navigator.mozGetUserMedia;

// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream);

//     peer.on("call", (call) => {
//       call.answer(stream);
//       const video = document.createElement("video");

//       call.on("stream", (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     });

//     socket.on("user-connected", (userId) => {
//       connectToNewUser(userId, stream);
//     });

//     document.addEventListener("keydown", (e) => {
//       if (e.which === 13 && chatInputBox.value != "") {
//         socket.emit("message", chatInputBox.value);
//         chatInputBox.value = "";
//       }
//     });

//     socket.on("createMessage", (msg) => {
//       console.log(msg);
//       let li = document.createElement("li");
//       li.innerHTML = msg;
//       all_messages.append(li);
//       main__chat__window.scrollTop = main__chat__window.scrollHeight;
//     });
//   });

// peer.on("call", function (call) {
//   getUserMedia(
//     { video: true, audio: true },
//     function (stream) {
//       call.answer(stream); // Answer the call with an A/V stream.
//       const video = document.createElement("video");
//       call.on("stream", function (remoteStream) {
//         addVideoStream(video, remoteStream);
//       });
//     },
//     function (err) {
//       console.log("Failed to get local stream", err);
//     }
//   );
// });

// peer.on("open", (id) => {
//   socket.emit("join-room", ROOM_ID, id);
// });

// // CHAT

// const connectToNewUser = (userId, streams) => {
//   var call = peer.call(userId, streams);
//   console.log(call);
//   var video = document.createElement("video");
//   call.on("stream", (userVideoStream) => {
//     console.log(userVideoStream);
//     addVideoStream(video, userVideoStream);
//   });
// };

// const addVideoStream = (videoEl, stream) => {
//   videoEl.srcObject = stream;
//   videoEl.addEventListener("loadedmetadata", () => {
//     videoEl.play();
//   });

//   videoGrid.append(videoEl);
//   let totalUsers = document.getElementsByTagName("video").length;
//   if (totalUsers > 1) {
//     for (let index = 0; index < totalUsers; index++) {
//       document.getElementsByTagName("video")[index].style.width =
//         100 / totalUsers + "%";
//     }
//   }
// };

// const playStop = () => {
//   let enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     setPlayVideo();
//   } else {
//     setStopVideo();
//     myVideoStream.getVideoTracks()[0].enabled = true;
//   }
// };

// const muteUnmute = () => {
//   const enabled = myVideoStream.getAudioTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getAudioTracks()[0].enabled = false;
//     setUnmuteButton();
//   } else {
//     setMuteButton();
//     myVideoStream.getAudioTracks()[0].enabled = true;
//   }
// };

// const setPlayVideo = () => {
//   const html = `<i class="unmute fa fa-pause-circle"></i>
//   <span class="unmute">Resume Video</span>`;
//   document.getElementById("playPauseVideo").innerHTML = html;
// };

// const setStopVideo = () => {
//   const html = `<i class=" fa fa-video-camera"></i>
//   <span class="">Pause Video</span>`;
//   document.getElementById("playPauseVideo").innerHTML = html;
// };

// const setUnmuteButton = () => {
//   const html = `<i class="unmute fa fa-microphone-slash"></i>
//   <span class="unmute">Unmute</span>`;
//   document.getElementById("muteButton").innerHTML = html;
// };
// const setMuteButton = () => {
//   const html = `<i class="fa fa-microphone"></i>
//   <span>Mute</span>`;
//   document.getElementById("muteButton").innerHTML = html;
// };



const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat_window = document.getElementById("main__chat_window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on("call", call => {
    call.answer(stream);
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on("user-connected", userId => {
    connectToNewUser(userId, stream);
  });

  document.addEventListener("keydown", (e) => {
    if (e.which === 13 && chatInputBox.value !== "") {
      socket.emit("message", chatInputBox.value);
      chatInputBox.value = "";
    }
  });

  socket.on("createMessage", (message) => {
    let li = document.createElement("li");
    li.innerHTML = message;
    all_messages.append(li);
    main__chat_window.scrollTop = main__chat_window.scrollHeight;
  });
});

socket.on("user-disconnected", userId => {
  if (peers[userId]) peers[userId].close();
});

peer.on("open", id => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

function muteUnmute() {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

function playStop() {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

function setMuteButton() {
  const html = `<i class="fa fa-microphone"></i><span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
}

function setUnmuteButton() {
  const html = `<i class="fa fa-microphone-slash"></i><span>Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
}

function setPlayVideo() {
  const html = `<i class="fa fa-pause-circle"></i><span>Play Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
}

function setStopVideo() {
  const html = `<i class="fa fa-video-camera"></i><span>Stop Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
}

const socket = io('/')

const videoGrid = document.getElementById('video-grid')
var myPeer = new Peer(undefined, {
    secure: true,
    host: 'peerjs-server.herokuapp.com',
    port:443,
});

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    // if (!userId === null) {
    console.log('userConnected')
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call
        // }
}
function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
document.getElementById("endButton").onclick = function () {
    location.href = "homePage.ejs";
};
document.getElementById('meeting-link').value= window.location.href;
        function copyToClipBoard() {
            var copyText = document.getElementById("meeting-link");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
        }




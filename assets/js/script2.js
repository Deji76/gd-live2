const socket = io('http://localhost:3000')

const form = document.getElementById('send-container');
const messageInput= document.getElementById('messageInp')
const messageContainer=document.querySelector(".container")
var audio= new Audio('ring.mp3');

const append= (message,position)=>{
    const messageElement = document.createElement('div')
    messageElement.innerText= message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})
let name = '';
while(true){
    name=prompt('Enter your name to join');
    console.log('name:',name,'type:',typeof name);
    if(name==null || name==undefined || name==''){
        alert('please enter your name to join the chat')
    }
    else{
        break;
    }
}
socket.emit('new-user-joined',name);

socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right')
})

socket.on('receive',data=>{
    append(`${data.name}:\n${data.message}`,'left')
})

socket.on('left',name=>{
    append(`${name} left the chat`,'right')
})
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


function closepopup(){
    document.getElementById("DialogBox").style.display='none';
}
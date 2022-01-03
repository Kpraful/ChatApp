const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const userList = document.getElementById('users');


const socket = io();

//Get username from URL
const {username} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
})

//join chatroom
socket.emit('joinRoom', {username})

//Get users
socket.on('roomusers',({users})=>{
  outputUser(users);
})


//Message form server
socket.on('message',message=>{
  console.log(message)
  outputmessage(message);

  //Scroll Down
  chatMessage.scrollTop = chatMessage.scrollHeight;
})

//Message Submit

chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  
  //Get message text by ID
  const msg= e.target.elements.msg.value;

  //Emit message to server;
  socket.emit('chatMessage',msg);

  //Clear input
  e.target.elements.msg.value="";
  e.target.elements.msg.focus();
})

//Output message to DOM
function outputmessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
  <p class="text">
    ${message.text}
  </p>
  `
  document.querySelector('.chat-messages').appendChild(div)
}

//Add users to DOM
function outputUser(users){
  userList.innerHTML=`
    ${users.map(user =>`<li> ${user.username}</li>`).join('')}
  `;
}
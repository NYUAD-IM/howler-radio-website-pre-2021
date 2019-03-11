var socket = io.connect('http://104.236.239.60:8080');
// var socket = io.connect('http://localhost:8088');
var welcome_message = "<span style='color:grey;'>...you're connected. be nice and respectful!</span>";

function initChat(){
  document.getElementById('username').removeAttribute("disabled");
  document.getElementById('message').removeAttribute("disabled");
  document.getElementById('send_button').removeAttribute("disabled");

  if(socket.connected){
    document.getElementById("chat_window").innerHTML = welcome_message;
    socket.emit('joined-chat');
  }

  //this updates the number of users + whether the chat is enabled or not
  socket.on('update-status', function(data){
    //update number of users
    document.getElementById('connected_users').innerHTML = '('+data.users+')';

    //if the chat is diabled, let them know
    if(!data.enabled){
      document.getElementById("chat_window").innerHTML = "<span class='howler_bot'>howler_bot</span> ...unfortunately, the chat is temporarily disabled :/<hr>";
    }
  });

  //this deletes all messages in the chat
  socket.on('erase', function(data){
    document.getElementById("chat_window").innerHTML =  "<span class='howler_bot'>howler_bot</span> ...i just refreshed the chat.<hr>";
  });

  //this is updating the chat messages
  socket.on('update-chat', function(data){
    if(document.getElementById("chat_window").innerHTML == welcome_message)
      document.getElementById("chat_window").innerHTML = "";

    document.getElementById("chat_window").innerHTML = "<span class='username'>"+data.username + "</span> " + data.message +"<hr>" + document.getElementById("chat_window").innerHTML;
  });

  socket.on('chat-status-update', function(is_chat_enabled){
    if(is_chat_enabled)
      document.getElementById("chat_window").innerHTML = "<span class='howler_bot'>howler_bot</span> ...the chat has been restored!<hr>"  + document.getElementById("chat_window").innerHTML;
    else
      document.getElementById("chat_window").innerHTML = "<span class='howler_bot'>howler_bot</span> ...unfortunately, the chat is temporarily disabled :/<hr>";
  });
}

window.onload = function(){
  document.getElementById('message').addEventListener('keypress', function(e){

    e = e || window.event;

    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode == 13) {
        sendMessage();
    }
  });
};


function sendMessage(){
  var _name = document.getElementById("username").value;
  var _message = document.getElementById("message").value;

  var censorship = /n+[i1l|]+[gkq469]+[e3a4i]+[ra4]/g;


  if(_name.toString() === ""){
    _name = "someone";
  }

  var data = {"username":_name, "message":_message};
  socket.emit('new-message', data);

  if(censorship.test(_message)){
     alert('your IP address has been logged');
  }

  //clear the values only for message
  document.getElementById("message").value = "";
}

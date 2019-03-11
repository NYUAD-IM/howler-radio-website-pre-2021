// var socket = io.connect('http://104.236.239.60:8080');

const PLAY_IMG = 'img/play_marble.png';
const PAUSE_IMG = 'img/pause_marble.png';
const DEFAULT_MESSAGE = '<span id="playing_main">MUSIC FROM THE CLOUD</span>';

const PREFIX = '<span id="pulsate">NOW PLAYING</span>';
var show = '';
var additional = '';
var isBroadcasting = false;

socket.on('connect', function(){
  console.log('connected to the chat server');
  initChat()
});

socket.on('update-message', function(data){
  if(data.show == 'MUSIC FROM THE CLOUD'){
    resetMessage();
    return;
  }

  if(data.show !== ''){
    show = ' - '+data.show;
    isBroadcasting = true;
  }else{
    show = '';
  }

  if(data.additional !== ''){
    additional = ' ('+data.additional+')';
  }else{
    additional = '';
  }

  document.getElementById('now_playing').innerHTML = PREFIX + '<span id="playing_main">' + show + '</span><br /><span id="playing_secondary">' + additional + '</span>';
});

socket.on('reset-message', function(data){
 resetMessage();
});



function resetMessage(){
  var edition = '';

	var time = new Date();
	var hour = time.getUTCHours();

  if(hour > 20 || hour < 02){ //it's night!
    edition = '(NIGHT TIME PLAYBACK)';
  }else if(hour >= 2 && hour < 8){ //it's morning!
    edition = '(MORNING MIX)';
  }else if(hour >= 8 && hour < 14){ //it's afternoon!
    edition = '(AFTERNOON BOOGIE)';
  }else{ //it's evening!
    edition = '(EVENING TUNES)';
  }
	document.getElementById('now_playing').innerHTML = PREFIX + ' - ' +DEFAULT_MESSAGE + '<br/><span id="playing_secondary">' + edition + '</span>';
isBroadcasting = false;
}

function pulsate(){
  var pulse = document.getElementById('pulsate');

  setTimeout(function(){
   if(!isBroadcasting){
	  pulse.style.backgroundColor = 'white';
   } else{
    pulse.style.backgroundColor = 'red';
   }
    pulse.style.opacity = 1;
    setTimeout(function(){
      pulse.style.opacity = 0.5;
      pulsate();
    }, 800);
  }, 800);
}

function toggleAudio(){
  var player = document.getElementById("audio-player");
  var button = document.getElementById("play-img");

  if(player.muted){
    // console.log("Unmuting");

    player.muted = false;
    player.play();
    // button.innerText = "PAUSE";
    button.setAttribute('src', PAUSE_IMG);
  }else if(!player.muted){
    // console.log("Muting!");
    player.muted = true;
    // button.innerText = "PLAY";
    button.setAttribute('src', PLAY_IMG);
  }
}

setTimeout(pulsate, 1000);

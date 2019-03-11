// this script handles populating and displaying information about shows
// on the shows.html webpage

var current_show;

//DOM elements
var elem_title;
var elem_image;
var elem_dj;
var elem_tags;
var elem_description;
var elem_time;
var elem_archive;

//content
var show_title;
var show_image;
var show_dj;
var show_tags;
var show_description;
var show_time;
var show_archive;

var all_shows;

var schedule;

var transparent_elements;

// gets all information form a JSON file on the FTP server
function init(){

  $.getJSON('../info/schedule.json', function(response){
    schedule = response;

    var show_holder = document.getElementById('show_list');
    for(var i = 0; i < schedule.shows.length; i++){
      var s = '<div class="show_item" onclick="selectNewShow(\''+schedule.shows[i].image+'\')">'+schedule.shows[i].name+'</div>';

      show_holder.innerHTML+=s;
    }

    if(window.location.href.toString().indexOf('?') > -1){
      var show = window.location.href.toString().substring(window.location.href.toString().indexOf('?') + '?show='.length, window.location.href.toString().length);

      for(i = 0; i < schedule.shows.length; i++){
        if(schedule.shows[i].image == show){
          console.log('found show, replacing...');
          replaceCurrentShow(schedule.shows[i]);
          break;
        }
      }
    }

    all_shows = document.getElementsByClassName("show_item");

    $('.show_item').click(function(){
      for(var i = 0; i < all_shows.length; i++){
        all_shows[i].setAttribute('id', 'not-selected');
      }
      $(this).attr('id','selected');
    });
  });


  elem_title = document.getElementById("show_title");
  elem_image = document.getElementById("show_image");
  elem_dj = document.getElementById("show_dj");
  element_tags = document.getElementById("show_tags");
  elem_description = document.getElementById("show_description");
  elem_time = document.getElementById("show_time");
  elem_archive = document.getElementById("show_archive_link");

  transparent_elements = document.getElementsByClassName('show_transparent');
}

// first function to be called
// goes through all the shows and finds the name of the one we clicked on
function selectNewShow(show_name){
  for(var i = 0; i < schedule.shows.length; i++){
    if(schedule.shows[i].image == show_name){
      replaceCurrentShow(schedule.shows[i]);
      break;
    }
  }

  console.log('ERROR: no show found!');
}

// sets the new values
function replaceCurrentShow(new_show){
  show_title = new_show.name.toUpperCase();
  show_image =  "../img/"+new_show.image+'.png';
  show_dj = new_show.dj.toUpperCase();
  show_tags = new_show.tags;
  show_description =  new_show.description;
  show_time = new_show.time;
  show_archive = new_show.archive;

  updateElements();
}

// wraps the replacement of those values in a nice fade in/fade out
function updateElements(){

  //set the opacity to 0, over 400ms
  for(var i = 0; i < transparent_elements.length; i++){
    transparent_elements[i].style.opacity = 0;
  }

  //replaces all information after a timeout of 400ms, then sets the opacity to 1 again
  setTimeout(function(){
    document.getElementById("show_container").style.visibility = 'visible';
    elem_title.innerText = show_title;
    elem_image.setAttribute('style', 'background-image: url('+show_image+');');
    elem_dj.innerText = show_dj;

    element_tags.innerText = "";
    for(var i = 0; i < show_tags.length; i++){
      element_tags.innerText += "- "+show_tags[i] + " - ";
    }

    elem_description.innerHTML = show_description;
    elem_time.innerText = show_time;
    elem_archive.setAttribute('href', show_archive);

    for(i = 0; i < transparent_elements.length; i++){
      transparent_elements[i].style.opacity = 1;
    }
  }, 400);
}

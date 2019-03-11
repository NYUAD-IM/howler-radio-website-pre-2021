var slideshow_state = 'dynamic'; //static || dynamic

var current_index = 0;
var current_image = 'slideshow_bg';

var holder_a;
var holder_b;

var schedule;
var slideshow;
var legend;

var legend_name = '';
var legend_dj = '';
var legend_day = '';
var legend_time = '';

function initSlideshow(){
  slideshow = document.getElementById('slideshow');
  legend = document.getElementById('legend');

  legend_name = document.getElementById('legend_name');
  legend_dj = document.getElementById('legend_dj');
  legend_day = document.getElementById('legend_day');
  legend_time = document.getElementById('legend_time');

  slideshow.addEventListener('mouseover', function(){
    legend.style.opacity = 1;
  });

  slideshow.addEventListener('mouseout', function(){
    legend.style.opacity = 0;
  });

  holder_a = document.getElementById('slideshow_holder_a');
  holder_b = document.getElementById('slideshow_holder_b');
  if(slideshow_state == 'static'){
    holder_a.setAttribute('style', 'background-image: url("img/call_for_djs_f18_web.png")');
  }else{
    holder_a.setAttribute('style', 'background-image: url("img/slideshow_bg.png")');
  }

  $.getJSON('../info/schedule.json', function(response){
    schedule = response;
  });
}

function changePoster(){
  legend_name.innerText = schedule.shows[current_index].name.toUpperCase();
  legend_name.setAttribute('href', 'shows.html?show='+schedule.shows[current_index].image);
  legend_dj.innerText = schedule.shows[current_index].dj.toUpperCase();
  legend_day.innerText = schedule.shows[current_index].time.substr(0, schedule.shows[current_index].time.indexOf('-')).toUpperCase();
  legend_time.innerText = schedule.shows[current_index].time.slice(schedule.shows[current_index].time.indexOf('-')+2).toUpperCase();

  // console.log(schedule.shows[current_index]);

  current_image = schedule.shows[current_index].image != 'YOURIMAGEHERE' ? schedule.shows[current_index].image : 'slideshow_bg';

  if(holder_a.style.opacity == 1){
    holder_a.style.opacity = 0;

    holder_b.setAttribute('style', 'background-image: url("img/'+current_image+'.png")');
    holder_b.style.opacity = 1;
  }else{
    holder_b.style.opacity = 0;

    holder_a.setAttribute('style', 'background-image: url("img/'+current_image+'.png")');
    holder_a.style.opacity = 1;
  }


  if(current_index < schedule.shows.length-1)
    current_index++;
  else
    current_index = 0;
}

if(slideshow_state == 'dynamic'){
  setInterval(function(){
    changePoster();
  }, 5000);
}

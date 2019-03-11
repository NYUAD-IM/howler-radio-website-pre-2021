var context, audioElement, source, analyser;
var bufferLength, freqDomain;

var clock;

var visible = false;

function toggleVisualizer(){
	var cnv = document.getElementsByTagName('canvas')[0];
	visible = !visible;
	
	
	
	if(cnv == null){
		initVisualizer();
	}else if(cnv.style.display == 'none'){
		cnv.setAttribute('style', 'display: block');
		render();
	}else{
		cnv.setAttribute('style', 'display: none');
	}
	
	
	
}

function initVisualizer(){
	console.log('initializing audio context...');
	context = new (window.AudioContext || window.webkitAudioContext)();
	audioElement = document.getElementById("audio-player");
	source = context.createMediaElementSource(audioElement);
	analyser = context.createAnalyser();
	
	source.connect(analyser);
	analyser.connect(context.destination);
	
	freqDomain = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(freqDomain);

	initThree();
}

var scene, camera, renderer;

function initThree(){
	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight - 75);
	document.body.appendChild( renderer.domElement );
	
	window.addEventListener('resize', onWindowResize, false);
	
	var ambient = new THREE.AmbientLight(0xFFFFFF	);
	scene.add(ambient);
	
	clock = new THREE.Clock(true);
	clock.start();

	initComet();
	render();
}

function onWindowResize(){
	camera.aspect = window.innerWidth/(window.innerHeight-75);
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight-75);
}

var debug = false;
function render(){
	analyzeAudio();
	
	if(debug){
		console.log('---');
		console.log('lo', freq_lo);
		console.log('mid', freq_mid);
		console.log('hi', freq_hi);
	}

	if(visible){
		animateComet();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
}

var freq_lo, freq_mid, freq_hi;
var thresh_lo = 30000;
var thresh_mid = 20000;
var thresh_hi = 1500;

function analyzeAudio(){
	analyser.getByteFrequencyData(freqDomain);
	
	freq_lo = freq_mid = freq_hi = 0;
	
	for(var i = 0; i < freqDomain.length; i++){
		if(i < freqDomain.length*0.35){
			freq_lo += freqDomain[i];
		}else if(i < freqDomain.length*0.7){
			freq_mid += freqDomain[i];
		}else{
			freq_hi += freqDomain[i];
		}
	}
	
	processAudio();
}

var time = 0;
var comet_distort_coeff = 1;
var isTweening = false;
function processAudio(){
	if(freq_lo > thresh_lo){
		comet_distort_coeff = 1;
		if(!isTweening)
			tweenComet();
	}else{
		comet_distort_coeff = 0;
	}
	
	if(freq_hi > thresh_hi){
		time += 0.1;
		for(var i = 0; i < comet.geometry.faces.length; i++){
			r = 0.25+((Math.sin(i + time)+1)*0.5)*0.75;
			comet.geometry.faces[i].color.setRGB(r, r, r);
		}
	}

}

//----------------------- OBJECTS
var comet, comet_skeleton;
var comet_shades = [];
var shade_coeff = 4000;
function initComet(){
	geometry = new THREE.IcosahedronGeometry(2);

	for(var i = 0; i < geometry.faces.length; i++){
		var shade = Math.random()*0.5+0.5;
		comet_shades[i] = shade;
		geometry.faces[i].color = new THREE.Color(shade, shade, shade);
	}

	var mat = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, vertexColors: THREE.FaceColors});
	comet = new THREE.Mesh(geometry, mat);

	getOriginalVertices();
	
	scene.add(comet);
}

var originalVertices = [];
function getOriginalVertices(){
	for(var i = 0; i < comet.geometry.vertices.length; i++){
		originalVertices.push({x: geometry.vertices[i].x, y: geometry.vertices[i].y});
	}
	
	tweenComet();
}

var comet_rotation_coeff = 0.25;
function animateComet(){
	comet.rotation.x += 0.025 * comet_rotation_coeff;
	comet.rotation.y += 0.01 * comet_rotation_coeff;

	comet.geometry.verticesNeedUpdate = true;
	comet.geometry.elementsNeedUpdate = true;
}

function tweenComet(){
	isTweening = true;
	var targetVertices = getTargetVertices();

	for(var i = 0; i < comet.geometry.vertices.length; i++){
		tweenVertex(i, targetVertices);
	}
}

function tweenVertex(index, targetVertices){
	TweenLite.to(comet.geometry.vertices[index], 0.75, {x: targetVertices[index].x, y: targetVertices[index].y, ease: Back.easeInOut, onComplete : function(){
		if(index === 0)
			isTweening = false;
	}});
}

function getTargetVertices(){
	var tv = [];
	for(var i = 0; i < comet.geometry.vertices.length; i++){
		tv[i] = {x: originalVertices[i].x + (Math.random()-0.5)*comet_distort_coeff, y: originalVertices[i].y + (Math.random()-0.5)*comet_distort_coeff};
	}
	return tv;
}

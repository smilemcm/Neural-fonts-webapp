
function make_svg_font (svgstring){

  $("#generate_button").click(function(){
    $.ajax({
      type: 'POST',
      url:'/generate',
      dataType:"json",
      async:true,
      data:{
        'svgstring':svgstring,
		'sources':sources_uni
      },
    });
  });
}

function log_to_DOM (str) {
  var elem = document.createElement('div');
  elem.innerHTML = str;
  document.body.appendChild(elem);
}

function trace_image(){

  var svgstring;
  let canvas = document.getElementById('img');
  var canvas_vector = document.getElementById('canvas_vector');
  if (!canvas_vector) {
	canvas_vector = document.createElement('canvas');
	canvas_vector.id = 'canvas_vector';
	canvas_vector.width = 128*3;
	canvas_vector.height = 128*3;
	document.getElementById('post_image').appendChild(canvas_vector);
  }
  var context = canvas_vector.getContext('2d');
  // let img = document.getElementById('img');
  // let canvas = document.createElement('canvas');

  // canvas.width = img.width*4;
  // canvas.height = img.height*4;
  // var context = canvas.getContext('2d');
  // context.drawImage(img,0,0, img.width,    img.height,     // source rectangle
  //        0, 0, canvas.width, canvas.height);


  // Get options from DOM elements
  let option = {};
  let options = document.getElementById('range_all');
  let optionSetting_input = options.getElementsByTagName("input");
  for (let i = 0; i < optionSetting_input.length; i++) {
	let input = optionSetting_input[i];
	option[input.name] = input.value;
  }
  option.pal = [{r:0,g:0,b:0,a:255},{r:255,g:255,b:255,a:255}];
  option.linefilter=true;

  let start_t = new Date();

  // Getting ImageData from canvas with the helper function getImgdata().
  // let imgd = ImageTracer.getImgdata( canvas );

  let svg_string = [];
  for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
	  let imgd = ImageTracer.getPartialImgdata( canvas, j*128, i*128, 128, 128 );
	  // Synchronous tracing to SVG string
	  option.dstring = "";
	  // option.scale = 1/4;
	  var svgstr = ImageTracer.imagedataToSVG( imgd, option);
	  var dstring = option.dstring;
	  svgstring = dstring;
	  // Appending SVG
	  // ImageTracer.appendSVGString( svgstr, 'post_image' );
	  svg_string.push(svgstr);
	  let img = new Image();
	  img.onload = function() {
		  context.drawImage(img, j*128, i*128, 128, 128);
	  }
	  img.src = "data:image/svg+xml," + svgstr;
}
  }
  make_svg_font(svg_string);
}

function create_option(name, min, max, step, value) {
    var optionSetting_input = document.getElementById(name);
    optionSetting_input.class = 'OptionSetting_input';
    optionSetting_input.type = 'range';
    optionSetting_input.min = min;
    optionSetting_input.max = max;
    optionSetting_input.step = step;
    optionSetting_input.value = value;
    optionSetting_input.name = name;
    optionSetting_input.addEventListener("change", trace_image);
}

  var sources = ['/demo/inferred_C307.png',
  '/demo/inferred_AE5C.png',
  '/demo/inferred_AE7C.png',
  '/demo/inferred_AE9A.png',
  '/demo/inferred_AE85.png',
  '/demo/inferred_AECB.png',
  '/demo/inferred_B0A2.png',
  '/demo/inferred_B2ED.png',
  '/demo/inferred_B3C8.png'];
  var sources_uni = [
'\uC307',
'\uAE5C',
'\uAE7C',
'\uAE9A',
'\uAE85',
'\uAECB',
'\uB0A2',
'\uB2ED',
'\uB3C8'];
function onload_init() {

  create_option('ltres', 0, 10, 0.1, 5);
  create_option('qtres', 0, 10, 0.1, 1);
  create_option('strokewidth', 0, 5, 0.1, 0.15);
  create_option('pathomit', 0, 10, 1, 8);
  create_option('blurradius',1, 5, 1, 0);
  create_option('blurdelta', -100, 100, 10, 10);

  // elem.setAttribute("src", "/images/inferred_0063.png");
  // $.ajax({
  //   url:'/current_dir',
  //   type:"POST",
  //   data:"get current root dir",
  //   error: function(xhr) { $("#status").empty().text('Error: ' + xhr.status);},
  //   success: function(response) {

      function loadImages(sources, callback) {
        var images = {};
        var loadedImages = 0;
        var numImages = sources.length;
        // get num of sources
        for(var i = 0; i < numImages; i++) {
		  images[i] = new Image();
          images[i].onload = function() {
            if(++loadedImages >= numImages) {
              callback(images);
            }
          };
          images[i].src = sources[i];
        }
      }

	  var canvas = document.createElement("canvas");
      canvas.width = 128*3;
      canvas.height = 128*3;
	  canvas.id = 'img';
	  var context = canvas.getContext('2d');

	  // console.log(response.sample_img_paths);
//      var sources = response.sample_img_paths;

      loadImages(sources, function(images) {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
			  context.drawImage(images[3*i + j], 128*j, 128*i, 128, 128);
			}
		}
		trace_image();
      });
	  document.getElementById("pre_image").appendChild(canvas);
  //   }
  // });

  var history = {};
  var but_count = 0;
  var save_but = document.getElementById('save_button');
  var default_but = document.getElementById('default_button');

  default_but.addEventListener('click', function(){
    $('#ltres').val(1);
    $('#qtres').val(1);
    $('#strokewidth').val(0.2);
    $('#pathomit').val(8);
    $('#blurradius').val(0);
    $('#blurdelta').val(10);
    trace_image();
  });

  save_but.addEventListener('click',function(){
    var history_but = document.createElement('button');
    var history_box = document.getElementById('history_box');
    var date = new Date();
    var time = document.createElement('span');

    time.innerHTML = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    time.className = 'label label-history'

    history_but.id = but_count;
    history_but.className ='btn btn-info btn-history';
    history_but.innerHTML = but_count+1;

    history[but_count] = {ltres:$('#ltres').val(), qtres:$('#qtres').val(), strokewidth:$('#strokewidth').val(),
                          pathomit:$('#pathomit').val(), blurradius:$('#blurradius').val(), blurdelta:$('#blurdelta').val()};

    history_box.appendChild(history_but);
    history_box.appendChild(time);

    history_but.addEventListener("click", function(){
      $('#ltres').val(history[this.id].ltres);
      $('#qtres').val(history[this.id].qtres);
      $('#strokewidth').val(history[this.id].strokewidth);
      $('#pathomit').val(history[this.id].pathomit);
      $('#blurradius').val(history[this.id].blurradius);
      $('#blurdelta').val(history[this.id].blurdelta);
      trace_image();
    });

    but_count++;

  });
}

window.addEventListener('load', onload_init);

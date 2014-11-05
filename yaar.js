
navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia); 

function yaar(opts) {

  var width  = 640;
  var height = 480;

  var video = document.createElement('video');
  video.setAttribute('id','yarr-video');
  video.setAttribute('autoplay','autoplay');
  video.style.display='none';
  document.body.appendChild(video);

  var localStream = null;

  var canvas = document.getElementById(opts.id);
  //canvas.style.display='none';
  var context = canvas.getContext('2d');

  var path = (opts.detector?opts.detector:'detector.js');

  var worker = new Worker(path);
  var imageData = null;

  var entities=[];

  worker.addEventListener('message',function(e){
      entities=[];
      for(var i=0;i<e.data.length;i++) {
        entities.push(e.data[i]);
        if(typeof opts.onMarker == 'function') {
          opts.onMarker(e.data[i]);
        }
      }
  });

  function update() {
    worker.postMessage(imageData);
  }

  function render() {
    animation = requestAnimationFrame(render);

    try {
      context.drawImage(video,0,0,width,height);
      imageData = context.getImageData(0,0,width,height);
    } catch(ex) {
    }

    if(typeof opts.draw != 'undefined' && opts.draw === true) {
      var markers = entities.slice();

      for(var i=0;i<markers.length;i++) {
        context.strokeStyle='#FF0000';
        context.fillStyle='#FF0000';
        context.beginPath();
        context.moveTo(markers[i].corners[0].x, markers[i].corners[0].y);
        context.lineTo(markers[i].corners[1].x, markers[i].corners[1].y);
        context.lineTo(markers[i].corners[2].x, markers[i].corners[2].y);
        context.lineTo(markers[i].corners[3].x, markers[i].corners[3].y);
        context.lineTo(markers[i].corners[0].x, markers[i].corners[0].y);
        context.stroke();
        context.font='30px Verdana';
        context.fillText(markers[i].id,markers[i].corners[0].x + 10, markers[i].corners[0].y + 10 );
      }
    }

  };

  function startCapture() {
    function start(cfg) {
      navigator.getMedia(cfg, success, error);
      function error(e) {
        console.log('error',e);
      }
      function success(stream) {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        localStream = stream;
        video.play();
        setTimeout(function(){
          height = video.videoHeight / (video.videoWidth/width);
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
        },1000);
      }
    }
    if(MediaStreamTrack.getSources) {
      MediaStreamTrack.getSources(function(sources){
        var sid = sources[sources.length - 1].id;
        start({video: {optional:[{sourceId: sid}],mandatory: {maxWidth: 1024,maxHeight: 720}}, audio: false})
      });
    } else {
      start({video:{mandatory:{maxWidth: 1024, maxHeight: 720}},audio:false});
    }
  };

  startCapture();

  var animation = requestAnimationFrame(render);
  var interval  = setInterval(update,1000/6);

  return {
    stop: function() {
      clearInterval(interval);
      cancelAnimationFrame(animation);
      if(localStream) localStream.stop();
      document.body.removeChild(video);
      //video.stop();
    }
  };

}


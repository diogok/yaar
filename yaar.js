
navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia); 

function yaar(opts) {

  var width  = 640;
  var height = 480;

  var element = document.getElementById(opts.id);

  var video = document.createElement('video');
  video.setAttribute('id','yaar-video');
  video.setAttribute('autoplay','autoplay');
  video.style.height='100%';
  video.style.width='100%';
  video.style.cssFloat='left';
  //video.style.display='none';
  element.appendChild(video);

  var localStream = null;

  var canvas0 = document.createElement('canvas');
  canvas0.style.display='none';
  canvas0.setAttribute('id','yaar-canvas-0');
  element.appendChild(canvas0);

  var canvas1 = document.createElement('canvas');
  //canvas1.style.display='none';
  canvas1.setAttribute('id','yaar-canvas-1');
  canvas1.style.height='100%';
  canvas1.style.width='100%';
  canvas1.style.cssFloat='left';
  canvas1.style.marginTop='-'+video.clientHeight+'px';
  element.appendChild(canvas1);

  var context0 = canvas0.getContext('2d');
  var context1 = canvas1.getContext('2d');

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
      context0.drawImage(video,0,0,width,height);
      imageData = context0.getImageData(0,0,width,height);
    } catch(ex) {
    }

    if(typeof opts.draw != 'undefined' && opts.draw === true) {
      var markers = entities.slice();

      context1.clearRect(0,0,width,height);
      for(var i=0;i<markers.length;i++) {
        context1.strokeStyle='#FF0000';
        context1.fillStyle='#FF0000';
        context1.beginPath();
        context1.moveTo(markers[i].corners[0].x, markers[i].corners[0].y);
        context1.lineTo(markers[i].corners[1].x, markers[i].corners[1].y);
        context1.lineTo(markers[i].corners[2].x, markers[i].corners[2].y);
        context1.lineTo(markers[i].corners[3].x, markers[i].corners[3].y);
        context1.lineTo(markers[i].corners[0].x, markers[i].corners[0].y);
        context1.stroke();
        context1.font='30px Verdana';
        context1.fillText(markers[i].id,markers[i].corners[0].x + 10, markers[i].corners[0].y + 10 );
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
          canvas0.setAttribute('width', width);
          canvas0.setAttribute('height', height);
          canvas1.setAttribute('width', width);
          canvas1.setAttribute('height', height);
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
    element: element,
    canvas0: canvas0,
    canvas1: canvas1,
    video: video,
    stream: localStream,
    stop: function() {
      clearInterval(interval);
      cancelAnimationFrame(animation);
      if(localStream) localStream.stop();
      element.removeChild(video);
      element.removeChild(canvas0);
      element.removeChild(canvas1);
      //video.stop();
    }
  };

}


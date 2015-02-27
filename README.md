# Yet Another Augmented Reality in Javascript

This is just a wrapper. Get the (rear, if available) camera into a canvas and detects augmented reality markers on it, smoothly and also works fine on mobile.

[Just check it out](http://diogok.net/yaar).

[js-aruco](https://code.google.com/p/js-aruco/) is a great augmented reality lib in javascript, based on [ArUco](http://www.uco.es/investiga/grupos/ava/node/26), a lightweight RA based on OpenCV.

Also checkout the [js aruco markers](http://github.com/diogok/js-aruco-markers) to use with this.

## Compatibility

Work and tested on:

- Desktop Firefox
- Desktop Chrome
- Android Firefox
- Android Chrome

Does Not Work on:

- Android Stock Browser
- iOS Safari
- Desktop Safari
- IE

Likely to work, but not tested:

- iOS Chrome
- iOS Firefox

Does not work on Android nor iOS stock browser so, no phonegap or cordova. But could work on [Chrome Apps](https://github.com/MobileChromeApps/mobile-chrome-apps), got to test that.

## Usage

Place yarr.js and detector.js in known place. Detector actually contains the code for OpenCV and Aruco in it, and it works as a webworker.

Take a look at index.html.

So, simply:

    var opts = {
      id: 'canvas-id', // canvas for the yaar to use
      draw: true, // If I should draw lines on the found markers, good for debug
      onMarker: function(markers){} // listen for found markers, with their ids and position
    };
    var instance = yaar(opts);
    // sometime later
    instance.stop();


## License

OpenCV is BSD.

JS-Aruco is MIT.

This is MIT.


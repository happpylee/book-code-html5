addEventListener("load", function(event) {

    window.renderAnimationFrame = (function() {

        return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||

            function(callback) {
                window.setTimeout(callback, 1000/60);
            };
    })();

    var imageData = null;
    var imageDataPadSize = 50;

    // Canvas 엘리먼트 생성
    var canvasDiv = document.createElement("div");
    var canvasElement = document.createElement("canvas");
    var context = canvasElement.getContext("2d");
    document.body.appendChild(canvasDiv);
    canvasElement.width = 320;
    canvasElement.height = 240;
    canvasDiv.appendChild(canvasElement);

    // Video 엘리먼트 생성
    var videoDiv = document.createElement("div");
    var videoElement = document.createElement("video");
//    videoElement.width = 320;
//    videoElement.height = 240;
    document.body.appendChild(videoDiv);
//    videoDiv.setAttribute("style", "display:none;")
    videoDiv.appendChild(videoElement);

    // 지원 Video 포맷 체크
    var videoFormat = checkVideoFormat(videoElement);

    if(videoFormat == "") {
        console.log("No Video Format support!");
        return;
    }
    else {
        var videoSource = document.createElement("source");
        videoSource.src = "res/video/" + videoFormat + "/face_01." + videoFormat;
        videoElement.appendChild(videoSource);
        videoElement.addEventListener("canplaythrough", videoLoadHandler, false);
    }

    function checkVideoFormat(video) {

        var videoFormat = "";

        if(video.canPlayType("video/mp4") == "probably" || video.canPlayType("video/mp4") == "maybe") {
            videoFormat = "mp4";
        }
        else if(video.canPlayType("video/webm") == "probably" || video.canPlayType("video/webm") == "maybe") {
            videoFormat = "webm";
        }
        else if(video.canPlayType("video/ogg") == "probably" || video.canPlayType("video/ogg") == "maybe") {
            videoFormat = "ogg";
        }

        return videoFormat;
    }

    function loopAnimationFrame() {

        window.renderAnimationFrame(loopAnimationFrame);
        update();
    }

    function videoLoadHandler(event) {
        videoElement.play();
//        setInterval(update, 33);
        loopAnimationFrame();
    }

    function update() {

        context.drawImage(videoElement, 0, 0, 720, 480, 0, 0, 320, 240);

//        controlMouse();

        imageData = context.getImageData(0, 0, 320, 240);

        for(var i=0; i<imageData.data.length; i+=4) {

            if( imageData.data[i+0] > 25 && imageData.data[i+0] < 120 &&
                imageData.data[i+1] > 130 && imageData.data[i+1] < 255 &&
                imageData.data[i+2] > 25 && imageData.data[i+2] < 120) {

                imageData.data[i+3] = 0;
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    var mouseX = 0;
    var mouseY = 0;

    function controlMouse() {

        var imageDataStartX = mouseX - imageDataPadSize;
        var imageDataStartY = mouseY - imageDataPadSize;

        imageData = context.getImageData(imageDataStartX, imageDataStartY, imageDataPadSize*2, imageDataPadSize*2);
        context2.putImageData(imageData, 0, 0);

        var scaleFactor = 2;
        var transWidth = imageDataPadSize * ( Math.floor(scaleFactor / 2) / 2);

        context3.save();
        context3.setTransform(1, 0, 0, 1, 0, 0);
        context3.translate(imageDataPadSize, imageDataPadSize);
        context3.scale(scaleFactor, scaleFactor);

        canvasDiv3.style.left = canvasDivLeft + "px";
        canvasDiv3.style.top = canvasDivTop + "px";

        context3.drawImage(canvasElement2, -imageDataPadSize, -imageDataPadSize);
        context3.restore();
    }

    var canvasDivLeft = 0;
    var canvasDivTop = 0;

    function mousemoveHandler(event) {

        mouseX = event.clientX - canvasDiv.offsetLeft;
        mouseY = event.clientY - canvasDiv.offsetTop;

        canvasDivLeft = event.clientX - imageDataPadSize;
        canvasDivTop = event.clientY - imageDataPadSize;

        console.log("[mousemoveHandler] mouseX: " + mouseX + " / mouseY: " + mouseY);
    }

    addEventListener("mousemove", mousemoveHandler, false);

}, false);
addEventListener("load", function(event) {

    var imageDataPadSize = 50;
    var imageData = null;

    var canvasDiv = document.createElement("div");
    var canvasElement = document.createElement("canvas");
    var context = canvasElement.getContext("2d");
    document.body.appendChild(canvasDiv);
    canvasElement.width = 480;
    canvasElement.height = 270;
    canvasDiv.appendChild(canvasElement);

    var canvasDiv2 = document.createElement("div");
    canvasDiv2.setAttribute("style", "position:absolute; left:500px; top:8px; border:1px solid #000000"); // border:1px solid #000000
    canvasDiv2.style.width = imageDataPadSize * 2 + "px";
    canvasDiv2.style.height = imageDataPadSize * 2 + "px";
    var canvasElement2 = document.createElement("canvas");
    var context2 = canvasElement2.getContext("2d");
    document.body.appendChild(canvasDiv2);
    canvasElement2.width = imageDataPadSize * 2;
    canvasElement2.height = imageDataPadSize * 2;
    canvasDiv2.appendChild(canvasElement2);

    var canvasDiv3 = document.createElement("div");
//    canvasDiv3.setAttribute("style", "position:absolute; left:610px; top:8px; border:1px solid #000000");
    canvasDiv3.style.position = "absolute";
//    canvasDiv3.style.left = 610 + "px";
//    canvasDiv3.style.top = 8 + "px";
    canvasDiv3.style.width = imageDataPadSize * 4 + "px";
    canvasDiv3.style.height = imageDataPadSize * 4 + "px";
    var canvasElement3 = document.createElement("canvas");
    var context3 = canvasElement3.getContext("2d");
    document.body.appendChild(canvasDiv3);
    canvasElement3.width = imageDataPadSize * 4;
    canvasElement3.height = imageDataPadSize * 4;
    canvasDiv3.appendChild(canvasElement3);

    var videoDiv = document.createElement("div");
    var videoElement = document.createElement("video");
//    videoElement.width = 320;
//    videoElement.height = 240;
    document.body.appendChild(videoDiv);
//    videoDiv.setAttribute("style", "display:none;")
    videoDiv.appendChild(videoElement);

    var videoFormat = checkVideoFormat(videoElement);

    if(videoFormat == "") {
        console.log("No Video Format support!");
        return;
    }
    else {
        var videoSource = document.createElement("source");
        videoSource.src = "res/video/steam_2." + videoFormat;
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

    function videoLoadHandler(event) {
        videoElement.play();
        setInterval(update, 33);
    }

    function update() {
//        context.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height, 0, 0, 320, 240);
        context.drawImage(videoElement, 0, 0, 1280, 720, 0, 0, 480, 270);
    }

    function mousemoveHandler(event) {

        var mouseX = event.clientX - canvasDiv.offsetLeft;
        var mouseY = event.clientY - canvasDiv.offsetTop;

        console.log("[mousemoveHandler] mouseX: " + mouseX + " / mouseY: " + mouseY);


        var imageDataStartX = mouseX - imageDataPadSize;
        var imageDataStartY = mouseY - imageDataPadSize;

        imageData = context.getImageData(imageDataStartX, imageDataStartY, imageDataPadSize*2, imageDataPadSize*2);
        context2.putImageData(imageData, 0, 0);


        context3.save();
        context3.setTransform(1, 0, 0, 1, 0, 0);

        context3.translate(canvasElement3.clientLeft + imageDataPadSize, canvasElement3.clientTop + imageDataPadSize);
//        context3.rotate(45 * Math.PI / 180);
        context3.scale(2, 2);

        canvasDiv3.style.left = mouseX - (imageDataPadSize + imageDataPadSize / 2) + "px";
        canvasDiv3.style.top = mouseY - (imageDataPadSize + imageDataPadSize / 2) + "px";

//        context3.drawImage(canvasElement2, -(imageDataPadSize + imageDataPadSize / 2), -(imageDataPadSize + imageDataPadSize / 2));
        context3.drawImage(canvasElement2, -imageDataPadSize + (imageDataPadSize/2), -imageDataPadSize + (imageDataPadSize/2));

        context3.restore();
    }

    addEventListener("mousemove", mousemoveHandler, false);

}, false);
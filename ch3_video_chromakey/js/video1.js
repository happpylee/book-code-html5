addEventListener("load", function(event) {

    var canvasDiv = document.createElement("div");
    var canvasElement = document.createElement("canvas");
    var context = canvasElement.getContext("2d");
    document.body.appendChild(canvasDiv);
    canvasElement.width = 480;
    canvasElement.height = 270;
    canvasDiv.appendChild(canvasElement);

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

}, false);
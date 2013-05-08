addEventListener("load", function(event) {

    ///////////////////////////////////////////////////
    //
    // 변수 정의 및 초기화 영역
    //
    ///////////////////////////////////////////////////

    var imageData1 = null,
        imageData2 = null,
        videoFormat = null,
        canvasDiv1 = document.createElement("div"),
        canvasElement1 = document.createElement("canvas"),
        context1 = canvasElement1.getContext("2d"),
        canvasDiv2 = document.createElement("div"),
        canvasElement2 = document.createElement("canvas"),
        context2 = canvasElement2.getContext("2d"),
        canvasVideoDiv = document.createElement("div"),
        canvasVideo = document.createElement("canvas"),
        canvasVideoContext = canvasVideo.getContext("2d"),
        videoDiv = document.createElement("div"),
        videoElement = document.createElement("video");

    ///////////////////////////////////////////////////
    //
    // 함수 정의 영역
    //
    ///////////////////////////////////////////////////

    function init() {

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

        document.body.appendChild(canvasDiv1);
        canvasElement1.width = 320;
        canvasElement1.height = 240;
        canvasDiv1.appendChild(canvasElement1);

        document.body.appendChild(canvasDiv2);
        canvasElement2.width = 320;
        canvasElement2.height = 240;
        canvasDiv2.appendChild(canvasElement2);
        canvasDiv2.style.position = "absolute";
        canvasDiv2.style.left = 100 + "px";
        canvasDiv2.style.top = 50 + "px";

        document.body.appendChild(canvasVideoDiv);
        canvasVideo.width = 320;
        canvasVideo.height = 240;
//        canvasVideoDiv.appendChild(canvasVideo);

        videoElement.setAttribute("loop", "loop");
        /*document.body.appendChild(videoDiv);
        videoDiv.appendChild(videoElement);*/

        videoFormat = checkVideoFormat(videoElement);
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

    function loadVideo() {

        if(videoFormat == "") {
            console.log("No Video Format support!");
            return;
        }
        else {
            var videoSource = document.createElement("source");
            videoSource.src = "res/video/" + videoFormat + "/bluescreen." + videoFormat;
            videoElement.appendChild(videoSource);
            videoElement.addEventListener("canplaythrough", videoLoadHandler, false);
        }
    }

    function update() {

        canvasVideoContext.drawImage(videoElement, 0, 0, 720, 480, 0, 0, 320, 240);

        imageData1 = canvasVideoContext.getImageData(0, 0, 320, 240);
        imageData2 = canvasVideoContext.getImageData(0, 0, 320, 240);

        for(var i=0; i<imageData1.data.length; i+=4) {

            if( imageData1.data[i+0] > 0 && imageData1.data[i+0] < 173 &&
                imageData1.data[i+1] > 18 && imageData1.data[i+1] < 169 &&
                imageData1.data[i+2] > 91 && imageData1.data[i+2] < 255 ||
                (i/4)%320 < 100 || (i/4)%320 > 225) {

                imageData1.data[i+3] = 0;
                imageData2.data[i+3] = 0;
            }
            else
            {
                imageData1.data[i+0] = 235;
                imageData1.data[i+1] = 38;
                imageData1.data[i+2] = 182;

                imageData2.data[i+0] = 252;
                imageData2.data[i+1] = 212;
                imageData2.data[i+2] = 30;
            }
        }

        context1.putImageData(imageData1, 0, 0);
        context2.putImageData(imageData2, 0, 0);
    }

    function loopAnimationFrame() {

        update();
        window.renderAnimationFrame(loopAnimationFrame);
    }

    ///////////////////////////////////////////////////
    //
    // 이벤트 핸들러 정의 영역
    //
    ///////////////////////////////////////////////////

    function videoLoadHandler(event) {
        videoElement.play();
        loopAnimationFrame();
    }

    ///////////////////////////////////////////////////
    //
    // 함수 호출 영역
    //
    ///////////////////////////////////////////////////

    init();
    loadVideo();

}, false);
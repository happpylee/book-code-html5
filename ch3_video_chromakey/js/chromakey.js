addEventListener("load", function(event) {

    ///////////////////////////////////////////////////
    //
    // 상수 정의 영역
    //
    ///////////////////////////////////////////////////

    var VIDEO_ORIGIN_WIDTH = 720,
        VIDEO_GRIGIN_HEIGHT = 480,
        VIDEO_COPY_WIDTH = 320,
        VIDEO_COPY_HEIGHT = 240,
        VIDEO_COUNT = 6,
        VIDEO_CHROMAKEY_SIZE_WIDTH = 120,
        VIDEO_COLOR_LIST = [ [235, 38, 182], [218, 255, 0], [7, 222, 15], [20, 217, 210], [217, 151, 20], [252, 212, 30] ],

    ///////////////////////////////////////////////////
    //
    // 변수 정의 및 초기화 영역
    //
    ///////////////////////////////////////////////////

        videoElement = document.createElement("video"),
        copyVideoElement = document.createElement("canvas"),
        canvasVideoContext = copyVideoElement.getContext("2d"),
        chromakeyVideoContainer = document.getElementById("chromakeyVideoContainer"),
        chromakeyVideoList = [],
        videoFormat = null;

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
                function(callback) {
                    window.setTimeout(callback, 1000/60);
                };
        })();

        window.addEventListener("resize", function(event) {

            layoutVideoContainerToCenter();

        }, false);
    }

    function initVideo() {

        copyVideoElement.width = VIDEO_COPY_WIDTH;
        copyVideoElement.height = VIDEO_COPY_HEIGHT;

        videoElement.loop = true; // videoElement.setAttribute("loop", true);
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

    function createChromakeyVideo() {

        var columnCount = 3;

        for(var i=0; i<VIDEO_COUNT; i++) {

            var chromakeyCanvasDiv = document.createElement("div"),
                chromakeyCanvasElement = document.createElement("canvas"),
                chromakeyCanvasContext = chromakeyCanvasElement.getContext("2d"),
                chromakeyCanvasInfo = [],
                chromakeyCanvasDivPosX = -(Math.floor(i%columnCount) * VIDEO_CHROMAKEY_SIZE_WIDTH),
                chromakeyCanvasDivPosY = 0;

            chromakeyCanvasElement.width = VIDEO_COPY_WIDTH;
            chromakeyCanvasElement.height = VIDEO_COPY_HEIGHT;
            chromakeyCanvasDiv.style.position = "relative";
            chromakeyCanvasDiv.style.display = "inline";
            chromakeyCanvasDiv.style.left = chromakeyCanvasDivPosX + "px";
            chromakeyCanvasDiv.style.top = chromakeyCanvasDivPosY + "px";
            chromakeyCanvasDiv.appendChild(chromakeyCanvasElement);
            chromakeyVideoContainer.appendChild(chromakeyCanvasDiv);

            chromakeyCanvasInfo[0] = chromakeyCanvasDiv;
            chromakeyCanvasInfo[1] = chromakeyCanvasElement;
            chromakeyCanvasInfo[2] = chromakeyCanvasContext;

            chromakeyVideoList.push(chromakeyCanvasInfo);
        }
    }

    function layoutVideoContainerToCenter() {

        var chromakeyVideoContainerCenter = Math.floor(window.innerWidth/2 - chromakeyVideoContainer.clientWidth/2) + 100;

        chromakeyVideoContainer.style.left = chromakeyVideoContainerCenter  + "px";
    }

    function loadVideoSource() {

        if(videoFormat == "") {
            console.log("No Video Format support!");
            return;
        }
        else {
            var videoSource = document.createElement("source");
            videoSource.src = "res/video/" + videoFormat + "/bluescreen_dance." + videoFormat;
            videoElement.appendChild(videoSource);
            videoElement.addEventListener("canplaythrough", videoLoadHandler, false);
        }
    }

    function update() {

        var chromakeyVideoImageDataLength = 0;

        // video 소스에서 video context로 drawImage(축소)
        canvasVideoContext.drawImage(videoElement, 0, 0, VIDEO_ORIGIN_WIDTH, VIDEO_GRIGIN_HEIGHT, 0, 0, VIDEO_COPY_WIDTH, VIDEO_COPY_HEIGHT);

        // video context에서 픽셀데이터 추출
        for(var i=0; i<VIDEO_COUNT; i++) {
            chromakeyVideoList[i][3] = canvasVideoContext.getImageData(0, 0, VIDEO_COPY_WIDTH, VIDEO_COPY_HEIGHT);
        }

        // 픽셀데이터 추출 후, imageData의 길이 저장
        chromakeyVideoImageDataLength = chromakeyVideoList[0][3].data.length;

        // 추출된 픽셀데이터 변형 조작
        for(var j=0; j<VIDEO_COUNT; j++) {

            for(var i=0; i<chromakeyVideoImageDataLength; i+=4) {

                var currentVideoImageData = chromakeyVideoList[j][3].data;

                if( currentVideoImageData[i+0] >= 0 && currentVideoImageData[i+0] < 173 &&
                    (currentVideoImageData[i+1] < 5 || currentVideoImageData[i+1] > 18) && currentVideoImageData[i+1] < 169 &&
                    currentVideoImageData[i+2] > 91 && currentVideoImageData[i+2] <= 255 ||
                    (i/4)%VIDEO_COPY_WIDTH < 100 || (i/4)%VIDEO_COPY_WIDTH > 225) {

                    currentVideoImageData[i+3] = 0;
                }
                else
                {
                    currentVideoImageData[i+0] = VIDEO_COLOR_LIST[j][0];
                    currentVideoImageData[i+1] = VIDEO_COLOR_LIST[j][1];
                    currentVideoImageData[i+2] = VIDEO_COLOR_LIST[j][2];
                }
            }

            // 변형된 비디오 픽셀데이터 context에 뿌려줌
            chromakeyVideoList[j][2].putImageData(chromakeyVideoList[j][3], 0, 0);
        }
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
    initVideo();
    createChromakeyVideo();
    loadVideoSource();
    layoutVideoContainerToCenter();

}, false);
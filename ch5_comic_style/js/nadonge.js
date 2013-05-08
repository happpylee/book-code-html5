$(document).ready(function() {

    ///////////////////////////////////////////////////
    //
    // 상수 정의 영역
    //
    ///////////////////////////////////////////////////

    var CLASS_NAME_LIST = ["comic_frame_1", "comic_frame_2", "comic_frame_3", "comic_frame_4", "comic_frame_5", "comic_frame_6", "comic_frame_7", "comic_frame_text"],
        FRAME_HEIGHT_VALUE_LIST = [183, 171, 180, 173, 180, 973, 182, 43],
        NEXT_BUTTON_POSITION = [ [160, 180], [156, 166], [160, 172], [150, 170], [162, 176], [150, 970], [150, 174]],
        AIRPLANE_ANGLE_LIST = [50, 60, 70, 80, 90, 80, 70, 60, 50],

    ///////////////////////////////////////////////////
    //
    // 변수 정의 및 초기화 영역
    //
    ///////////////////////////////////////////////////

        scrollContainer = document.getElementById("scrollContainer"),
        comicFrameContainer = document.getElementById("comicFrameContainer"),
        copyright = document.querySelector("#copyright"),
        nextButtonNormal = null,
        nextButtonTouch = null,
        homeButton = null,
        airplanePosX = 0,
        airplanePosY = 0,
        airplaneAngleIndex = 0,
        currentFrameIndex = -1;

    ///////////////////////////////////////////////////
    //
    // 함수 정의 영역
    //
    ///////////////////////////////////////////////////

    function init() {

        scrollContainer.style.height = window.innerHeight + "px";

        comicFrameContainer.appendChild(copyright);

        window.addEventListener("resize", function(event) {

            scrollContainer.style.width = window.innerWidth + "px";
            scrollContainer.style.height = window.innerHeight + "px";

            comicFrameContainer.style.left = Math.floor(window.innerWidth/2 - comicFrameContainer.clientWidth/2) + "px";

        }, false);
    }

    function createHomeButton() {

        var homeButtonText = document.createTextNode("다시보기");
        var homeButtonClickHandler = function(event) {
            var comicFrameList = document.querySelectorAll(".comic_frame");

            for(var i=0; i<comicFrameList.length; i++) {
                comicFrameList[i].parentNode.removeChild(comicFrameList[i]);
            }

            currentFrameIndex = -1;
            addComicFrameDiv(CLASS_NAME_LIST[++currentFrameIndex]);
        }

        homeButton = document.createElement("button");
        homeButton.addEventListener("click", homeButtonClickHandler, false);
        homeButton.appendChild(homeButtonText);

        homeButton.style.position = "relative";
        homeButton.style.fontSize = 11 + "px";
        homeButton.style.left = Math.floor(comicFrameContainer.clientWidth/2 - homeButton.clientWidth/2) + "px";
        homeButton.style.top = 66 + "px";
    }

    function createNextButton() {

        var nextButtonTouchMouseoutHandler = function(event) {
            nextButtonNormal.style.display = "block";
            nextButtonTouch.style.display = "none";
            nextButtonTouch.style.cursor = "auto";
        }

        var nextButtonTouchClickHandler = function(event) {
            nextButtonNormal.style.display = "none";
            nextButtonTouch.style.display = "none";
            nextButtonTouch.removeEventListener("mouseout", nextButtonTouchMouseoutHandler, false);

            addComicFrameDiv(CLASS_NAME_LIST[++currentFrameIndex]);
            event.stopImmediatePropagation();
        }

        var nextButtonNormalMouseoverHandler = function(event) {
            nextButtonNormal.style.display = "none";
            nextButtonTouch.style.display = "block";
            nextButtonTouch.style.cursor = "pointer";

            nextButtonTouch.addEventListener("click", nextButtonTouchClickHandler, false);
            nextButtonTouch.addEventListener("mouseout", nextButtonTouchMouseoutHandler, false);
        }

        nextButtonNormal = document.createElement("div");
        nextButtonNormal.className = "comic_next_normal comic_frame";
        nextButtonNormal.addEventListener("mouseover", nextButtonNormalMouseoverHandler, false);
        nextButtonNormal.style.display = "none";

        nextButtonTouch = document.createElement("div");
        nextButtonTouch.className = "comic_next_touch comic_frame";
        nextButtonTouch.style.display = "block";
    }

    function addComicFrameDiv(className) {

        var styleHeight = 0,
            comicFrameDiv = null,
            airplaneDiv = null,
            comicFrameDivStyleTimer = null;

        // Next버튼을 화면에서 감춤
        nextButtonNormal.style.display = "none";
        nextButtonTouch.style.display = "none";

        // Comic Frame(만화칸)을 Div형태로 생성
        comicFrameDiv = document.createElement("div");
        comicFrameDiv.className = className + " comic_frame";
        comicFrameDiv.style.display = "none";
        comicFrameContainer.appendChild(comicFrameDiv);

        // 비행기 돔(Dom) 생성
        if(currentFrameIndex == 5) {
            airplaneDiv = document.createElement("div");
            airplaneDiv.className = "comic_airplane comic_frame";
            airplaneDiv.style.left = airplanePosX + "px";
            airplaneDiv.style.top = airplanePosY + "px";
            comicFrameContainer.appendChild(airplaneDiv);
        }

        // Comic이 끝날 때의 텍스트는 길이가 달라, 처리가 필요
        if(currentFrameIndex == 7) {
            comicFrameDiv.style.left = -35 + "px";
            comicFrameDiv.appendChild(homeButton);
        }

        // Comic Frame이 서서히 열리게 하는 처리
        comicFrameDivStyleTimer = setInterval(function(event) {
            styleHeight += 4;
            comicFrameDiv.style.display = "block";
            comicFrameDiv.style.height = styleHeight + "px";

            // 약속된 위치까지 열리면, 열리는 작업 정지하고 해당 타이머 제거
            if(styleHeight >= FRAME_HEIGHT_VALUE_LIST[currentFrameIndex]) {

                if(NEXT_BUTTON_POSITION[currentFrameIndex] != undefined) {
                    nextButtonNormal.style.left = NEXT_BUTTON_POSITION[currentFrameIndex][0] + "px";
                    nextButtonNormal.style.top = NEXT_BUTTON_POSITION[currentFrameIndex][1] + "px";
                    nextButtonNormal.style.display = "block";

                    nextButtonTouch.style.left = NEXT_BUTTON_POSITION[currentFrameIndex][0] + "px";
                    nextButtonTouch.style.top = NEXT_BUTTON_POSITION[currentFrameIndex][1] + "px";
                    nextButtonTouch.style.display = "none";
                }
                else {
                    nextButtonNormal.style.display = "none";
                    nextButtonTouch.style.display = "none";
                }

                comicFrameDiv.appendChild(nextButtonTouch);
                comicFrameDiv.appendChild(nextButtonNormal);

                clearInterval(comicFrameDivStyleTimer);
            }

            // 인덱스5는 비행기Dom이 날라다니는 것을 표현하는 부분
            if(currentFrameIndex == 5) {

                airplanePosX = comicFrameDiv.offsetLeft + 20;
                airplanePosY = scrollContainer.scrollHeight - 300;
                airplaneAngleIndex = (airplaneAngleIndex >= AIRPLANE_ANGLE_LIST.length) ? 0 : (airplaneAngleIndex += 1);

                airplaneDiv.style.display = "block";
                airplaneDiv.style.left = airplanePosX + "px";
                airplaneDiv.style.top = airplanePosY + "px";

                var scaleFactor = 1;

                if(styleHeight <= 260) {

                    scaleFactor = styleHeight / 260;

                    airplaneDiv.style.webkitTransform = "scale(" + scaleFactor + ", " + scaleFactor + ")";
                    airplaneDiv.style.msTransform = "scale(" + scaleFactor + ", " + scaleFactor + ")";
                    airplaneDiv.style.transform = "scale(" + scaleFactor + ", " + scaleFactor + ")";
                }
                else {
                    airplaneDiv.style.webkitTransform = "rotate(" + AIRPLANE_ANGLE_LIST[airplaneAngleIndex] + "deg)";
                    airplaneDiv.style.msTransform = "rotate(" + AIRPLANE_ANGLE_LIST[airplaneAngleIndex] + "deg)";
                    airplaneDiv.style.transform = "rotate(" + AIRPLANE_ANGLE_LIST[airplaneAngleIndex] + "deg)";
                }
            }

            // 저작권 표시문구 위치 잡기
            copyright.style.top = comicFrameContainer.clientHeight + 76 + "px";

            // 해당 위치로 이동
            $("#scrollContainer").scrollTop(scrollContainer.scrollHeight);

        }, 1000/60);
    }

    ///////////////////////////////////////////////////
    //
    // 함수 호출 영역
    //
    ///////////////////////////////////////////////////

    init();
    createHomeButton();
    createNextButton();
    addComicFrameDiv(CLASS_NAME_LIST[++currentFrameIndex]);
});
// [저자가 말합니다]
//
// 이 책의 다른 샘플 프로젝트에서는 대개의 경우 주석을 제거하였으나
// 이 프로젝트만큼은 제가 확인했던 주석을 그대로 적어 놓습니다.
// 필요가 없으신 분에게는 오히려 방해되는 요소가 될 수도 있다는 것을 잘 압니다.
// 하지만, 코드를 조금이라도 더 이해하실 수 있도록 하고픈 저의 작은 배려라고 생각해 주세요.

window.addEventListener("load", function(event) {

    ///////////////////////////////////////////////////
    //
    // 상수 정의 영역
    //
    ///////////////////////////////////////////////////

    var PAGE_OPEN_ANGLE_LIST = [-180, 2, -178, 4],
        PAGE_CLOSE_ANGLE_LIST = [-4, 178, -2, 180],
        VIEWPORT_ROTATE_X_FACTOR = "0.45454545454",
        VIEWPORT_TRANSLATE_X_FACTOR = "2.95454545455",
        VIEWPORT_TRANSLATE_Y_FACTOR = "1.36363636364",
        VIEWPORT_TRANSLATE_Z_FACTOR = "2.27272727273",

    ///////////////////////////////////////////////////
    //
    // 변수 정의 및 초기화 영역
    //
    ///////////////////////////////////////////////////

        viewportRotateX = -60,      // -60 <=> -20
        viewportRotateY = 0,
        viewportRotateZ = 0,
        viewportTranslateX = -260,  // -260 <=> 0 <=> 260
        viewportTranslateY = -70,   // -70 <=> 50
        viewportTranslateZ = -600,  // -600 <=> -400
        bookRotateX = 90,
        bookRotateY = 0,
        bookRotateZ = 0,
        bookTranslateX = 0,
        bookTranslateY = 100,
        bookTranslateZ = 0,
        currentPageNo = 0,
        previousMouseX = 0,
        pageOpenCloseStep = 0,
        pageTotalStep = Math.abs( (PAGE_CLOSE_ANGLE_LIST[0] - PAGE_OPEN_ANGLE_LIST[0]) / 2 ),
        frontPageRotateY = PAGE_CLOSE_ANGLE_LIST[currentPageNo],
        backPageRotateY = PAGE_CLOSE_ANGLE_LIST[currentPageNo + 1],
        canPageRotateY = true,
        isMousedown = false,

        viewport = document.getElementById("viewport"),
        book = document.getElementById("book"),
        page1_decoration1 = document.getElementById("page1_decoration1"),
        page1_decoration2 = document.getElementById("page1_decoration2"),
        page2_decoration1 = document.getElementById("page2_decoration1"),
        page2_decoration2 = document.getElementById("page2_decoration2"),
        page2_decoration3 = document.getElementById("page2_decoration3"),
        page2_decoration4 = document.getElementById("page2_decoration4"),
        page1_decoration1_rotateX = 0,
        page1_decoration2_rotateX = 0,
        page2_decoration1_rotateX = 0,
        page2_decoration2_rotateX = 0,
        page2_decoration3_rotateX = 0,
        page2_decoration4_rotateX = 0,
        pageTotalCount = 0,
        pageList = [];

    pageList.push(document.getElementsByClassName("cover")[0]);
    pageList.push(document.getElementsByClassName("page1")[0]);
    pageList.push(document.getElementsByClassName("page2")[0]);
    pageList.push(document.getElementsByClassName("back")[0]);

    pageTotalCount = pageList.length;

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

        addEventListener("mousedown", mousedownHandler, false);
        addEventListener("mouseup", mouseupHandler, false);
        addEventListener("mousemove", mousemoveHandler, false);
    }

    function updateViewportAndBook() {

        var viewportTransformString = "translateX(" + viewportTranslateX + "px) "  +
                                      "translateY(" + viewportTranslateY + "px) "  +
                                      "translateZ(" + viewportTranslateZ + "px) " +
                                      "rotateX(" + viewportRotateX + "deg) " +
                                      "rotateY(" + viewportRotateY + "deg) " +
                                      "rotateZ(" + viewportRotateZ + "deg)";

        viewport.style.webkitTransform = viewportTransformString;
        viewport.style.msTransform = viewportTransformString;
        viewport.style.transform = viewportTransformString;

        var bookTransformString = "translateX(" + bookTranslateX + "px) " +
                                  "translateY(" + bookTranslateY + "px) " +
                                  "translateZ(" + bookTranslateZ + "px) " +
                                  "rotateX(" + bookRotateX + "deg) " +
                                  "rotateY(" + bookRotateY + "deg) " +
                                  "rotateZ(" + bookRotateZ + "deg)";

        book.style.webkitTransformOrigin = "600px 300px";
        book.style.msTransformOrigin = "600px 300px";
        book.style.transformOrigin = "600px 300px";

        book.style.webkitTransform = bookTransformString;
        book.style.msTransform = bookTransformString;
        book.style.transform = bookTransformString;
    }

    function loopAnimationFrame() {

        updateViewportAndBook();
        window.renderAnimationFrame(loopAnimationFrame);
    }

    ///////////////////////////////////////////////////
    //
    // 이벤트 핸들러 정의 영역
    //
    ///////////////////////////////////////////////////

    function mousedownHandler(event) {

        // 마우스 클릭 여부 플래그 설정
        isMousedown = true;

        // 클릭&드래그의 최초 위치점을 저장
        previousMouseX = event.clientX;

        // 페이지의 회전가능 여부 상태(책을 넘길 수 있는지의 여부)
        canPageRotateY = true;

        // 기본 이벤트 취소
        event.preventDefault();
    }

    function mouseupHandler(event) {

        isMousedown = false;
    }

    function mousemoveHandler(event) {

        if(isMousedown) {

            // 페이지가 얼만큼 열려 있거나 닫혀 있는지에 대한 값
            pageOpenCloseStep = (PAGE_CLOSE_ANGLE_LIST[currentPageNo] - frontPageRotateY) / 2 + 1;

            // 왼쪽으로 드래그 했을 때(페이지가 열림)
            if( (previousMouseX > event.clientX) && canPageRotateY ) {

                // 페이지가 아직 덜 열렸을 때
                if(frontPageRotateY > PAGE_OPEN_ANGLE_LIST[currentPageNo]) {

                    // [참고 내용]
                    //
                    // 페이지를 넘길때 앞면과 뒷면이 붙은 페이지가 동시에 넘어가기 때문에
                    // 샘플 프로젝트에서의 페이지 번호는 2배수 형태를 가짐
                    // 따라서 이 프로젝트는 0페이지와 2페이지, 이렇게 2개의 페이지를 갔게 됨

                    // 붙어 있는 앞면과 뒷면을 2씩 회전값을 변화 시킴
                    frontPageRotateY -= 2;
                    backPageRotateY -= 2;

                    // 0페이지(표지+본문1페이지)
                    if(currentPageNo == 0) {

                        // 페이지의 열리는 각도 단계값에 따라, 회전과 위치를 변경
                        viewportRotateX = -60 + (VIEWPORT_ROTATE_X_FACTOR * pageOpenCloseStep);         // ==> -20
                        viewportTranslateX = -260 + (VIEWPORT_TRANSLATE_X_FACTOR * pageOpenCloseStep);  // ==> 0
                        viewportTranslateY = -70 + (VIEWPORT_TRANSLATE_Y_FACTOR * pageOpenCloseStep);   // ==> 50
                        viewportTranslateZ = -600 + (VIEWPORT_TRANSLATE_Z_FACTOR * pageOpenCloseStep);  // ==> -400

                        // 페이지가 열릴 수 있는 마지막 각도 단계값일 때(더 이상은 페이지가 회전되지 않음)
                        // 미리 설정된 뷰포의 값으로 설정
                        if(pageOpenCloseStep == pageTotalStep) {

                            viewportRotateX = -20;
                            viewportTranslateX = 0;
                            viewportTranslateY = 50;
                            viewportTranslateZ = -400;
                        }

                        console.log("[currentPageNo == 0] frontPageRotateY: " + frontPageRotateY +
                            " => pageOpenCloseStep: " + pageOpenCloseStep +
                            " => viewportRotateX: " + viewportRotateX +
                        " => viewportTranslateX: " + viewportTranslateX +
                        " => viewportTranslateY: " + viewportTranslateY +
                        " => viewportTranslateZ: " + viewportTranslateZ);
                    }

                    // 1페이지(본문2페이지+뒷면)
                    if(currentPageNo == 2) {

                        // 페이지의 열리는 각도 단계값에 따라, 회전과 위치를 변경
                        viewportRotateX = -20 - (VIEWPORT_ROTATE_X_FACTOR * pageOpenCloseStep);         // ==> -60
                        viewportTranslateX = 0 + (VIEWPORT_TRANSLATE_X_FACTOR * pageOpenCloseStep);     // ==> 260
                        viewportTranslateY = 50 - (VIEWPORT_TRANSLATE_Y_FACTOR * pageOpenCloseStep);    // ===> -70
                        viewportTranslateZ = -400 - (VIEWPORT_TRANSLATE_Z_FACTOR * pageOpenCloseStep);  // ==> -600

                        // 페이지가 열릴 수 있는 마지막 각도 단계값일 때(더 이상은 페이지가 회전되지 않음)
                        // 미리 설정된 뷰포의 값으로 설정
                        if(pageOpenCloseStep == pageTotalStep) {

                            viewportRotateX = -60;
                            viewportTranslateX = 260;
                            viewportTranslateY = -70;
                            viewportTranslateZ = -600;
                        }

                        console.log("[currentPageNo == 2] frontPageRotateY: " + frontPageRotateY +
                            " => pageOpenCloseStep: " + pageOpenCloseStep +
                            " => viewportRotateX: " + viewportRotateX +
                            " => viewportTranslateX: " + viewportTranslateX +
                            " => viewportTranslateY: " + viewportTranslateY +
                            " => viewportTranslateZ: " + viewportTranslateZ);
                    }

                    // 페이지에 올라가는 데코레이션의 각도를 설정
                    //
                    page1_decoration1_rotateX -= 1.2;
                    page1_decoration1.style.webkitTransform = "rotateX(" + page1_decoration1_rotateX + "deg)";

                    page1_decoration2_rotateX -= 1.1;
                    page1_decoration2.style.webkitTransform = "rotateX(" + page1_decoration2_rotateX + "deg)";

                    page2_decoration1_rotateX -= 0.9;
                    page2_decoration1.style.webkitTransform = "rotateX(" + page2_decoration1_rotateX + "deg)";

                    page2_decoration2_rotateX -= 0.9;
                    page2_decoration2.style.webkitTransform = "rotateX(" + page2_decoration2_rotateX + "deg)";

                    page2_decoration3_rotateX -= 0.9;
                    page2_decoration3.style.webkitTransform = "rotateX(" + page2_decoration3_rotateX + "deg)";

                    page2_decoration4_rotateX -= 0.9;
                    page2_decoration4.style.webkitTransform = "rotateX(" + page2_decoration4_rotateX + "deg)";

                    console.log("[Deco Angle] page1_decoration1_rotateX: " + page1_decoration1_rotateX +
                        " / page1_decoration2_rotateX: " + page1_decoration2_rotateX +
                        " / page2_decoration1_rotateX: " + page2_decoration1_rotateX);
                }

                // 페이지가 완전히 열렸을 때
                else if(frontPageRotateY <= PAGE_OPEN_ANGLE_LIST[currentPageNo]) {

                    // 페이지를 넘길때 앞면과 뒷면이 붙은 페이지가 동시에 넘어가기 때문에
                    // 샘플 프로젝트에서의 페이지 번호는 2배수 형태를 가짐
                    // 따라서 이 프로젝트는 0페이지와 2페이지, 이렇게 2개의 페이지를 갔게 됨
                    if(currentPageNo != pageTotalCount/2) {

                        currentPageNo += 2;

                        // 페이지가 넘어갔기 때문에, 새로운 페이지 각도로 재설정 필요
                        frontPageRotateY = PAGE_CLOSE_ANGLE_LIST[currentPageNo];
                        backPageRotateY = PAGE_CLOSE_ANGLE_LIST[currentPageNo + 1];
                    }

                    // 이 페이지는 더 이상 왼쪽으로 회전이 불가능 함
                    canPageRotateY = false;

                    console.log("[mousemoveHandler] currentPageNo: " + currentPageNo);
                }
            }

            // 오른쪽으로 드래그 했을 때(페이지가 닫힘)
            else if(previousMouseX < event.clientX) {

                // 아직 페이지가 덜 열였을 때
                if(frontPageRotateY < PAGE_CLOSE_ANGLE_LIST[currentPageNo]) {

                    frontPageRotateY += 2;
                    backPageRotateY += 2;

                    pageOpenCloseStep = pageTotalStep - pageOpenCloseStep + 2;

                    // 1페이지(본문2페이지+뒷면)
                    if(currentPageNo == 2) {

                        // 페이지의 열리는 각도 단계값에 따라, 회전과 위치를 변경
                        viewportRotateX = -60 + (VIEWPORT_ROTATE_X_FACTOR * pageOpenCloseStep);         // ==> -20
                        viewportTranslateX = 260 - (VIEWPORT_TRANSLATE_X_FACTOR * pageOpenCloseStep);   // ==> 0
                        viewportTranslateY = -70 + (VIEWPORT_TRANSLATE_Y_FACTOR * pageOpenCloseStep);   // ===> 50
                        viewportTranslateZ = -600 + (VIEWPORT_TRANSLATE_Z_FACTOR * pageOpenCloseStep);  // ==> -400

                        // 페이지가 열릴 수 있는 마지막 각도 단계값일 때(더 이상은 페이지가 회전되지 않음)
                        // 미리 설정된 뷰포의 값으로 설정
                        if(pageOpenCloseStep == 0) {

                            viewportRotateX = -20;
                            viewportTranslateX = 0;
                            viewportTranslateY = 50;
                            viewportTranslateZ = -400;
                        }

                        console.log("[currentPageNo == 0] frontPageRotateY: " + frontPageRotateY +
                            " => pageOpenCloseStep: " + pageOpenCloseStep +
                            " => viewportRotateX: " + viewportRotateX +
                            " => viewportTranslateX: " + viewportTranslateX +
                            " => viewportTranslateY: " + viewportTranslateY +
                            " => viewportTranslateZ: " + viewportTranslateZ);
                    }

                    // 0페이지(표지+본문1페이지)
                    else if(currentPageNo == 0) {

                        viewportRotateX = -20 - (VIEWPORT_ROTATE_X_FACTOR * pageOpenCloseStep); // ==> -60
                        viewportTranslateX = 0 - (VIEWPORT_TRANSLATE_X_FACTOR * pageOpenCloseStep); // ==> -260
                        viewportTranslateY = 50 - (VIEWPORT_TRANSLATE_Y_FACTOR * pageOpenCloseStep); // ===> -70
                        viewportTranslateZ = -400 - (VIEWPORT_TRANSLATE_Z_FACTOR * pageOpenCloseStep); // ==> -600

                        if(pageOpenCloseStep == 0) {

                            viewportRotateX = -60;
                            viewportTranslateX = 260;
                            viewportTranslateY = -70;
                            viewportTranslateZ = -600;
                        }

                        console.log("[currentPageNo == 2] frontPageRotateY: " + frontPageRotateY +
                            " => pageOpenCloseStep: " + pageOpenCloseStep +
                            " => viewportRotateX: " + viewportRotateX +
                            " => viewportTranslateX: " + viewportTranslateX +
                            " => viewportTranslateY: " + viewportTranslateY +
                            " => viewportTranslateZ: " + viewportTranslateZ);
                    }

                    // 페이지에 올라가는 데코레이션의 각도를 설정
                    //
                    page1_decoration1_rotateX += 1.2;
                    page1_decoration1.style.webkitTransform = "rotateX(" + page1_decoration1_rotateX + "deg)";

                    page1_decoration2_rotateX += 1.1;
                    page1_decoration2.style.webkitTransform = "rotateX(" + page1_decoration2_rotateX + "deg)";

                    page2_decoration1_rotateX += 0.9;
                    page2_decoration1.style.webkitTransform = "rotateX(" + page2_decoration1_rotateX + "deg)";

                    page2_decoration2_rotateX += 0.9;
                    page2_decoration2.style.webkitTransform = "rotateX(" + page2_decoration2_rotateX + "deg)";

                    page2_decoration3_rotateX += 0.9;
                    page2_decoration3.style.webkitTransform = "rotateX(" + page2_decoration3_rotateX + "deg)";

                    page2_decoration4_rotateX += 0.9;
                    page2_decoration4.style.webkitTransform = "rotateX(" + page2_decoration4_rotateX + "deg)";
                }

                // 설정된 각도까지 페이지가 완전히 열렸을 때
                else if(frontPageRotateY >= PAGE_CLOSE_ANGLE_LIST[currentPageNo]) {

                    if(currentPageNo != 0) {

                        currentPageNo -= 2;

                        frontPageRotateY = PAGE_OPEN_ANGLE_LIST[currentPageNo];
                        backPageRotateY = PAGE_OPEN_ANGLE_LIST[currentPageNo + 1];
                    }

                    // 페이지가 회전되지 않게 하는 플래그
                    canPageRotateY = false;

                    console.log("[mousemoveHandler] currentPageNo: "  + currentPageNo);
                }
            }

            // 현재 마우스 포인터의 위치를 보관하여, 다음에 따라오는 마우스 포인터의 위치와 비교
            // 이를 통해 유저가 클릭-드래그를 어느쪽 방향으로 했는지를 판단
            previousMouseX = event.clientX;

            // 앞면과 뒷면이 함께 회전하기 위한(페이지가 열리거나 닫히기 위한) 각도를 설정
            // 여기서 설정한 값들이 페이지의 실질적인 변환을 이뤄지게 함
            var currentPageTransformString = "rotateY(" + frontPageRotateY + "deg)";
            var nextPageTransformString = "rotateY(" + backPageRotateY + "deg)";

            pageList[currentPageNo].style.transform = currentPageTransformString;
            pageList[currentPageNo].style.webkitTransform = currentPageTransformString;
            pageList[currentPageNo].style.MozTransform = currentPageTransformString;
            pageList[currentPageNo].style.oTransform = currentPageTransformString;

            pageList[currentPageNo+1].style.transform = nextPageTransformString;
            pageList[currentPageNo+1].style.webkitTransform = nextPageTransformString;
            pageList[currentPageNo+1].style.MozTransform = nextPageTransformString;
            pageList[currentPageNo+1].style.oTransform = nextPageTransformString;
        }
        else {

            // 마우스를 드래그 할 때, 화면이 좌우로 움직이게 하는 각도의 범위를 설정
            // 뒷쪽에 있는 30이라는 숫자를 변경하면 움직이는 범위가 변경됨
            // 또한 viewportRotateX를 설정하여 상하의 움직임도 범위설정을 할 수 있음
            viewportRotateY = -( 0.5 - (event.clientX / window.innerWidth) ) * 30;
        }

        // 뷰포트와 책이 보여지는 각도를 지속적으로 변경 및 업데이트 합니다.
        updateViewportAndBook();
    }

    ///////////////////////////////////////////////////
    //
    // 함수 호출 영역
    //
    ///////////////////////////////////////////////////

    init();
    loopAnimationFrame();

}, false);
var UkulelePath = UkulelePath || {

    ///////////////////////////////////////////////////
    //
    // 상수 정의 영역
    //
    ///////////////////////////////////////////////////

    DECAY_COEFFICIENT : -0.9,        // 감쇠 계수
    DIFFERENCE_COEFFICIENT : 0.5,    // 차이 계수
    INTERACTION_COEFFICIENT : 0.017, // 반응 계수
    TAN_ANGLE : 0.10,

    PATH_VALUE_LIST : [
        [70, 134, 632, 134],   // 1번 줄
        [70, 118, 632, 118],   // 2번 줄
        [70, 100, 632, 100],   // 3번 줄
        [70, 84, 632, 84]      // 4번 줄
    ],

    ///////////////////////////////////////////////////
    //
    // 변수 정의 및 초기화 영역
    //
    ///////////////////////////////////////////////////

    bezierPathList : [],
    canvasContainer : document.getElementById("canvasContainer"),
    canvas : document.getElementById("canvas"),
    context : document.getElementById("canvas").getContext("2d"),

    ///////////////////////////////////////////////////
    //
    // 속성과 메소드를 가지는 객체 변수 초기화 영역
    //
    ///////////////////////////////////////////////////

    _pathProperties : {

        index : -1,

        isVibration : false,            // Path의 진동여부
        isPlayArea : false,             // 마우스가 연주 가능영역에 있는지의 여부
        isMouseMoveOnPath : false,      // 마우스가 Path 위에서 움직이고 있는지의 여부

        startX : 0,                     // Path의 고정 시작점(x)
        startY : 0,                     // Path의 고정 시작점(y)
        endX : 0,                       // Path의 고정 끝점(x)
        endY : 0,                       // Path의 고정 끝점(y)
        curveX : 0,                     // Path의 커브를 만드는 커브 포인트(x)
        curveY : 0,                     // Path의 커브를 만드는 커브 포인트(y)
        bezierX : 0,                    // Path의 휘어진 위치 x
        bezierY : 0,                    // Path의 휘어진 위치 y
        uFactor : 0,                    // Path의 휘어진 위치가 Path의 길이에서 가지는 비율 값 (범위: 0 ~ 1)

        updateVibrationData : function() {

            // 목표지점으로 감쇠 진동하면서 수렴하는 공식 : bezierCurvePoint.y = r * bezierCurvePoint.y + (1 - r) * targetY
            // 베지어 곡선을 이루는 커브 포인트(CP)의 y값
            this.curveY = UkulelePath.DECAY_COEFFICIENT * this.curveY + (1 - UkulelePath.DECAY_COEFFICIENT) * this.endY;

            if(Math.abs(this.curveY - this.endY) < UkulelePath.DIFFERENCE_COEFFICIENT) {
                this.isVibration = false;
                this.curveY = this.startY; // 진동을 멈추고, 커브 포인트의 y값을 초기화(베지어 곡선의 직선화)
            }
        },

        // 베지어 곡선의 한 점(bezierX, bezierY)과 함께
        // 베지어 u계수(uFactor, 0과 1의 사이 값)가 주어지면
        // 커브곡선을 위한 점을 얻을 수 있다.
        getBezierCurvePoint : function(bezierX, bezierY, uFactor) {

            /*uPoint.x = startPoint.x * up1Double + 2 * cp2.x * up1 * up + endPoint.x * upDouble;
             uPoint.y = startPoint.y * up1Double + 2 * cp2.y * up1 * up + endPoint.y * upDouble;*/

            var startEndPointCalX = bezierX - (this.startX * (1 - uFactor) * (1 - uFactor)) - (this.endX * uFactor * uFactor);
            var startEndPointCalY = bezierY - (this.startY * (1 - uFactor) * (1 - uFactor)) - (this.endY * uFactor * uFactor);

            var curvePointX = startEndPointCalX / (2 * (1 - uFactor) * uFactor);
            var curvePointY = startEndPointCalY / (2 * (1 - uFactor) * uFactor);

            return { x : curvePointX, y : curvePointY };
        },

        drawPath : function() {

            var context = UkulelePath.context;

            if(this.isVibration) this.updateVibrationData();

            context.beginPath();

            context.lineCap = "round";
            context.strokeStyle = "#776a62";
            context.lineWidth = 2;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 3;
            context.shadowBlur = 2;
            context.shadowColor = "rgba(0, 0, 0, 0.35)";

            context.moveTo(this.startX, this.startY);
            context.quadraticCurveTo(this.curveX, this.curveY, this.endX, this.endY);
            context.stroke();
        },

        playSound : function() {

            if(UkuleleSound.canIUseSound) {

                UkuleleSound.playUkuleleSound(this.index - 1);
            }
        },

        addPathTouchEventHandler : function() {

            var that = this;

            addEventListener("mousemove", function(event) {

                var canvasContainer = UkulelePath.canvasContainer,
                    touchX = event.clientX - canvasContainer.offsetLeft,
                    touchY = event.clientY - canvasContainer.offsetTop,
                    currentCurvePoint,
                    mousePointAngle,
                    bottomSideLength,
                    heightSideLength = Math.abs(that.startY - touchY);

                // 마우스 포인터가 길이의 중간을 넘었는지 체크
                if(touchX < that.uFactor) {

                    bottomSideLength = touchX - that.startX;
                }
                else {

                    bottomSideLength = that.endX - touchX;
                }

                // 마우스 포인터를 기준으로 계산된 각도
                mousePointAngle = Math.atan2(heightSideLength, bottomSideLength);

                // 마우스 포인터가 속하는 설정 계수의 범위에 따른 처리
                if(mousePointAngle > UkulelePath.INTERACTION_COEFFICIENT && mousePointAngle <= UkulelePath.TAN_ANGLE) {

                    if(that.isPlayArea) {

                        UkulelePath.canvas.style.cursor = "pointer";

                        that.bezierX = that.uFactor;
                        that.bezierY = touchY;

                        currentCurvePoint = that.getBezierCurvePoint(that.bezierX, that.bezierY, 0.5);

                        that.curveX = currentCurvePoint.x;
                        that.curveY = currentCurvePoint.y;
                    }
                }
                else if(mousePointAngle > UkulelePath.TAN_ANGLE) {

                    if(that.isMouseMoveOnPath) {

                        UkulelePath.canvas.style.cursor = "auto";
                        that.isMouseMoveOnPath = false;

                        that.playSound();
                    }

                    that.isPlayArea = false;
                    that.isVibration = true;
                }
                else if(mousePointAngle <= UkulelePath.INTERACTION_COEFFICIENT) {

                    that.isPlayArea = true;
                    that.isMouseMoveOnPath = true;
                }

            }, false);
        }
    },

    ///////////////////////////////////////////////////
    //
    // 함수 정의 영역
    //
    ///////////////////////////////////////////////////

    drawUkuleleImage : function(image) {

        UkulelePath.context.drawImage(image, 0, 0);
    },

    createBezierPath : function(pathIndex) {

        var newElement = { },
            startX = UkulelePath.PATH_VALUE_LIST[pathIndex-1][0],
            startY = UkulelePath.PATH_VALUE_LIST[pathIndex-1][1],
            endX = UkulelePath.PATH_VALUE_LIST[pathIndex-1][2],
            endY = UkulelePath.PATH_VALUE_LIST[pathIndex-1][3],
            bezierPathLength = Math.sqrt( (endX - startX) * (endX - startX) + (endY - startY) * (endY - startY)),
            bezierPathCenter = startX + bezierPathLength / 2;

        for(property in this._pathProperties) {
            if(this._pathProperties.hasOwnProperty(property)) {
                if(this._pathProperties[property] instanceof Array) {
                    newElement[property] = [].concat(this._pathProperties[property]);
                } else {
                    newElement[property] = this._pathProperties[property];
                }
            }
        }

        // BezierPath의 위치 설정
        newElement.startX = startX;
        newElement.startY = startY;
        newElement.endX = endX;
        newElement.endY = endY;

        // Paht가 생성되었을 때, 휘지 않고 직선이 되게 설정
        newElement.curveY = startY;

        // BezierPath의 인덱스 설정(줄 인덱스)
        newElement.index = pathIndex;

        // BezierPath의 중심값과 CurvePoint의 x값을 Path의 중심으로 설정
        newElement.curveX = newElement.uFactor = bezierPathCenter;

        // BezierPath를 건드리는 이벤트 처리 핸들러 설정
        newElement.addPathTouchEventHandler();

        // UkulelePath 레퍼런스를 저장
        UkulelePath.bezierPathList.push(newElement);

        return newElement;
    },

    update : function(image) {

        var canvas = UkulelePath.canvas,
            pathList = UkulelePath.bezierPathList;

        canvas.width = canvas.width;
        canvas.height = canvas.height;

        UkulelePath.drawUkuleleImage(image);

        for(var path in pathList) {
            pathList[path].drawPath();
        }
    }
}
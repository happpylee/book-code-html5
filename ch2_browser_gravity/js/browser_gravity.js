$(document).ready(function() {

    ///////////////////////////////////////////////////
    //
    // 변수 정의 및 초기화 영역
    //
    ///////////////////////////////////////////////////

    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2AABB = Box2D.Collision.b2AABB,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2World = Box2D.Dynamics.b2World,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,

        windowInnerWidth = window.innerWidth,
        windowInnerHeight = window.innerHeight,
        inputText = document.querySelector(".input_text"),
        world = new b2World(new b2Vec2(0, 10), true),
        worldScale = 30,
        wall_thickness = 60,
        mouseX = 0,
        mouseY = 0,
        canvas = null,
        context = null,
        mousePVec = null,
        mouseJoint = null,
        selectedBody = null,
        mouseDownClickList = [],
        isMouseDown = false,
        debugMode = false;

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

        document.addEventListener("mousedown", function(event) {

            isMouseDown = true;

            document.addEventListener("mousemove", mousemoveHandler, true);
            mousemoveHandler(event);

        }, true);

        document.addEventListener("mouseup", function(event) {

            mouseX = undefined;
            mouseY = undefined;

            isMouseDown = false;

            document.removeEventListener("mousemove", mousemoveHandler,true);

        }, true);

        inputText.addEventListener("keyup", keyupHandler, false);
    }

    function createBox2D(width, height, pX, pY, type, data) {

        var bodyDef = new b2BodyDef;
        bodyDef.type = type;
        bodyDef.position.Set(pX/worldScale, pY/worldScale);
        bodyDef.userData = data;

        var polygonShape = new b2PolygonShape;
        polygonShape.SetAsBox(width/2/worldScale, height/2/worldScale);

        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;

        var body= world.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);
    }
    
    function createGroundBox2D() {

        createBox2D(windowInnerWidth, wall_thickness, windowInnerWidth / 2, -wall_thickness, b2Body.b2_staticBody, null);
        createBox2D(windowInnerWidth, wall_thickness, windowInnerWidth / 2, windowInnerHeight + wall_thickness/2, b2Body.b2_staticBody, null);
        createBox2D(wall_thickness, windowInnerHeight, -wall_thickness, windowInnerHeight / 2, b2Body.b2_staticBody, null);
        createBox2D(wall_thickness, windowInnerHeight, windowInnerWidth + wall_thickness, windowInnerHeight / 2, b2Body.b2_staticBody, null);
    }

    function createSearchBox2D(x, y) {

        var element = document.getElementById("search");
        element.style.display = "block";
        element.style.cursor = "pointer";
        element.style.position = "absolute";
        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.backgroundColor = "#ffffff";

        createBox2D(element.clientWidth, element.clientHeight, x, y, b2Body.b2_dynamicBody, element);
    }

    function createImageBox2D(imageData) {

        var element = document.createElement("img");
        element.style.display = "none";
        element.style.cursor = "pointer";
        element.addEventListener("load", function () {

            var randomX = getRandomPosition(element.width - 50, windowInnerWidth - element.width - 50);
            var randomY = 50;

            element.style.display = "block";
            element.style.position = "absolute";
            element.style.left = randomX + "px";
            element.style.top = randomY + "px";
            element.style.backgroundColor = "#ffffff";

            element.addEventListener("mousedown", function(event) {

                mouseDownClickList[0] = event.clientX;
                mouseDownClickList[1] = event.clientY;

                event.preventDefault();

            }, false);

            element.addEventListener("mouseup", function(event) {

                event.preventDefault();

            }, false);

            createBox2D(element.width, element.height, randomX, randomY, b2Body.b2_dynamicBody, element);

        }, false );

        element.src = imageData.thumbnail;

        document.body.appendChild(element);
    }

    function setDebugMode() {

        if(debugMode) {
            canvas = document.createElement("canvas");
            canvas.width = windowInnerWidth;
            canvas.height = windowInnerHeight;
            canvas.style.backgroundColor = "#333333";
            context = canvas.getContext("2d");
            document.body.appendChild(canvas);

            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(context);
            debugDraw.SetDrawScale(30.0);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

            world.SetDebugDraw(debugDraw);
        }
    }

    // Math.floor(Math.random() * 100) + 1;
    // 이렇게 하면, 1에서 100까지 나오고
    // Math.floor(Math.random() * 10);
    // 이렇게 하면, 0에서 9까지 나오게 됩니다.

    function getRandomPosition(min, max) {

        return Math.floor(Math.random() * max) + min;
    }

    function getBodyAtMouse() {

        mousePVec = new b2Vec2(mouseX, mouseY);

        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

        selectedBody = null;
        world.QueryAABB(getBodyCB, aabb);

        return selectedBody;
    }

    function getBodyCB(fixture) {

        if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {

            if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {

                selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }

    function search() {

        var query = $("input.input_text").val();

        callDaumOpenAPI(query);
    }

    function callDaumOpenAPI(query) {

        var daumAPI = "여러분의 apikey를 여기에 넣으세요!";

        $.ajax({
            url : "http://apis.daum.net/search/image",
            dataType: "jsonp",
            type: "post",
            jsonp: "callback",
            data: {
                apikey: daumAPI,
                q: query,
                result: 3,
                output: "json"
            },
            success: function(result) {
                $(result.channel.item).each(function(index, data) {
                    createImageBox2D(data);
                });
            }
        });
    }

    function update() {

        if(isMouseDown && (!mouseJoint)) {

            var body = getBodyAtMouse();

            if(body) {
                var md = new b2MouseJointDef();
                md.bodyA = world.GetGroundBody();
                md.bodyB = body;
                md.collideConnected = true;
                md.target.Set(mouseX, mouseY);
                md.maxForce = 300.0 * body.GetMass();
                mouseJoint = world.CreateJoint(md);
                body.SetAwake(true);
            }
        }

        if(mouseJoint) {

            if(isMouseDown) {
                mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
            }
            else {
                world.DestroyJoint(mouseJoint);
                mouseJoint = null;
            }
        }

        world.Step(1/60,10,10);
        world.ClearForces();

        if(debugMode) world.DrawDebugData();

        for(var b = world.m_bodyList; b != null; b = b.m_next) {

            if(b.GetUserData()) {

                var element = b.GetUserData();
                element.style.left = b.GetPosition().x * worldScale - (element.clientWidth >> 1) + "px";
                element.style.top = b.GetPosition().y * worldScale - (element.clientHeight >> 1) + "px";

                var rotateStyle = "rotate(" + (b.GetAngle() * 57.2957795) + "deg)";

                element.style.WebkitTransform = rotateStyle + " translateZ(0)";
                element.style.MozTransform = rotateStyle + " translateZ(0)"
                element.style.msTransform = rotateStyle + " translateZ(0)"
                element.style.OTransform = rotateStyle + " translateZ(0)"
                element.style.transform = rotateStyle + " translateZ(0)"

                //console.log("[" + b.length + "] " + "b.GetPosition().x => " + b.GetPosition().x + " / b.GetPosition().y => " + b.GetPosition().y + " / b.GetAngle() => " + b.GetAngle());
            }
        }
    };

    function loopAnimationFrame() {

        update();
        window.renderAnimationFrame(loopAnimationFrame);
    }

    ///////////////////////////////////////////////////
    //
    // 이벤트 핸들러 정의 영역
    //
    ///////////////////////////////////////////////////

    function mousemoveHandler(event) {

        mouseX = event.clientX / worldScale;
        mouseY = event.clientY / worldScale;
    }

    function keyupHandler(event) {

        if (parseInt(event.keyCode) == 13) {

            event.target.blur();
            search();
        }
    }

    ///////////////////////////////////////////////////
    //
    // 함수 호출 영역
    //
    ///////////////////////////////////////////////////

    init();
    createGroundBox2D();
    createSearchBox2D(298, 41);
    loopAnimationFrame();
    setDebugMode();
});
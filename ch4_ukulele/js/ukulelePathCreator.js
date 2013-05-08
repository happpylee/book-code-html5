window.addEventListener("load", function(event) {

    window.renderAnimationFrame = (function() {
        return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback) {
                window.setTimeout(callback, 1000/60);
            };
    })();

    yepnope([{
        load: "js/ukuleleSound.js",
        callback : function(url, result, key) {
            UkuleleSound.createAudioElement();
        }
    }, {
        load: "js/ukulelePath.js",
        callback: function(url, result, key) {
            var ukuleleImage = new Image();
            ukuleleImage.addEventListener("load", ukuleleImageLoadHandler, false);
            ukuleleImage.src = "res/image/ukulele.png";

            function ukuleleImageLoadHandler(event) {
                UkulelePath.drawUkuleleImage(ukuleleImage);
                UkulelePath.createBezierPath(1);
                UkulelePath.createBezierPath(2);
                UkulelePath.createBezierPath(3);
                UkulelePath.createBezierPath(4);

                (function animationLoop() {
                    UkulelePath.update(ukuleleImage);
                    renderAnimationFrame(animationLoop);
                })();
            }
        }
    }]);

}, false);
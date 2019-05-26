
init();
function init() {
    var oImg = $('img');
    var len = oImg.length;
    var deg = 360 / len;
    for (var i = 0; i < len; i++) {
        $(oImg[i]).css({
            transform: 'rotateY(' + i * deg + 'deg) translateZ(350px)',
            transition: 'transform 1s ' + (len - 1 - i) * 0.1 + 's'
        })
    }
    bindEvent();
}
function bindEvent() {
    var oWrap = $('.box');
    var body = $('body');
    var lastX, lastY, nowX, nowY, disx = 0, disy = 0;
    var roY = 0, roX = -10;
    var timer;
    body.on('mousedown', function (e) {
        var event = e || window.event;
        clearInterval(timer);
        lastX = event.clientX;
        // console.log(lastX);
        lastY = event.clientY;
        console.log(lastY);
        body.on('mousemove', function (e) {
            var event = e || window.event;
            nowX = event.clientX;
            nowY = event.clientY;
            disx = nowX - lastX;
            // console.log(disx);
            disy = nowY - lastY;
            roY += disx * 0.2;
            roX -= disy * 0.2;
            oWrap.css({
                'transform': 'rotateX(' + roX + 'deg) rotateY(' + roY + 'deg)',
                'cursor': 'move'
            });
            lastX = nowX;
            lastY = nowY;//每次将当前触发对象的点为变化的初始点，
        });
        body.on('mouseup', function () {
            body.off('mousemove')
            clearInterval(timer);
            console.log(disx);
            console.log(disy);
            timer = setInterval(function () {
                disx *= 0.98;
                disy *= 0.98;
                roY += disx * 0.2;
                roX -= disy * 0.2;
                oWrap.css({
                    'transform': 'rotateX(' + roX + 'deg) rotateY(' + roY + 'deg)',
                    'cursor': 'pointer'
                })
                if (Math.abs(disx) < 0.1 && Math.abs(disy) < 0.1) {
                    clearInterval(timer);
                }
            }, 20);
        });
        return false;//取消鼠标默认事件
    });
}

window.onload = function() {
    var coreSocialistValues = ["(´▽`)ﾉ ", "多多交流啊", "欢迎欢迎", "（づ￣3￣）づ╭❤～", "前端小白裙"]
      , index = Math.floor(Math.random() * coreSocialistValues.length);
    var heartText = "❤";
    var strType = 2; // 1-文字 2-心形图案
    var colorType = 'on'; // 是否随机颜色
    var defaultColor = '#484866'; // 默认颜色
    document.body.addEventListener('click', function(e) {
        if (e.target.tagName == 'A') {
            return;
        }
        var x = e.pageX
          , y = e.pageY
          , span = document.createElement('span')
          , curText = coreSocialistValues[index];
        if (colorType === 'on') {
            defaultColor = color();
        }
        span.textContent = strType === 1 ? curText : heartText;
        index = (index + 1) % coreSocialistValues.length;//取模循环
        span.style.cssText = ['z-index: 9999999; position: absolute; font-weight: bold; color: ' + defaultColor + '; top: ', y - 20, 'px; left: ', x, 'px;'].join('');
        document.body.appendChild(span);
        animate(span);
    });
    function animate(el) {//动画
        var i = 0
          , top = parseInt(el.style.top)
          , id = setInterval(frame, 16.7);
        function frame() {//帧
            if (i > 180) {
                clearInterval(id);
                el.parentNode.removeChild(el);
            } else {
                i += 2;
                el.style.top = top - i + 'px';
                el.style.opacity = (180 - i) / 180;
            }
        }
    }
    function color() { // 随机颜色
        var r = Math.floor(Math.random()*255);
        var g = Math.floor(Math.random()*255);
        var b = Math.floor(Math.random()*255);
        return 'rgba('+ r +','+ g +','+ b +', 0.8)';
    }
};
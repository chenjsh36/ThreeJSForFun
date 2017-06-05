var frameAnimation = {
    anims: (function() {

        /**
         * obj dom
         * width: 图片总宽度
         * steps：需要的帧数
         * eachime duration (秒)
         * times： 循环次数 0是无限循环
         */
        return function(obj, width, steps, eachtime, times, callback) {
            var runing = false;
            var handler = null;
            var step = 0;
            var time = 0;
            var speed = eachtime * 1000 / steps;
            var oneStepWidth = width / steps;
            var control;
            function _play() {
                if (step >= steps) {
                    step = 0;
                    time++;
                }
                if (times === 0 || time < times) {
                    obj.css('background-position', -oneStepWidth * step + 'px 0px');
                    step++;
                } else {
                    control.stop();
                    if (callback) {
                        callback();
                    }
                }
            }
            control = {
                start: function() {
                    if (!runing) {
                        runing = true;
                        step = time = 0;
                        handler = setInterval(_play, speed);
                    }
                    return this;
                },
                stop: function(restart) {
                    if (runing) {
                        runing = false;
                        if (handler) {
                            clearInterval(handler);
                            handler = null;
                        }
                        if (restart) {
                            obj.css('background-position', '0 0');
                            step = 0;
                            time = 0;
                        }
                    }
                },
                dispose: function() {
                    this.stop()
                }
            }

            return control;
        }
    })(window)
}

export default {
    frameAnimation
}

/*
example

script 
    // var anim;
    // console.log('mounted:', cartoon.frameAnimation);
    // anim = cartoon.frameAnimation.anims($('#cartoon'), 720, 6, 1, 0);
    // anim.start();
html
    <div id="cartoon">
    </div>
style
    #cartoon {
        position: relative;
        overflow: hidden;
        background-image: url('./../../imgs/ViewSentiment_sprite.png');
        background-repeat: no-repeat;
        height: 120px;
        width: 120px;
        // width: 720px;
        overflow: hidden;
        display: none;
    }
 */
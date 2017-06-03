var Bubbles = require('./canvas_catchfish_bubbles.js');
require('./canvas_catchfish_fish.js');

// 变量定义---------------------------------------------------
var bubble1,
    bubble2,
    bubble3
    ;

var scene,
    camera,
    renderer,
    stats,
    gui
    ;
var geometry,
    material,
    cube,
    line;

var ambientLight;
var loader;

var fish;
var fishActive;
var fishMixer;
var fishActiveMixer;
var ifFishActive = false;
var $fishHider = $('#fish-hider');
var $fishCatcher = $('#fish-catcher');
var $fishCatcherLeft = $('#fish-catcher-left');
var $fishCatcherRight = $('#fish-catcher-right');
var ifFishCatcherActive = false;
var ifFishCatch = false;
var fishStatus = 'swim'; // ['swim', 'catch', 'die'];
var fishBow;
var fishBowMixer;

// 鱼竿摇晃变量
var catcherTimeHandle;
var catcherPicList = [];
var catcherPicCur = 0;
var catcherReady = true;

// 船动画
var shipTimeHandle;
var shipPicCur = 9;
var shipPicList = [];
var $ship = $('#ship');

// GLTF 文件数据
var fishFile;
var fishActiveFile;
var fishBowFile;
var $fishCatcher2 = $('#fish-catcher2');

var clock = new THREE.Clock();
var canvasContainer = document.getElementById('webgl-container');

imgData = [];
// 变量定义---------------------------------------------------

// 函数定义-------------------------------------------
function init() {
    var size = 500,
        step = 50,
        geometry,
        i, j
        ;
    var scalePoint = 1;
    var animation;
    var animations;

    //- Stats 
    // stats = new Stats();
    // document.body.appendChild(stats.dom);

    //- 创建场景
    scene = new THREE.Scene();

    //- 创建相机
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    camera.position.z = -2000;
    camera.position.y = 100;
    camera.position.x = 0;
    camera.lookAt(scene.position);

    //- 渲染
    renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
    //- renderer.setClearColor( 0xffffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = 'webgl-container';
    
    canvasContainer.appendChild(renderer.domElement);

    //- 平面坐標系
    // var CoSystem = new THREEex.CoSystem(500, 50, 0x000000);
    // line = CoSystem.create();
    // scene.add(line);

    //- gltf 3d模型导入
    // 挣扎的鱼
    fishActive = fishActiveFile.scene;
    fishActive.position.set(0, 0, 0); 
    fishActive.position.set(0, 0, -280);
    fishActive.rotation.z = -Math.PI / 16;
    fishActive.scale.set(1, 1, 1);    
    animations = fishActiveFile.animations;
    if (animations && animations.length) {
        fishActiveMixer = new THREE.AnimationMixer(fishActive);
        for (i = 0; i < animations.length; i++) {
            animation = animations[i];
            fishActiveMixer.clipAction(animation).play();    
        }    
    }


    // 游动的鱼
    scalePoint = .9;
    fish = fishFile.scene;
    fish.position.set(0, 0, -280);
    fish.rotation.z = -Math.PI / 16;
    fish.scale.set(scalePoint, scalePoint, scalePoint);
    animations = fishFile.animations;
    if (animations && animations.length) {
        fishMixer = new THREE.AnimationMixer(fish);
        for (i = 0; i < animations.length; i++) {
            animation = animations[i];
            fishMixer.clipAction(animation).play();    
        }    
    }
    scene.add( fish );
    showSwimFish()

    // 托盘
    fishBow = fishBowFile.scene;
    fishBow.position.set(0, -400, 0);
    fishBow.rotation.x = -Math.PI / 16;
    fishBow.scale.set(scalePoint, scalePoint, scalePoint);
    animations = fishBowFile.animations;
    if (animations && animations.length) {
        fishBowMixer = new THREE.AnimationMixer(fishBow);
        for (i = 0; i < animations.length; i++) {
            animation = animations[i];
            fishBowMixer.clipAction(animation).play();
        }    
    }

    //- 环境灯
    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    //- 直射灯
    //- var directionalLight = new THREE.DirectionalLight( 0xdddddd );
    //- directionalLight.position.set( 0, 0, 1 ).normalize();
    //- scene.add( directionalLight );

    //- 点灯
    //- var light = new THREE.PointLight(0xFFFFFF);
    //- light.position.set(50000, 50000, 50000);
    //- scene.add(light);

    //- 绑定窗口大小，自适应
    var threeexResize = new THREEex.WindowResize(renderer, camera);

    //- threejs 的控制器
    // var controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.target = new THREE.Vector3(0,15,0);
    //- controls.maxPolarAngle = Math.PI / 2;
    //- controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)
    
    $fishHider.on('click', function() {
        $fishHider.hide();
        $fishCatcher.removeClass('ready');
        if (ifFishCatcherActive === true) return;
        ifFishCatcherActive = true;
        // http://api.jquery.com/animate/
        // $(".test").animate({ whyNotToUseANonExistingProperty: 100 }, {
        //     step: function(now,fx) {
        //         $(this).css('-webkit-transform',"translate3d(0px, " + now + "px, 0px)");
        //     },
        //     duration:'slow'
        // },'linear');

        $fishCatcher.animate({
            bottom: '0%',
        }, {
            step: function(now, fx) {
                var begin = 62;
                var end = 0;
                var percent = 1 - (-62 - now) / -62;
                var sub = 0.2 * percent;
                var cur = 1 + sub;
                $(this).css({
                    '-webkit-transform': 'translate(-50%, 0%) scale(' + cur + ', ' + cur + ')',
                    'transform': 'translate(-50%, 0%) scale(' + cur + ', ' + cur + ')'
                })
            },
            duration: 200,
            easing: 'linear',
            done: function() {
                // console.log('catch fish!!!');
                // $fishCatcher2.show();
                // $fishCatcher.hide();

                // 渔网到达鱼的位置开始摇晃
                fishStatus = 'catch';
                TWEEN.removeAll();
                var left = new TWEEN.Tween(fishActive.position)
                    .to({
                        x: -250
                    }, 200)
                var leftToMiddle = new TWEEN.Tween(fishActive.position)
                    .to({
                        x: 0
                    }, 500)
                var left2 = new TWEEN.Tween(fishActive.position)
                    .to({
                        x: -150
                    }, 300)
                var right2 = new TWEEN.Tween(fishActive.position)
                    .to({
                        x: 380
                    }, 300)
                var rightToMiddle = new TWEEN.Tween(fishActive.position)
                    .to({
                        x: 0
                    }, 500)
                var right = new TWEEN.Tween(fishActive.position)
                    .to({
                        x: 300
                    }, 800)
                // leftToMiddle.chain(left);
                // right.chain(leftToMiddle);
                // left.chain(leftToMiddle);
                // rightToMiddle.chain(left);
                // var circle = right.chain(rightToMiddle);
                right2.chain(rightToMiddle);
                left2.chain(right2);
                leftToMiddle.chain(left2);
                var circle = left.chain(leftToMiddle);
                circle.start();
                new TWEEN.Tween(this)
                    .to({}, 1000 * 2)
                    .onUpdate(function() {
                        render();
                    })
                    .start();
                // showCatcherShade();
                showCatcherShade2();
            }
        });
    })
}

function showSwimFish() {
    console.log('showSwimFish####!!');
    var curx = fish.position.x;
    var cury = fish.position.y;
    var top = new TWEEN.Tween({i: cury})
        .to({
            i: 40
        }, 1000)
        .delay(3000)
        // .onStart(function() {
        //     this.i = fish.position.y;
        //     console.log(this.i, fish.position.y);
        // })
        .onUpdate(function() {
            fish.position.y = this.i;
        })
        .easing(TWEEN.Easing.Exponential.InOut)
    var bottom = new TWEEN.Tween({i: cury})
        .to({
            i: -40
        }, 1000)
        .delay(3000)
        // .onStart(function() {
        //     this.i = fish.position.y;
        // })
        .onUpdate(function() {
            fish.position.y = this.i;
        })
        .easing(TWEEN.Easing.Exponential.InOut)
    var left = new TWEEN.Tween({i: curx})
        .to({
            i: -40
        }, 1000)
        .delay(3000)
        // .onStart(function() {
        //     this.i = fish.position.x;
        // })
        .onUpdate(function() {
            fish.position.x = this.i;
        })
        .easing(TWEEN.Easing.Exponential.InOut)
    var right = new TWEEN.Tween({i: curx})
        .to({
            i: 40
        }, 1000)
        .delay(3000)
        // .onStart(function() {
        //     this.i = fish.position.x;
        // })
        .onUpdate(function() {
            fish.position.x = this.i;
        })
        .easing(TWEEN.Easing.Exponential.InOut)
    var cartoon = [top, bottom, left, right];
    var random = Math.floor(Math.random() * 4 - .0001)
    var cart = cartoon[random];

    cart.onComplete(function() {
        showSwimFish();
    }).start()
}

function animate() {
    requestAnimationFrame(animate);
    var now = Date.now();

    if (fishStatus === 'catch') {
        fish && scene.remove(fish);
        fishActive && scene.add(fishActive);
        if (fishActiveMixer) {
            fishActiveMixer.update(clock.getDelta())
        }
    } else if (fishStatus === 'swim') {
        fishActive && scene.remove(fishActive);
        fish && scene.add(fish);
        if (fishMixer) {
            fishMixer.update(clock.getDelta())
        }
    } else if (fishStatus === 'die') {
        fishActive && scene.remove(fishActive);
        fish && scene.add(fish);

        fishBow && scene.add(fishBow);
    }

    if (fishBowMixer) {
        fishBowMixer.update(clock.getDelta());
    }

    TWEEN.update();

    camera.lookAt(scene.position);
    // stats.begin();
    render();
    // stats.end();
}

//- 循环体-渲染
function render() {
    renderer.render( scene, camera );
}

// 捕鱼结束 鱼竿下落 鱼掉下 托盘上升
function showCatcherEnd() {
    // 停止摇晃渔网
    // $fishCatcher.removeClass('rotate');
    // $fishCatcherLeft.removeClass('rotate');
    // $fishCatcherRight.removeClass('rotate');
    // 鱼状态改变
    // $fishCatcher.show();
    // $fishCatcher2.hide();
    fishStatus = 'die';
    TWEEN.removeAll();
    new TWEEN.Tween(fish.rotation)
        .to({
            x: Math.PI / 5
        }, 1000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    new TWEEN.Tween(fishBow.position)
        .to({
            y: -200 
        }, 1000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    new TWEEN.Tween(this)
        .to({}, 1000 * 2)
        .onUpdate(function() {
            render();
        })
        .start();
    // 气泡和背景鱼群消失
    $('#fishtank').animate({opacity: 0}, 300);
    $('#bubbles').animate({opacity: 0}, 300, function() {
        bubble1.stop();
    })
    $('#bubbles').animate({opacity: 0}, 300, function() {
        bubble2.stop();
    })
    $('#bubbles').animate({opacity: 0}, 300, function() {
        bubble3.stop();
    })
    $fishCatcher.animate({bottom: '-100%'}, 300, 'swing', function() {
        ifFishCatcherActive = false;
    })
}


// 加载图片
function preLoadImg(url) {
    var def = $.Deferred();
    var img = new Image();
    img.src = url;
    if (img.complete) {
        def.resolve({
            img: img,
            url: url
        })
    }
    img.onload = function() {
        def.resolve({
            img: img,
            url: url
        });
    }
    img.onerror = function() {
        def.resolve({
            img: null,
            url: url
        })
    }
    return def.promise();
}

// 加载单张图片
function loadImage(url, callback) { 
    var img = new Image(); //创建一个Image对象，实现图片的预下载 
    img.src = url; 
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
        callback.call(img); 
        return; // 直接返回，不用再处理onload事件 
    } 
    img.onload = function () { //图片下载完毕时异步调用callback函数。 
        callback.call(img);//将回调函数的this替换为Image对象 
    };
}

// 加载所有图片
function loadAllImage(imgList) {
    var defList = [];
    var i = 0;
    var len;
    var def = $.Deferred();
    for (i = 0, len = imgList.length; i < len; i++) {
        defList[i] = preLoadImg(imgList[i])
    }
    $.when.apply(this, defList)
    .then(function() {
        var retData = Array.prototype.slice.apply(arguments);
        def.resolve(retData);
    })
    return def.promise();
}

// 隐藏加载
function hideLoading() {
    $('#loading').hide();
}

// 3d模型def 加载
function loadGltf(url) {
    var def = $.Deferred();
    var loader = new THREE.GLTFLoader();
    loader.setCrossOrigin('https://ossgw.alicdn.com');
    loader.load(url, function(data) {
        def.resolve(data);
    })
    return def.promise();
}

// 加载所有3d模型
function loadAllGltf(list) {
    var defList = [];
    var i = 0;
    var len;
    var def = $.Deferred();
    for (i = 0, len = list.length; i < len; i++) {
        defList[i] = loadGltf(list[i])
    }
    $.when.apply(this, defList)
    .then(function() {
        var retData = Array.prototype.slice.apply(arguments);
        def.resolve(retData);
    })
    return def.promise();
}

// 加载两条鱼
function loadFishGltf() {
    var def = $.Deferred();
    // var fishurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/03807648cf70d99a7c1d3d634a2d4ea3.gltf';
    // var fishActiveurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/bb90ddfe2542267c142e892ab91f60ad.gltf';
    var fishurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/b6dd694e5a9945e4f7c16867e9909f3c.gltf';
    var fishActiveurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/645064d03c9be7cfa980c76886dbddba.gltf';
    var fishBowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/c5e934aae17373e927fe98aaf1f71767.gltf'

    $.when(loadGltf(fishurl), loadGltf(fishActiveurl), loadGltf(fishBowUrl))
    .then(function(fishData, fishActiveData, fishBowData) {
        fishFile = fishData;
        fishActiveFile = fishActiveData;
        fishBowFile = fishBowData;
        def.resolve([fishurl, fishActiveurl, fishBowUrl]);
    })
    return def.promise();
}

// 补零
function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
// 获取鱼竿摇摆的动画数组
function getFlyCatcherPicList() {
    var picPre = '/threejs/static/img/yuwang/';
    var picNum = 75;
    var i = 0;
    var retList = [];
    for (; i < picNum; i++) {
        retList.push(picPre + 'YW0' + prefixInteger(i, 3) + '.png')
    }
    return retList;
}

// 获取船的动画数组
function getFlyShipPicList() {
    var picPre = '/threejs/static/img/ship/';
    var picNum = 72;
    var i = 9;
    var retList = [];
    for (; i < picNum; i++) {
        retList.push(picPre + 'chuan0' + prefixInteger(i, 3) + '.png')
    }
    return retList;
}

// 鱼竿摇晃动画
function showCatcherShade() {
    var url = '';
    clearTimeout(catcherTimeHandle);
    if (catcherPicCur < catcherPicList.length) {
        url = 'url("' + catcherPicList[catcherPicCur] + '")';

        // console.log('showCatcherShade:', url);
        $fishCatcher2.css('background-image', url);
        // $fishCatcher2.css('background-size','cover');
        catcherPicCur++;
        catcherTimeHandle = setTimeout(showCatcherShade, 2000 / 76);
    } else {
        catcherPicCur = 0;
        showCatcherEnd();
    }
}

function showCatcherShade2() {
    // http://api.jquery.com/animate/
    // $(".test").animate({ whyNotToUseANonExistingProperty: 100 }, {
    //     step: function(now,fx) {
    //         $(this).css('-webkit-transform',"translate3d(0px, " + now + "px, 0px)");
    //     },
    //     duration:'slow'
    // },'linear');
    catcherRotate(25, 200, 'swing')
    .then(catcherRotate(0, 500, 'linear'))
    .then(catcherRotate(15, 300, 'linear'))
    .then(catcherRotate(-20, 300, 'linear'))
    .then(catcherRotate(0, 500, 'linear', showCatcherEnd));
}

function catcherRotate(deg, time, easing, cb) {
    var def = $.Deferred();
    $fishCatcher.animate({ asdfasdf: deg }, {
        step: function(now, fx) {

            $(this).css('-webkit-transform',"translate(-50%, 0%) scale(1, 1) rotateZ(" + now + "deg)");
            $(this).css('transform',"translate(-50%, 0%) scale(1, 1) rotateZ(" + now + "deg)");
        },
        duration: time,
        easing: easing,
        done: function() {
            if (cb) {
                cb();
            }
            def.resolve();
        }
    })
    return def.promise();
}



// 船动画

function showShipFly() {
    var url = '';
    clearTimeout(shipTimeHandle);
    if (shipPicCur < shipPicList.length) {
        url = 'url("' + shipPicList[shipPicCur] + '")';

        // console.log('showShipFly:', url);
        $ship.css('background-image', url);
        // $ship.css('background-size','cover');
        shipPicCur++;
        shipTimeHandle = setTimeout(showShipFly, 5000 / 72);
    } else {
        shipPicCur = 9;
        // showCatcherEnd();
    }
}
// 函数定义-------------------------------------------

// 执行--------------------------------------
var waitImgList = [
    // '/threejs/static/img/上下云透明',
    // '/threejs/static/img/canvas_ship.png',
    '/threejs/static/img/canvas_yuwang1.png',
    '/threejs/static/img/canvas_yuwang1.png',
    '/threejs/static/img/canvas_yuwang2.png',
    '/threejs/static/img/canvas_yuwang3.png',
    '/threejs/static/img/yuwang/YW0000.png',
    '/threejs/static/img/ship/chuan0045.png'
];
// catcherPicList = getFlyCatcherPicList();
// shipPicList = getFlyShipPicList();
loadAllImage(waitImgList.concat(catcherPicList, shipPicList))
.then(function(Imgdata) {
    imgData = Imgdata
    loadFishGltf()
    .then(function(gltfData) {
        hideLoading();
        main();
    })
})



function main() {
    var winsize = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    /* 气泡 */
    bubble1 = new Bubbles({
        canvasID: 'bubbles',
        sourcex: winsize.width / 3,
        sourcey: winsize.height - 30
    })
    bubble2 = new Bubbles({
        canvasID: 'bubbles2',
        sourcex: winsize.width -30,
        sourcey: winsize.height / 2
    })
    bubble3 = new Bubbles({
        canvasID: 'bubbles3',
        sourcex: 30,
        sourcey: winsize.height / 3
    })
    bubble1.start();
    bubble2.start();
    bubble3.start();
    /* 气泡 */
    // showShipFly();
    $ship.animate({left: '100%'}, 4000);
    init();
    animate();
}
// main();

// 执行--------------------------------------

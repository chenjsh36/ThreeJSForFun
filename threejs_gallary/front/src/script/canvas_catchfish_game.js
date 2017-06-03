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

// GLTF 文件数据
var fishFile;
var fishActiveFile;
var fishBowFile;

var clock = new THREE.Clock();
var canvasContainer = document.getElementById('webgl-container');
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
        if (ifFishCatcherActive === true) return;
        ifFishCatcherActive = true;
        $fishCatcher.animate({bottom: '0%'}, 300, 'swing', function() {
            // 渔网到达鱼的位置开始摇晃
            fishStatus = 'catch';
            $fishCatcher.addClass('rotate');
            $fishCatcherLeft.addClass('rotate');
            $fishCatcherRight.addClass('rotate');
            TWEEN.removeAll();
            var left = new TWEEN.Tween(fishActive.position)
                .to({
                    x: -300
                }, 300)
            var right = new TWEEN.Tween(fishActive.position)
                .to({
                    x: 300
                }, 300)
            var circle = right.chain(left);
            circle.repeat(6)
                .start();
            new TWEEN.Tween(this)
                .to({}, 1000 * 2)
                .onUpdate(function() {
                    render();
                })
                .start();
            // 一段时间后放下渔网 
            setTimeout(function() {
                // 停止摇晃渔网
                $fishCatcher.removeClass('rotate');
                $fishCatcherLeft.removeClass('rotate');
                $fishCatcherRight.removeClass('rotate');
                // 鱼状态改变
                fishStatus = 'die';
                TWEEN.removeAll();
                new TWEEN.Tween(fish.rotation)
                    .to({
                        x: Math.PI / 4
                    }, 1000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                new TWEEN.Tween(fishBow.position)
                    .to({
                        y:-310 
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
            }, 2000)
        });
    })
}

function animate() {
    requestAnimationFrame(animate);


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
    var fishurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/03807648cf70d99a7c1d3d634a2d4ea3.gltf';
    var fishActiveurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/bb90ddfe2542267c142e892ab91f60ad.gltf';
    var fishBowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/c5e934aae17373e927fe98aaf1f71767.gltf'

    $.when(loadGltf(fishurl), loadGltf(fishActiveurl), loadGltf(fishBowUrl))
    .then(function(fishData, fishActiveData, fishBowData) {
        fishFile = fishData;
        fishActiveFile = fishActiveData;
        fishBowFile = fishBowData;
        console.log('dont :', fishActiveFile);
        def.resolve([fishurl, fishActiveurl, fishBowUrl]);
    })
    return def.promise();
}
// 函数定义-------------------------------------------

// 执行--------------------------------------
var waitImgList = [
    '/threejs/static/img/canvas_ship.png',
    '/threejs/static/img/canvas_yuwang1.png',
    '/threejs/static/img/canvas_yuwang1.png',
    '/threejs/static/img/canvas_yuwang2.png',
    '/threejs/static/img/canvas_yuwang3.png'
];

loadAllImage(waitImgList)
.then(function(Imgdata) {
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

    init();
    animate();
}
// main();

// 执行--------------------------------------

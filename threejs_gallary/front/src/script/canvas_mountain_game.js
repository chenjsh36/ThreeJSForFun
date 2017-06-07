// 变量定义---------------------------------
var scene;
var camera;
var renderer;
var stats;

var geometry;
var material;
var line;
var ambientLight;
var loader;

var clock = new THREE.Clock();
var webglContainer = document.getElementById('webgl-container');

var moutain;

var hillFile;

var $water = $('#water');
var waterTimeHandle;
var waterPicList = [];
var waterPicCur = 0;

var $cloud = $('#cloud');
var cloudTimeHandle;
var cloudPicList = [];
var cloudPicCur = 0;

var $fadeCloud = $('#fade-cloud');

// 产品变量
var $productPage = $('#product-page');
var $product = $('#product-page .product');
var $caseShake = $('#product-page .case-shake');
var $caseOpen = $('#product-page .case-open');
var $buyBtn #= $('#product-page .buy-btn');
var shakeCaseAnim;
var openCaseAnim;

// 变量定义---------------------------------


// 函数定义---------------------------------
function init() {
    var scalePoint = 1;
    var animations;
    var animation;

    //- 创建场景
    scene = new THREE.Scene();

    //- 创建相机
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    // camera.rotation.x = -0.493910;
    // camera.rotation.y = -0.493910;
    // camera.rotation.z = -0.493910;
    camera.rotation.set(-0.3116907691414058, 0.7293874706950219, 0.21150227789637524);
    camera.position.x = 223.2268387034634;
    camera.position.y = 76.58923784916283;
    camera.position.z = 237.71245804860735;
    camera.lookAt(scene.position);

    //- 渲染
    renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = 'webgl-container';
    
    webglContainer.appendChild(renderer.domElement);

    // - 平面坐標系
    // var CoSystem = new THREEex.CoSystem(500, 50, 0x000000);
    // line = CoSystem.create();
    // scene.add(line);

    //- gltf 3d模型导入
    loader = new THREE.GLTFLoader();
    loader.setCrossOrigin('https://ossgw.alicdn.com');
    var shanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/51ff6704e19375613c3d4d3563348b7f.gltf';
    var grassurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/5e6c2c4bb052ef7562b52654c5635127.gltf'
    var bburl = 'https://ossgw.alicdn.com/tmall-c3/tmx/7554d11d494d79413fc665e9ef140aa6.gltf'
    var cowurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/2f17ddef947a7b6c702af69ff0e5b95f.gltf'
    var doorurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/203247ec660952407695fdfaf45812af.gltf';
    var demourl = 'https://ossgw.alicdn.com/tmall-c3/tmx/25ed65d4e9684567962230671512f731.gltf'
    var lanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/1e1dfc4da8dfe2d7f14f23f0996c7feb.gltf'
    var daiurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/e68183de37ea4bed1787f6051b1d1f94.gltf'
    var douurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/0ca2926cbf4bc664ff00b03c1a5d1f66.gltf'
    var fishurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/03807648cf70d99a7c1d3d634a2d4ea3.gltf';
    var fishActiveurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/bb90ddfe2542267c142e892ab91f60ad.gltf';
    var fishBowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/c5e934aae17373e927fe98aaf1f71767.gltf'
    
    // shanurl
    // loader.load(shanurl, function(data) {
    //     var scalePoint = 1;
    //     var animations;
    //     var animation;

    //     gltf = data;
    //     moutain = gltf.scene;
    //     moutain.position.set(0, 0, 0);
    //     moutain.scale.set(scalePoint, scalePoint, scalePoint);
        
    //     moutain.rotation.y = -Math.PI / 4;
    //     scene.add(moutain);
    // })

    moutain = hillFile.scene;
    moutain.position.set(0, 0, 0);
    moutain.scale.set(scalePoint, scalePoint, scalePoint);
    moutain.rotation.y = -Math.PI / 4;
    scene.add(moutain);
    window.moutains = moutain;
    //- 环境灯
    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    //- 直射灯
    // var directionalLight = new THREE.DirectionalLight( 0xdddddd );
    // directionalLight.position.set( 0, 0, 1 ).normalize();
    // scene.add( directionalLight );

    // //- 点灯
    // var light = new THREE.PointLight(0xFFFFFF);
    // light.position.set(50000, 50000, 50000);
    // scene.add(light);

    //- 绑定窗口大小，自适应
    var threeexResize = new THREEex.WindowResize(renderer, camera);

    //- threejs 的控制器
    // var controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.target = new THREE.Vector3(0,15,0);
    //- controls.maxPolarAngle = Math.PI / 2;
    //- controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)

    initProduct();
}

function animate() {
    requestAnimationFrame(animate);
    // camera.lookAt(scene.position);
    // console.log(camera.rotation, camera.position);

    TWEEN.update();
    // stats.begin();
    render();
    // stats.end();
}

//- 循环体-渲染
function render() {
    renderer.render( scene, camera );
}

// 使用合并图播放瓶子飞出
function flyWater2() {
    var anim;
    var $water = $('#water');
    var waterH = $water.height();
    var waterW = $water.width();
    var waterBackW = 750 * waterH / 1220 * 26;
    console.log('waterH:', waterH, waterBackW);
    anim = frameAnimation.anims($('#water'), waterBackW, 26, 1, 1, function() {
        console.log('ok');
        endGame();
    });
    anim.start();
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

// 加载雪山
function loadHillGltf() {
    var def = $.Deferred();
    var shanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/51ff6704e19375613c3d4d3563348b7f.gltf';
    $.when(loadGltf(shanurl))
    .then(function(hillData) {
        hillFile = hillData;
        def.resolve([shanurl]);
    })
    return def.promise();
}

// 先缩小到被底部云遮盖
function scaleHill() {
    // $fadeCloud.addClass('scale');
    new TWEEN.Tween({scale: 1})
        .to({scale: .4}, 2000)
        .easing(TWEEN.Easing.Quartic.In)
        .onUpdate(function() {
            var s = this.scale;
            moutain.scale.set(s, s, s);
        })
        .onComplete(function() {
            // flyWater2();
            // becomeTag();
            scaleCloud();
        })
        .start();
}

// 再和云一起缩小到瓶口
function scaleCloud() {
    $fadeCloud.addClass('scale-to-mouth');
    new TWEEN.Tween({scale: .4})
        .to({scale: .10}, 1000)
        // .easing(TWEEN.Easing.Quartic.In)
        .onUpdate(function() {
            var s = this.scale;
            moutain.scale.set(s, s, s);
        })
        .onComplete(function() {
            $water.removeClass('crazy');
            flyWater2();
            // becomeTag();
            // scaleCloud();
            flyDown();
        })
        .start();
}
function flyDown() {
    // new TWEEN.Tween(moutain.position)
    //     .to({y: -100}, 1000)
    //     // .easing(TWEEN.Easing.Quartic.In)
    //     .onUpdate(function() {
    //     })
    //     .onComplete(function() {
    //         // $water.removeClass('crazy');
    //         // flyWater2();
    //         // becomeTag();
    //         // scaleCloud();
    //         // flyDown();
    //     })
    //     .start();
    $fadeCloud.removeClass('scale-to-mouth').addClass('fly-down');
    $(webglContainer).animate({
        notexit: 15
    }, {
        step: function(now, fx) {
            console.log('now:', now);
            $(this).css({
                '-webkit-transform': 'translate(0, ' + now + 'px)',
                'transform': 'translate(0, ' + now + 'px)',
                'opacity': '' + ((15 - now) / 15 * 100)
            })
        },
        duration: 1000,
        easing: 'linear',
        done: function() {
        }
    })
}

function endGame() {
    $water.addClass('scale');
    setTimeout(function() {
        showProduct(1000);
        $water.animate({
            opacity: 0
        }, 1000, function(){
            $water.css({
                display: 'none'
            })
        });
    }, 1000);
}

function becomeTag() {
    $(webglContainer).fadeOut();
    $fadeCloud.fadeOut();
}


// 产品函数
function initProduct() {
    var winSize = {
        width: $(window).width(),
        height: $(window).height()
    };

    var buyBtnW = winSize.width * .4;
    var buyBtnH = 84 * buyBtnW / 346;
    var buyBtnBottom = 50;
    $buyBtn.css({
        height: buyBtnH + 'px',
        width: buyBtnW + 'px',
        bottom: buyBtnBottom + 'px',
        'margin-left': (-buyBtnW / 2) + 'px'
    })

    var caseW = winSize.width * .8;
    var caseH = 638 * caseW / 640;
    var caseBottom = buyBtnBottom + buyBtnH + 50;
    $caseShake.css({
        height: caseH + 'px',
        width: caseW + 'px',
        'margin-left': (-caseW / 2) + 'px',
        bottom: caseBottom + 'px'
    })
    $caseOpen.css({
        height: caseH + 'px',
        width: caseW + 'px',
        'margin-left': (-caseW / 2) + 'px',
        bottom: caseBottom + 'px'
    })
}

function showProduct(duration) {
    shakeCase();
    $productPage.fadeIn(duration);
    $caseShake.one('click', function() {
        openCase();
    })
}

function shakeCase() {
    var steps = 15;
    var width = $caseShake.width();
    var backW = width * steps;
    var duration = .5
    shakeCaseAnim = frameAnimation.anims($caseShake, backW, steps, duration, 0);
    shakeCaseAnim.start();
}
function openCase() {
    var steps = 12;
    var width = $caseOpen.width();
    var backW = width * steps;
    var duration = 1;
    shakeCaseAnim.stop();
    $caseShake.hide();
    $caseOpen.show();
    console.log('openCase:', width, backW, steps);
    openCaseAnim = frameAnimation.anims($caseOpen, backW, steps, duration, 1);
    openCaseAnim.start();
}
// 函数定义---------------------------------

// 开始-----------------------
var imgList = ['/threejs/static/img/上下云透明.png'];
// cloudPicList = getFlyCloudPicList();
// waterPicList = getFlyWaterPicList();

loadAllImage(imgList)
.then(function(imgData) {
    loadHillGltf()
    .then(function(gltfdata) {
        hideLoading();
        main();        
    })
})

function main() {
    $water.one('click', function() {
        // $(webglContainer).hide();
        // $('#fade-cloud').hide();
        $water.removeClass('ready');
        $water.animate({
            'top': '0%'
        }, 400, function() {
            
            $water.addClass('crazy');
            console.log('scale');
            // flyCloud();
            scaleHill();
        })
    })
    init();
    animate();    
}

// 开始-----------------------
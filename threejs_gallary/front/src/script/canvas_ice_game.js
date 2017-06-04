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

var door;
var doorMixer;


var doorBorder;
var doorContent;
var axis1;
var axis2;
var band;
var basket;
var runDoorCount = 0;

var ice;
var runIceCount = 0;
var nuts = [
    {
        mesh: undefined,
        x: -1000,
        y: 20,
        z: -60,
        rx: Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .05
    }, {
        mesh: undefined,
        x: -1000,
        y: 80,
        z: -100,
        rx: Math.PI / 2,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .07
    }, {
        mesh: undefined,
        x: -1000,
        y: 80,
        z: 50,
        rx: -Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .05
    }, {
        mesh: undefined,
        x: -1000,
        y: 80,
        z: 100,
        rx: -Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .05
    }, {
        mesh: undefined,
        x: -1000,
        y: 10,
        z: 70,
        rx: -Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .07
    }
]
var exitNutNum = nuts.length;
console.log('nuts ', nuts);
window.nuts = nuts;

// 变量定义---------------------------------


// 函数定义---------------------------------
// 补零
function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

// 加载图片
function preLoad(url) {
    var def = $.Deferred();

    return def.promise();
}
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

function init() {

    //- 创建场景
    scene = new THREE.Scene();

    //- 创建相机
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    // camera.rotation.x = -0.493910;
    // camera.rotation.y = -0.493910;
    // camera.rotation.z = -0.493910;
    // camera.rotation.set(-0.3116907691414058, 0.7293874706950219, 0.21150227789637524);
    camera.position.set(-1300, 300, 0);
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

    axi2 = new THREE.Object3D();
    scene.add(axi2);

    //- gltf 3d模型导入
    loader = new THREE.GLTFLoader();
    loader.setCrossOrigin('https://ossgw.alicdn.com');
    var shanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/51ff6704e19375613c3d4d3563348b7f.gltf';
    var grassurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/5e6c2c4bb052ef7562b52654c5635127.gltf'
    var bburl = 'https://ossgw.alicdn.com/tmall-c3/tmx/7554d11d494d79413fc665e9ef140aa6.gltf'
    var cowurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/2f17ddef947a7b6c702af69ff0e5b95f.gltf'
    var doorurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/203247ec660952407695fdfaf45812af.gltf';
    var doorShadeUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/203247ec660952407695fdfaf45812af.gltf';
    var demourl = 'https://ossgw.alicdn.com/tmall-c3/tmx/25ed65d4e9684567962230671512f731.gltf'
    var lanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/1e1dfc4da8dfe2d7f14f23f0996c7feb.gltf'
    var daiurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/e68183de37ea4bed1787f6051b1d1f94.gltf'
    var douurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/0ca2926cbf4bc664ff00b03c1a5d1f66.gltf'
    var fishurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/03807648cf70d99a7c1d3d634a2d4ea3.gltf';
    var fishActiveurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/bb90ddfe2542267c142e892ab91f60ad.gltf';
    var fishBowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/c5e934aae17373e927fe98aaf1f71767.gltf';
    var doorBorderUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/c4e339e56660a4e457834c46ac4b053e.gltf';
    var doorContentUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/d3c2877b7132cfa556dd6826df97997d.gltf';
    var iceUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/7554d11d494d79413fc665e9ef140aa6.gltf';
    // shanurl
    // loader.load(doorurl, function(data) {
    //     var scalePoint = 1;
    //     var animations;
    //     var animation;

    //     gltf = data;
    //     door = gltf.scene;
    //     door.position.set(0, 420, 0);
    //     door.scale.set(scalePoint, scalePoint, scalePoint);

    //     // door.rotation.y = -Math.PI / 4;
    //     animations = data.animations;
    //     if (animations && animations.length) {
    //         doorMixer = new THREE.AnimationMixer(door);
    //         for (var i = 0; i < animations.length; i++) {
    //             var animation = animations[i];
    //             doorMixer.clipAction(animation).play();  
    //         }
    //     }
    //     // window.gdoor = door;
    //     // window.gdoorMixer = doorMixer;
    //     // scene.add(door);
    // })

    loader.load(daiurl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        band = gltf.scene;
        band.position.set(550, 50, 0);
        band.rotation.y = Math.PI / 2;
        band.scale.set(scalePoint, scalePoint, scalePoint);
        axi2.add(band);
        // scene.add(band);
    })

    loader.load(lanurl, function(data) {
        
        var scalePoint = .3;
        var animations;
        var animation;

        gltf = data;
        basket = gltf.scene;
        basket.position.set(230, 125, 0);
        basket.rotation.y = Math.PI / 2;
        basket.scale.set(scalePoint, scalePoint, scalePoint);
        axi2.add(basket);
        // scene.add(basket);
    })

    loader.load(douurl, function(data) {
        var scalePoint = 1;

        gltf = data;
        geometry = gltf.scene;
        geometry.position.set(400, 0, 0);
        geometry.scale.set(scalePoint, scalePoint, scalePoint);

        for (var i = nuts.length - 1; i >= 0; i--) {
            nuts[i].mesh = geometry.clone();
            nuts[i].mesh.rotation.x = nuts[i].rx;
            nuts[i].mesh.rotation.y = nuts[i].ry;
            nuts[i].mesh.rotation.z = nuts[i].rz;
            nuts[i].mesh.position.set(nuts[i].x, nuts[i].y, nuts[i].z);

            // nuts[i].mesh.rotation.set(nuts[i].rx, nuts[i].ry, nuts[i].rz);
            nuts[i].mesh.scale.set(nuts[i].scalePoint, nuts[i].scalePoint, nuts[i].scalePoint);
            console.log('scene');
            scene.add(nuts[i].mesh);
        }

    })

    // 门框
    loader.load(doorBorderUrl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        doorBorder = gltf.scene;
        doorBorder.position.set(0, 420, 0);
        doorBorder.scale.set(scalePoint, scalePoint, scalePoint);

        scene.add(doorBorder);
    })
    // 门内容
    loader.load(doorContentUrl, function(data) {
        var scalePoint = .9;
        var animations;
        var animation;

        gltf = data;
        doorContent = gltf.scene;
        doorContent.scale.set(scalePoint, scalePoint, scalePoint);
        // doorContent.add( new THREE.AxisHelper(200) );
        axis1 = new THREE.Object3D();
        axis1.position.z = -170;
        axis1.position.x = -20;
        axis1.rotation.y = -Math.PI / 4;
        scene.add(axis1);
        // axis1.add(new THREE.AxisHelper(500));

        axis1.add(doorContent);
        window.axis1 = axis1;
        doorContent.position.x = 120;
        doorContent.position.z = 120;
        doorContent.position.y = 420;
        doorContent.rotation.y = Math.PI / 4;

        // openDoor();
        // runDoor();
    })

    // 雪糕
    loader.load(iceUrl, function(data) {
        var scalePoint = .5;
        var animations;
        var animation;

        gltf = data;
        ice = gltf.scene;
        ice.position.set(200, 320, 0);
        ice.scale.set(scalePoint, scalePoint, scalePoint);

        // scene.add(ice);
    })

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

    setTimeout(function() {
        openDoor()
        .then(showBand)
        .then(bindNuts)
    }, 2000);
}

// 绑定事件
function bindNuts() {
    $('#nuts .nut').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var index = $(this).attr('data-index');
        throwNuts(nuts[index].mesh);
        $(this).hide();

    })    
}

// 打开门
function openDoor() {
    var def = $.Deferred();
    console.log('openDoor');
    window.doorContent = doorContent;

    new TWEEN.Tween(axis1.rotation)
        .to({y: -Math.PI / 4 * 5}, 2000)
        .onUpdate(function() {
            // console.log('update:', this.y);
            render();
        })
        .onComplete(function() {
            def.resolve();
        })
        .start();

    return def.promise();
}

function runDoor() {
    // TWEEN.removeAll();
    axis1.position.z = 0; // -170;
    axis1.position.x = 0; // -20;
    axis1.rotation.y = 0;// -Math.PI / 4;
    doorContent.position.x = 0; // 120;
    doorContent.position.z = 0; // 120;
    doorContent.position.y = 420; // 420;
    doorContent.rotation.y = 0; // Math.PI / 4;
    var tmpDeg = Math.PI / 6;
    var rotateR = new TWEEN.Tween({deg: 0})
        .to({deg: tmpDeg}, 300)
        .onUpdate(function() {
            doorBorder.rotation.x = this.deg;
            doorContent.rotation.x = this.deg;
        })
    var rotateRBack = new TWEEN.Tween({deg: tmpDeg})
        .to({deg: 0}, 300)
        .onUpdate(function() {
            doorBorder.rotation.x = this.deg;
            doorContent.rotation.x = this.deg;
        })
    var rotateL = new TWEEN.Tween({deg: 0})
        .to({deg: -tmpDeg}, 300)
        .onUpdate(function() {
            doorBorder.rotation.x = this.deg;
            doorContent.rotation.x = this.deg;
        })
    var rotateLBack = new TWEEN.Tween({deg: -tmpDeg})
        .to({deg: 0}, 300)
        .onUpdate(function() {
            doorBorder.rotation.x = this.deg;
            doorContent.rotation.x = this.deg;
        })
        .onComplete(function() {
            console.log('complete', runDoorCount);
            runDoorCount++;
            if (runDoorCount < 3) {
                console.log('less than 3', runDoorCount, runDoor);
                runDoor();
            } else {
                axis1.position.z = -170;
                axis1.position.x = -20;
                axis1.rotation.y = -Math.PI / 4;
                doorContent.position.x = 120;
                doorContent.position.z = 120;
                doorContent.position.y = 420;
                doorContent.rotation.y = Math.PI / 4;
                console.log('more than 3', runDoorCount);
                runDoorCount = 0;
                openAndShowIce();
            }
        })

    rotateL.chain(rotateLBack);
    rotateRBack.chain(rotateL);
    rotateR.chain(rotateRBack);
    rotateR.start();
}

function closeDoor() {
    var def = $.Deferred();
    // TWEEN.removeAll();

    new TWEEN.Tween(axis1.rotation)
        .to({y: -Math.PI / 4}, 2000)
        .onUpdate(function() {
            // console.log('update:', this.y);
            render();
        })
        .onComplete(function() {
            def.resolve()
        })
        .start();
    return def.promise();
}

// 输出传送带
function showBand() {
    var def = $.Deferred();
    var tmpDeg = -1000
    var rotateR = new TWEEN.Tween({deg: 0})
        .to({deg: tmpDeg}, 300)
        .onUpdate(function() {
            axi2.position.x = this.deg;
        })
        .onComplete(function() {
            def.resolve();
        })
        .start();
    return def.promise();
}
function hideBand() {
    var def = $.Deferred();
    var tmpDeg = -1000
    var rotateR = new TWEEN.Tween({deg: tmpDeg})
        .to({deg: 0}, 300)
        .onUpdate(function() {
            axi2.position.x = this.deg;
        })
        .onComplete(function() {
            def.resolve();
        })
        .start();
    return def.promise();
}
function addIce() {
    var def = $.Deferred();
    scene.add(ice);
    def.resolve();
    return def.promise();
}
function showIce() {
    // x轴位移
    console.log('showIce');
    var tmpx = -400;
    new TWEEN.Tween(ice.position)
        .to({x: tmpx}, 2000)
        .start();

    // x轴旋转
    var tmpDeg = Math.PI / 6;
    var rotateR = new TWEEN.Tween({deg: 0})
        .to({deg: tmpDeg}, 500)
        .onUpdate(function() {
            ice.rotation.x = this.deg;
        })
    var rotateRBack = new TWEEN.Tween({deg: tmpDeg})
        .to({deg: 0}, 500)
        .onUpdate(function() {
            ice.rotation.x = this.deg;
        })
    var rotateL = new TWEEN.Tween({deg: 0})
        .to({deg: -tmpDeg}, 500)
        .onUpdate(function() {
            ice.rotation.x = this.deg;
        })
    var rotateLBack = new TWEEN.Tween({deg: -tmpDeg})
        .to({deg: 0}, 500)
        .onUpdate(function() {
            ice.rotation.x = this.deg;
        })
        .onComplete(function() {
            // console.log('complete', runIceCount);
            // runIceCount++;
            // if (runIceCount < 3) {
            //     console.log('less than 3', runIceCount, runDoor);
            //     rotateR.start();
            // } else {
            //     runIceCount = 0;
            // }
        })

    rotateL.chain(rotateLBack);
    rotateRBack.chain(rotateL);
    rotateR.chain(rotateRBack);
    rotateR.start();
}

// 把豆扔到篮子里
function throwNuts(nut) {
    // axi2.add(nut);
    var tx = basket.position.x + (Math.random() * 20 - 10) + axi2.position.x;
    var ty = basket.position.y + (Math.random() * 20 - 10);
    var tz = basket.position.z + (Math.random() * 20 - 10);
    
    var toTopY = nut.position.y + 250;
    var toTop = new TWEEN.Tween(nut.position)
        .to({
            y: toTopY
        }, 500)

    var toEnd = new TWEEN.Tween({
        x: nut.position.x,
        y: toTopY,
        z: nut.position.z
        })
        .to({
            x: tx,
            y: ty,
            z: tz
        }, 500)
        .onUpdate(function() {
            nut.position.x = this.x;
            nut.position.y = this.y;
            nut.position.z = this.z;
        })
        .onComplete(function() {
            axi2.add(nut);
            nut.position.x -= axi2.position.x;
            exitNutNum--;
            // 如果没有可乐豆了
            if (exitNutNum <= 0) {
                makeIce();
            }
        })

    toTop.chain(toEnd)
        .start();
}

function removeBand() {
    scene.remove(axi2);
}

function makeIce() {
    hideBand()
    .then(closeDoor)
    .then(removeBand)
    .then(runDoor);
}

function openAndShowIce() {
    addIce()
    .then(openDoor)
    .then(showIce);
}

window.throwNuts = throwNuts;
window.showBand = showBand;
window.hideBand = hideBand;
window.showIce = showIce;
window.addIce = addIce;


function animate() {
    requestAnimationFrame(animate);
    camera.lookAt(scene.position);
    // console.log(camera.rotation, camera.position);

    // if (doorMixer) {
    //     doorMixer.update(clock.getDelta());
    // }

    TWEEN.update();
    // stats.begin();
    render();
    // stats.end();
}

//- 循环体-渲染
function render() {
    renderer.render( scene, camera );
}

// 瓶子飞出来
function flyWater() {
    var picPre = '/threejs/static/img/water/';
    var picNum = 26;
    var i = 0;
    waterPicList = [];
    for (; i < picNum; i++) {
        waterPicList.push(picPre + '合成 1_2_00' + prefixInteger(i, 3) + '.png')
    }
    console.log('waterPicList:', waterPicList);
    animateWaterPic();

}

// 播放瓶子成型动画
function animateWaterPic() {
    var url = '';
    clearTimeout(waterTimeHandle);
    if (waterPicCur < waterPicList.length) {
        url = 'url("' + waterPicList[waterPicCur] + '")';

        console.log('animateWaterPic:', url);
        $water.css('background-image', url);
        // $water.css('background-size','cover');
        waterPicCur++;
        waterTimeHandle = setTimeout(animateWaterPic, 1000 / 26);
    } else {
        waterPicCur = 0;
    }
}

// 吸云
function flyCloud () {
    var picPre = '/threejs/static/img/mountainyun/';
    var picNum = 53;
    var i = 0;
    cloudPicList = [];
    for (; i < picNum; i++) {
        cloudPicList.push(picPre + '吸云山_00' + prefixInteger(i, 3) + '.png')
    }
    console.log('cloudPicList:', cloudPicList);
    animateCloudPic();
}
// 播放吸云动画
function animateCloudPic() {
    var url = '';
    var len = cloudPicList.length;
    clearTimeout(cloudTimeHandle);
    if (cloudPicCur < len) {
        url = 'url("' + cloudPicList[cloudPicCur] + '")';

        console.log('animateCloudPic:', url);
        $cloud.css('background', url);
        $cloud.css('background-size','cover');
        cloudPicCur++;
        cloudTimeHandle = setTimeout(animateCloudPic, 5000 / len);
    } else {
        cloudPicCur = 0;
        flyWater();
    }
}
// 函数定义---------------------------------

// 开始-----------------------

init();
animate();
// 开始-----------------------
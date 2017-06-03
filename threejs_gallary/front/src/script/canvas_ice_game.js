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

var band;
var basket;

var ice;
var nuts = [
    {
        mesh: undefined,
        x: -1000,
        y: -100,
        z: -70,
        rx: Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .05
    }, {
        mesh: undefined,
        x: -1000,
        y: -30,
        z: -90,
        rx: Math.PI / 2,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .07
    }, {
        mesh: undefined,
        x: -1000,
        y: -30,
        z: 50,
        rx: -Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .05
    }, {
        mesh: undefined,
        x: -1000,
        y: -30,
        z: 100,
        rx: -Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .05
    }, {
        mesh: undefined,
        x: -1000,
        y: -100,
        z: 70,
        rx: -Math.PI / 4 * 5,
        ry: 0,
        rz: Math.PI / 2,
        scalePoint: .07
    }
]


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
    camera.position.set(-1300, 100, 0);
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
    var CoSystem = new THREEex.CoSystem(500, 50, 0x000000);
    line = CoSystem.create();
    scene.add(line);

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

    // shanurl
    loader.load(doorurl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        door = gltf.scene;
        door.position.set(0, 420, 0);
        door.scale.set(scalePoint, scalePoint, scalePoint);

        // door.rotation.y = -Math.PI / 4;
        animations = data.animations;
        if (animations && animations.length) {
            doorMixer = new THREE.AnimationMixer(door);
            for (var i = 0; i < animations.length; i++) {
                var animation = animations[i];
                doorMixer.clipAction(animation).play();  
            }
        }
        window.gdoor = door;
        window.gdoorMixer = doorMixer;
        // scene.add(door);
    })

    loader.load(daiurl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        band = gltf.scene;
        band.position.set(550, 50, 0);
        band.rotation.y = Math.PI / 2;
        band.scale.set(scalePoint, scalePoint, scalePoint);

        scene.add(band);
    })

    loader.load(lanurl, function(data) {
        
        var scalePoint = .3;
        var animations;
        var animation;

        gltf = data;
        basket = gltf.scene;
        basket.position.set(400, 125, 0);
        basket.rotation.y = Math.PI / 2;
        basket.scale.set(scalePoint, scalePoint, scalePoint);

        scene.add(basket);
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
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        doorContent = gltf.scene;
        doorContent.position.set(0, 420, 0);
        doorContent.scale.set(scalePoint, scalePoint, scalePoint);

        scene.add(doorContent);
        openDoor();
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
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target = new THREE.Vector3(0,15,0);
    //- controls.maxPolarAngle = Math.PI / 2;
    //- controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)
}

function openDoor() {
    console.log('openDoor');
    TWEEN.removeAll();
    new TWEEN.Tween(doorContent.rotation)
        .to({y: -Math.PI / 2}, 1000)
        .onUpdate(function() {
            console.log('update:', this.y);
            render();
        })
        .start();
}

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
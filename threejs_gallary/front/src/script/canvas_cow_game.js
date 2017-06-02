var scene;
var camera;
var renderer;
var stats;

var geometry;
var material;
var line;
var ambientLight;
var loader;

var cow;
var cowMixer;
var milk;
var grass;
var grassMixer;

var clock = new THREE.Clock();
var webglContainer = document.getElementById('webgl-container');

init();
animate();

function init() {

    //- 创建场景
    scene = new THREE.Scene();

    //- 创建相机
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    camera.position.z = -2000;
    camera.position.y = 0;
    camera.position.x = 0;
    camera.lookAt(scene.position);

    //- 渲染
    renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = 'webgl-container';
    
    webglContainer.appendChild(renderer.domElement);

    //- 平面坐標系
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
    var demourl = 'https://ossgw.alicdn.com/tmall-c3/tmx/25ed65d4e9684567962230671512f731.gltf'
    var lanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/1e1dfc4da8dfe2d7f14f23f0996c7feb.gltf'
    var daiurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/e68183de37ea4bed1787f6051b1d1f94.gltf'
    var douurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/0ca2926cbf4bc664ff00b03c1a5d1f66.gltf'
    var fishurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/03807648cf70d99a7c1d3d634a2d4ea3.gltf';
    var fishActiveurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/bb90ddfe2542267c142e892ab91f60ad.gltf';
    var fishBowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/c5e934aae17373e927fe98aaf1f71767.gltf'
    // 挣扎的鱼
    loader.load(cowurl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        cow = gltf.scene;
        cow.position.set(0, 230, 0); 
        // cow.position.set(0, 0, -240);
        // cow.rotation.z = -Math.PI / 16;

        cow.scale.set(scalePoint, scalePoint, scalePoint);
        
        animations = data.animations;
        if (animations && animations.length) {
            cowMixer = new THREE.AnimationMixer(cow);
            for (var i = 0; i < animations.length; i++) {
                var animation = animations[i];
                cowMixer.clipAction(animation).play();    
            }
        }
        scene.add(cow);
    })

    loader.load(grassurl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        grass = gltf.scene;
        grass.position.set(0, 120, 0); 

        grass.scale.set(scalePoint, scalePoint, scalePoint);
        
        // animations = data.animations;
        // if (animations && animations.length) {
        //     grassMixer = new THREE.AnimationMixer(grass);
        //     for (var i = 0; i < animations.length; i++) {
        //         var animation = animations[i];
        //         grassMixer.clipAction(animation).play();    
        //     }    
        // }
        scene.add(grass);
    })
    //- 环境灯
    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    //- 直射灯
    var directionalLight = new THREE.DirectionalLight( 0xdddddd );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );

    //- 点灯
    var light = new THREE.PointLight(0xFFFFFF);
    light.position.set(50000, 50000, 50000);
    scene.add(light);

    //- 绑定窗口大小，自适应
    var threeexResize = new THREEex.WindowResize(renderer, camera);

    //- threejs 的控制器
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target = new THREE.Vector3(0,15,0);
    //- controls.maxPolarAngle = Math.PI / 2;
    //- controls.addEventListener( 'change', function() { renderer.render(scene, camera); } ); // add this only if there is no animation loop (requestAnimationFrame)
    

}

function animate() {
    requestAnimationFrame(animate);
    camera.lookAt(scene.position);

    if (cowMixer) {
    	cowMixer.update(clock.getDelta());
    }

    TWEEN.update();
    // stats.begin();
    render();
    // stats.end();
}

//- 循环体-渲染
function render() {
    renderer.render( scene, camera );
}
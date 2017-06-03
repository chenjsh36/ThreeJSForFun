var Bubbles = require('./canvas_catchfish_bubbles.js');
require('./canvas_catchfish_fish.js');

/* 气泡 */
var winsize = {
    width: window.innerWidth,
    height: window.innerHeight
};
var bubble1 = new Bubbles({
    canvasID: 'bubbles',
    sourcex: winsize.width / 3,
    sourcey: winsize.height - 30
})
var bubble2 = new Bubbles({
    canvasID: 'bubbles2',
    sourcex: winsize.width -30,
    sourcey: winsize.height / 2
})
var bubble3 = new Bubbles({
    canvasID: 'bubbles3',
    sourcex: 30,
    sourcey: winsize.height / 3
})

bubble1.start();
bubble2.start();
bubble3.start();
/* 气泡 */

/* 3d 海鲜 */
;(function(){
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

    var clock = new THREE.Clock();
    var canvasContainer = document.getElementById('webgl-container');

    init();
    animate();

    function init() {
        var size = 500,
            step = 50,
            geometry,
            i, j
            ;
        
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
        
        // document.body.appendChild( renderer.domElement );
        canvasContainer.appendChild(renderer.domElement);

        //- 平面坐標系
        // var CoSystem = new THREEex.CoSystem(500, 50, 0x000000);
        // line = CoSystem.create();
        // scene.add(line);

        //- gltf 3d模型导入
        loader = new THREE.GLTFLoader();
        loader.setCrossOrigin('https://ossgw.alicdn.com');
        var shanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/51ff6704e19375613c3d4d3563348b7f.gltf';
        var caourl = 'https://ossgw.alicdn.com/tmall-c3/tmx/5e6c2c4bb052ef7562b52654c5635127.gltf'
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
        loader.load(fishActiveurl, function(data) {
            var scalePoint = 1;
            var animation;

            gltf = data;
            fishActive = gltf.scene;
            fishActive.position.set(0, 0, 0); 
            fishActive.position.set(0, 0, -280);
            fishActive.rotation.z = -Math.PI / 16;

            fishActive.scale.set(scalePoint, scalePoint, scalePoint);
            
            var animations = data.animations;
            if (animations && animations.length) {
                fishActiveMixer = new THREE.AnimationMixer(fishActive);
                for (var i = 0; i < animations.length; i++) {
                    var animation = animations[i];
                    fishActiveMixer.clipAction(animation).play();    
                }    
            }
        })
        // 游动的鱼
        loader.load(fishurl, function(data) {
            var scalePoint = 1;
            var animation;

            gltf = data;
            fish = data.scene;
            fish.position.set(0, 0, -280);
            fish.rotation.z = -Math.PI / 16;
            fish.scale.set(scalePoint, scalePoint, scalePoint);
            
            var animations = data.animations;
            if (animations && animations.length) {
                fishMixer = new THREE.AnimationMixer(fish);
                for (var i = 0; i < animations.length; i++) {
                    var animation = animations[i];
                    fishMixer.clipAction(animation).play();    
                }    
            }

            scene.add( fish );
        })
        // 托盘
        loader.load(fishBowUrl, function(data) {
            var scalePoint = 1;
            var animation;

            gltf = data;
            fishBow = data.scene;
            fishBow.position.set(0, -400, 0); 
            // fishBow.position.set(0, 0, -240);
            fishBow.rotation.x = -Math.PI / 16;

            fishBow.scale.set(scalePoint, scalePoint, scalePoint);
            
            var animations = data.animations;
            if (animations && animations.length) {
                fishBowMixer = new THREE.AnimationMixer(fishBow);
                for (var i = 0; i < animations.length; i++) {
                    var animation = animations[i];
                    fishBowMixer.clipAction(animation).play();
                }    
            }
        })

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
        // $fishCatcher.on('click', function() {
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
                    // .onUpdate(function() {
                    //     console.log('update camera position', this);
                    // })
                    // .start();
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
                    // console.log('fish position:', fish);
                    // new TWEEN.Tween(fish.position)
                    //     .to({
                    //         y: -100
                    //     }, 1000)
                    //     .easing(TWEEN.Easing.Exponential.InOut)
                    //     .start();

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
        camera.lookAt(scene.position);
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
                // console.log('fishMixer');
                fishMixer.update(clock.getDelta())
            }
        } else if (fishStatus === 'die') {
            fishActive && scene.remove(fishActive);
            fish && scene.add(fish);

            fishBow && scene.add(fishBow);
        }

        if (fishBowMixer) {
            // console.log('fishBowMixer', fishBowMixer);
            fishBowMixer.update(clock.getDelta());
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
})(window)
/* 3d 海鲜 */
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
var walkCow;
var walkCowMixer;
var cowStatus = "walkings"; // none standing walking
cowCur = "walking"; // standing
var milk;
var loopAnim;
var grass;
var grassMixer;
var grass2;
var grass3;
var grassList = [
    {
        mesh: undefined,
        x: 300,
        y: 120,
        z: -50
    }, {
        mesh: undefined,
        x: -160,
        y: 120,
        z: -300
    }, {
        mesh: undefined,
        x: 200,
        y: 120,
        z: -600
    }, {
        mesh: undefined,
        x: -400,
        y: 120,
        z: -1400
    },
]


var clock = new THREE.Clock();
var webglContainer = document.getElementById('webgl-container');

var $cowNaz = $('#cow-naz');
var milkBoxStatus = 0; // 装满级别 1 2 3
var milkBoxLoading = false;
var timeHandle;

init();
animate();

function init() {

    //- 创建场景
    scene = new THREE.Scene();

    //- 创建相机
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    camera.position.z = 550;
    camera.position.y = 380;
    camera.position.x = 30;
    // camera.lookAt(scene.position);

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
    // var walkCowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/3972247d3c4e96d1ac7e83a173e3a331.gltf'
    var walkCowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/95628df6d8a8dc3adc3c41b97ba2e49c.gltf';
    var cowurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/2f17ddef947a7b6c702af69ff0e5b95f.gltf';
    var doorurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/203247ec660952407695fdfaf45812af.gltf';
    var demourl = 'https://ossgw.alicdn.com/tmall-c3/tmx/25ed65d4e9684567962230671512f731.gltf'
    var lanurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/1e1dfc4da8dfe2d7f14f23f0996c7feb.gltf'
    var daiurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/e68183de37ea4bed1787f6051b1d1f94.gltf'
    var douurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/0ca2926cbf4bc664ff00b03c1a5d1f66.gltf'
    var fishurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/03807648cf70d99a7c1d3d634a2d4ea3.gltf';
    var fishActiveurl = 'https://ossgw.alicdn.com/tmall-c3/tmx/bb90ddfe2542267c142e892ab91f60ad.gltf';
    var fishBowUrl = 'https://ossgw.alicdn.com/tmall-c3/tmx/c5e934aae17373e927fe98aaf1f71767.gltf'
    
    // cow
    loader.load(cowurl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        cow = gltf.scene;
        cow.position.set(650, 240, 180); 
        // cow.position.set(0, 0, -240);
        cow.rotation.y = -Math.PI / 2;

        cow.scale.set(scalePoint, scalePoint, scalePoint);
        
        animations = data.animations;
        if (animations && animations.length) {
            cowMixer = new THREE.AnimationMixer(cow);
            for (var i = 0; i < animations.length; i++) {
                var animation = animations[i];
                cowMixer.clipAction(animation).play();    
            }
        }
        // scene.add(cow);
    })
    loader.load(walkCowUrl, function(data) {
        var scalePoint = 1;
        var animations;
        var animation;

        gltf = data;
        walkCow = gltf.scene;
        walkCow.position.set(650, 240, 180);
        walkCow.rotation.y = -Math.PI / 2;

        walkCow.scale.set(scalePoint, scalePoint, scalePoint);
        
        animations = data.animations;
        if (animations && animations.length) {
            walkCowMixer = new THREE.AnimationMixer(walkCow);
            for (var i = 0; i < animations.length; i++) {
                var animation = animations[i];
                walkCowMixer.clipAction(animation).play();    
            }
        }
        scene.add(walkCow);
        cowWalkIn();
    })
    loader.load(grassurl, function(data) {
        var scalePoint = .005;
        var animations;
        var animation;

        gltf = data;
        grass = gltf.scene;
        window.wgrass = grass;
        grass.scale.set(scalePoint, scalePoint, scalePoint);

        for (var i = grassList.length - 1; i >= 0; i--) {
            grassList[i].mesh = grass.clone();
            grassList[i].mesh.position.set(grassList[i].x, grassList[i].y, grassList[i].z)
            scene.add(grassList[i].mesh);
        }
        
        // 草从小变大
        new TWEEN.Tween({scalePoint: .01})
            .to({scalePoint: .4}, 2000)
            .onUpdate(function() {
                // console.log('scalePoint loop: ', this);
                var scalePoint = this.scalePoint;
                for (var i = grassList.length - 1; i >= 0; i--) {
                    grassList[i].mesh.scale.set(scalePoint, scalePoint, scalePoint);
                }
            })
            .start();

        new TWEEN.Tween(this)
            .to({}, 4000)
            .onUpdate(function() {
                render();
            })
            .start();
    })

    //- 环境灯
    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    //- 直射灯
    var directionalLight = new THREE.DirectionalLight( 0xdddddd );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );

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

    // 监听挤奶事件
    $cowNaz.on('click', function() {
        console.log('click naz', milkBoxLoading);
        if (milkBoxLoading === true) return;
        milkBoxLoading = true;
        milkBoxStatus++;
        // console.log('click milk', milkBoxStatus);
        // addMilk();
        addMilk2();
    })

    // 显示空白瓶子
    function showEmptyMilk() {
        var $milkBox = $('.milkbox');
        $milkBox.animate({
            bottom: '-140px'
        }, 2000);
    }
    // 显示挤奶那妞
    function showCowNaz() {
        $cowNaz.show();
    }
    // showCowNaz();
    // showEmptyMilk();
    function cowWalkIn() {
        cowStatus = 'walking';

        // 头部先进 最后到
        var headIn = new TWEEN.Tween(walkCow.position)
            .to({
                x: 320
            }, 6000)
            .delay(1000)
            // .easing(TWEEN.Easing.Exponential.InOut)
        
        var legIn = new TWEEN.Tween(walkCow.position)
            .to({
                x: -250
            }, 3500)
            .onComplete(function() {
                cowStatus = 'standing'
            })
            .delay(2000);
        var downCamera = new TWEEN.Tween(camera.position)
            .to({
                z: 540,
                y: 250,
                x: 0
            }, 1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onStart(function() {
                showEmptyMilk();
            })
            .onComplete(function() {
                showCowNaz()
            })
        legIn.chain(downCamera);
        headIn.chain(legIn);
        headIn.start();

        new TWEEN.Tween(this)
            .to({}, 4000 * 2)
            .onUpdate(function() {
                render();
            })
            .start();
    }

    // function showMilk() {
    //     // camera.position.z = -6000;
    //     var $milkBox = $('#milkbox');
    //     var $milkink = $('#milkink');
    //     var $milk = $("#milk");
    //     $milkBox.show();
    //     $milkink.show();

    //     var i = 2;
    //     var j = 2;
    //     var getMilk = function() {
    //         if (i<38) {
    //             url = 'url(/threejs/static/img/milk/milk'+i+'.png)';
    //            $milkBox.css('background',url);
    //            $milkBox.css('background-size','cover');
    //            i++;
    //        } else {
    //             clearInterval();
    //             $milkBox.hide();
    //             $milkink.hide();
    //             $(webglContainer).fadeOut(300);
    //             $milk.animate({'bottom': '250px'}, 600);
    //        }
    //        if (j<27) {
    //             url = 'url(/threejs/static/img/milkink/milkink'+j+'.png)';
    //            $milkink.css('background',url);
    //            $milkink.css('background-size','cover');
    //            j++;
    //        } else if(j<38) {
    //              url = 'url(/threejs/static/img/milkink/milkink'+(j-27)+'.png)';
    //            $milkink.css('background',url);
    //            $milkink.css('background-size','cover');                
    //        }
    //     };

    //     window.setInterval(getMilk, 200);
    // }

    // 合并图挤奶
    function addMilk2() {
        var anim;
        var milkID = '#milkbox' + milkBoxStatus;
        $('.milkbox').addClass('hide');
        $('' + milkID).removeClass('hide');
        if (loopAnim) {
            loopAnim.stop();
        }
        anim = frameAnimation.anims($('' + milkID), 5625, 25, 2, 1, function() {
            if (milkBoxStatus === 3) {
                $('.milkbox').hide();
                $('#milkink').hide();
                $cowNaz.hide();
                showJinDian();
            }
            if (milkBoxStatus !== 3) {
                loopMilk();
            }
            milkBoxLoading = false;
        });
        anim.start();
    }

    // 循环播放最后8帧
    function loopMilk() {
        var milkID = '#milkbox' + milkBoxStatus;
        if (loopAnim) {
            loopAnim.stop();
        }
        console.log('loopMilk:', milkID);
        loopAnim = frameAnimation.anims($('' + milkID), 5625, 25, 3, 0, function() {}, 18);
        loopAnim.start();
    }

    // function addMilk() {
    //     var $milkBox = $('#milkbox');
    //     var $milkink = $('#milkink');
    //     var $milk = $("#milk");
    //     $milkBox.show();
    //     $milkink.show();
    //     var i = (milkBoxStatus - 1) * 16 + 1;
    //     var j = 2;
    //     var maxi = milkBoxStatus * 16 + 1
    //     var getMilk = function() {
    //         // console.log('getMilk');
    //         if (i < maxi) {
    //             url = 'url(/threejs/static/img/milk/milk' + i + '.png)';
    //             $milkBox.css('background',url);
    //             $milkBox.css('background-size','cover');
    //             i++;
    //         } else {
    //             milkBoxLoading = false;
    //             $milkink.hide();
    //             clearInterval(timeHandle);
    //             if (milkBoxStatus === 3) {
    //                 $milkBox.hide();
    //                 $milkink.hide();
    //                 $cowNaz.hide();
    //                 showJinDian();
    //                 // $(webglContainer).fadeOut(300);
    //                 // $milk.animate({'bottom': '250px'}, 600);
    //             }
    //         }
    //         if (j < 27) {
    //             url = 'url(/threejs/static/img/milkink/milkink'+j+'.png)';
    //             $milkink.css('background',url);
    //             $milkink.css('background-size','cover');
    //             j++;
    //         } else if(j < 38) {
    //             url = 'url(/threejs/static/img/milkink/milkink'+(j-27)+'.png)';
    //             $milkink.css('background',url);
    //             $milkink.css('background-size', 'cover');                
    //         }
    //     };

    //     timeHandle = window.setInterval(getMilk, 200);
    // }

    function showJinDian() {
        TWEEN.removeAll();
        new TWEEN.Tween(camera.position)
            .to({
                z: 4000
            }, 4000)
            .onUpdate(function() {
                var op = 1 - this.z / 4000;
                $(webglContainer).css({opacity: op});
                render();
            })
            .onComplete(function() {
                var $milk = $("#milk");
                $(webglContainer).hide();
                $milk.animate({'bottom': '250px'}, 600);
            })
            .start();
    }

}

function animate() {
    requestAnimationFrame(animate);
    // camera.lookAt(scene.position);
    
    if (cowStatus === 'walking' && cowCur !== 'walking') {
        walkCow.position = cow.position;
        scene.add(walkCow);
        scene.remove(cow);
        cowCur = 'walking'
    }
    if (cowStatus === 'standing' && cowCur !== 'standing') {
        // console.log('walkCow.position:', walkCow.position, cow.position);
        cow.position = walkCow.position;
        cow.position.x = walkCow.position.x;
        cow.position.y = walkCow.position.y;
        cow.position.z = walkCow.position.z;
        scene.add(cow);
        scene.remove(walkCow);
        cowCur = 'standing';

        // console.log('walkCow.position:', walkCow.position, cow.position);
    }

    if (cowMixer && cowCur === 'standing') {
        cowMixer.update(clock.getDelta());
    }
    if (walkCowMixer && cowCur === 'walking') {
        walkCowMixer.update(clock.getDelta());
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

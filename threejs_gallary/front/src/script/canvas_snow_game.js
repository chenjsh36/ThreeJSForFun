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


var $iceContainer = $('#ice-container');
var $back12 = $('#back-1-2');
var $back2 = $('#back-2');
// 炸裂的可乐豆
var $nut = $('#nut');
// 下雪的云
var $cloud = $('#cloud');
// 结冰的冰棒
var $ice = $('#ice');
// 可乐豆和冰棒结合
var $nutIce = $('#nut-ice');

var winSize = {
	height: 0,
	width: 0
}
var cloudW;
var cloudH; 
var iceCtW;
var iceCtH;
var nutW;
var nutH;
var iceW;
var iceH;		
var nutIceW; // winSize.width * .35; //  * (413 / 577); // 最后一个数是淡化冰棒和形成冰棒的宽度比
var nutIceH;

var nutAnim;
var snowAnim;
var iceAnim;
var nutIceAnim;
var iceDuration = 4;
var nutIceDuration = 1;
// 变量定义---------------------------------

// 函数定义---------------------------------
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

// 初始化
function init() {
	winSize.height = $(window).height();
	winSize.width = $(window).width();
	console.log(winSize);

	// 初始化各个元素的宽度和高度
	cloudW = winSize.width * .6;
	cloudH = 763 * cloudW / 517; 
	$cloud.css({
		'width': cloudW + 'px',
		'height': cloudH + 'px',
		'left': -cloudW + 'px'
	})

	// 冰棒容器 (和形成的冰棒一样)
	iceCtW = winSize.width * .35;
	iceCtH = 577 * iceCtW / 346;
	$iceContainer.css({
		'width': iceCtW + 'px',
		'height': iceCtH + 'px',
		'margin-left': -iceCtW / 2 + 'px',
		'margin-top': -iceCtH / 2 + 'px'
	});

	// 可乐豆炸裂
	nutW = iceCtW;
	nutH = iceCtH;
	$nut.css({
		'width': nutW + 'px',
		'height': nutH + 'px'
	})

	// 形成的冰棒
	iceW = iceCtW;
	iceH = iceCtH;
	$ice.css({
		'width': iceW + 'px',
		'height': iceH + 'px'
	})

	// 淡化出来的冰棒
	nutIceW = iceCtW // winSize.width * .35; //  * (413 / 577); // 最后一个数是淡化冰棒和形成冰棒的宽度比
	nutIceH = 413 * nutIceW / 327;
	$nutIce.css({
		'width': nutIceW + 'px',
		'height': nutIceH + 'px',
	});

	brokeNut()
	.then(function() {
		bindNutEvent()
	}) 
}

function brokeNut() {
	var def = $.Deferred();
	def.resolve(); // 暂时
/*	var steps = 40; // ?
	var duration = 1; 
	var backW = nutW * steps;
	nutAnim = frameAnimation.anims($nut, backW, steps, duration, 1, function() {
		def.resolve();
	});
	nutAnim.start();*/
	return def.promise();
}

// 可乐豆爆炸后绑定事件
function bindNutEvent() {
	$nut.one('click', function() {
		fallSnow();
		cloudIn()
		.then(iceBecome)
		.then(iceFadeout)
		.then(function() {
			console.log('淡化完成');
		})
	})
}

// 云飞进来
function cloudIn() {
	var def = $.Deferred();
	var endLeft = winSize.width / 2 - cloudW / 2;
	var duration = 1000;
	console.log('endLeft:', endLeft, winSize.width, cloudW);
	$cloud.animate({
		'left': endLeft + 'px'
	}, 1000, 'linear', function() {
		def.resolve();
	})

	return def.promise();
}

// 开始谢雪
function fallSnow() {
	var steps= 29;
	var duration = 1;
	var backW = cloudW * steps
	snowAnim = frameAnimation.anims($cloud, backW, steps, duration, 0);
	snowAnim.start();
}

// 冰棒结冰
function iceBecome() {
	var def = $.Deferred();
	var steps = 40;
	var backW = iceW * steps;
	var backDuration = (iceDuration + nutIceDuration) * 1000;
	console.log('$back-1-2', $back12, backDuration);
	$back12.animate({opacity: 1}, backDuration);
	$back2.animate({opacity: 1}, backDuration);
	$nut.hide();
	$ice.show();
	iceAnim = frameAnimation.anims($ice, backW, steps, iceDuration, 1, function() {
		def.resolve();
	});
	iceAnim.start();
	return def.promise();
}

// 冰冰和豆豆结合
function iceFadeout() {
	var def = $.Deferred();
	var steps = 6;
	var backW = nutIceW * steps;
	$nutIce.show();
	cloudOut();
	nutIceAnim = frameAnimation.anims($nutIce, backW, steps, nutIceDuration, 1, function() {
		def.resolve();
	});
	nutIceAnim.start();
	return def.promise();
}
// 云飞走
function cloudOut() {
	var def = $.Deferred();
	var endLeft = winSize.width;
	var duration = 1000;
	$cloud.animate({
		'left': endLeft + 'px'
	}, 1000, 'linear', function() {
		def.resolve();
		stopFallSnow();
	})
	return def.promise();
}
// 停止下雪
function stopFallSnow() {
	snowAnim.stop();
}
// 函数定义---------------------------------



// 开始-----------------------
var imgList = [
    '/threejs/static/img/canvas_snow_back1_1.png',
    '/threejs/static/img/canvas_snow_back1_2.png',
    '/threejs/static/img/canvas_snow_back2.png',
    '/threejs/static/img/canvas_ice_snow.png',
    '/threejs/static/img/canvas_ice_fadeout.png',
    '/threejs/static/img/canvas_ice_become.png'
]

loadAllImage(imgList)
.then(function(imgData) {
	hideLoading();
	init();
})
// 开始-----------------------
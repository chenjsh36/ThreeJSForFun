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

// var clock = new THREE.Clock();
// var webglContainer = document.getElementById('webgl-container');


var $iceContainer = $('#ice-container');
var $back11 = $('#back-1-1');
var $back12 = $('#back-1-2');
var $back2 = $('#back-2');
// 炸裂的可乐豆
var $nut = $('#nut');
// 云容器
var $cloudContainer = $('#cloud-container');
var $onlyCloud = $('#only-cloud');
// 下雪的云
var $cloud = $('#cloud');
// 结冰的冰棒
var $ice = $('#ice');
// 可乐豆和冰棒结合
var $nutIce = $('#nut-ice');
var $product = $('#product-page');
var winSize = {
	height: 0,
	width: 0
}
var cloudCtW;
var cloudCtH;
var olCloudW;
var olCloudH;
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

// 产品变量
var $productPage = $('#product-page');
var $product = $('#product-page .product');
var $caseShake = $('#product-page .case-shake');
var $caseOpen = $('#product-page .case-open');
var $buyBtn = $('#product-page .buy-btn');
var shakeCaseAnim;
var openCaseAnim;
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
	cloudCtW = winSize.width * .6;
	$cloudContainer.css({
		'width': cloudCtW + 'px',
		'left': -cloudCtW + 'px'
	})

	olCloudW = cloudCtW;
	olCloudH = 231 * olCloudW / 502;
	$onlyCloud.css({
		'width': olCloudW + 'px',
		'height': olCloudH + 'px'
	})

	cloudW = cloudCtW; // winSize.width * .6;
	cloudH = 763 * cloudW / 517; 
	$cloud.css({
		'width': cloudW + 'px',
		'height': cloudH + 'px'
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
	nutH = 1220 * nutW / 750;
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

	initProduct();

	// brokeNut()
	// .then(function() {
	// 	bindNutEvent()
	// }) 
	bindNutEvent();
}


function brokeNut() {
	var def = $.Deferred();
	def.resolve(); // 暂时
	// var steps = 37; // ?
	// var duration = 1; 
	// var backW = nutW * steps;
	// nutAnim = frameAnimation.anims($nut, backW, steps, duration, 1, function() {
	// 	def.resolve();
	// });
	// nutAnim.start();
	return def.promise();
}

// 可乐豆爆炸后绑定事件
function bindNutEvent() {
	$nut.one('click', function() {
		$iceContainer.removeClass('fly');
		brokeNut()
		.then(cloudIn)		
		.then(iceBecome)
		.then(iceFadeout)
		.then(function() {
			endGame();
		})
	})
}

function endGame() {
	$iceContainer.addClass('scale');
	setTimeout(function() {
		showProduct(1000);
		$iceContainer.animate({
			opacity: 0
		}, 1000);
	}, 1000);
}
// 云飞进来
function cloudIn() {
	var def = $.Deferred();
	var endLeft = winSize.width / 2 - cloudCtW / 2;
	var duration = 1000;
	// console.log('endLeft:', endLeft, winSize.width, cloudW);
	$cloudContainer.animate({
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
	var backW = cloudW * steps;
	$cloud.fadeIn(500);
	snowAnim = frameAnimation.anims($cloud, backW, steps, duration, 0);
	snowAnim.start();
}

// 冰棒结冰
function iceBecome() {
	var def = $.Deferred();
	var steps = 40;
	var backW = iceW * steps;

	fallSnow();
	backFadeIn();

	$nut.hide();
	iceAnim = frameAnimation.anims($ice, backW, steps, iceDuration, 1, function() {
		$cloud.fadeOut(500);
		setTimeout(function() {
			def.resolve();
		}, 1000)
	});
	iceAnim.start();
	return def.promise();
}

function backFadeIn() {
	var backDuration = (iceDuration + nutIceDuration);
	
	$back11.animate({opacity: 1}, backDuration * 1000);
	setTimeout(function() {
		$back2.animate({opacity: 1}, (backDuration - iceDuration / 2) * 1000);
	}, iceDuration / 3 * 1000);
	setTimeout(function() {
		$back12.animate({opacity: 1}, (backDuration - iceDuration) * 1000);
	}, iceDuration * .8 * 1000)
}

// 冰冰和豆豆结合
function iceFadeout() {
	var def = $.Deferred();
	var steps = 6;
	var backW = nutIceW * steps;
	$nutIce.show();
	$back11.animate({opacity: 0}, 800);
	$back12.animate({opacity: 0}, 700);
	$back2.animate({opacity: 0}, 600);
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
	var endTop = cloudH;
	var duration = 1000;
	$cloudContainer.animate({
		'top': -cloudH + 'px'
	}, 500, 'linear', function() {
		def.resolve();
		// stopFallSnow();
	})
	return def.promise();
}
// 停止下雪
function stopFallSnow() {

	snowAnim.stop();
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
var imgList = [
	'/threejs/static/img/canvas_ice_broke2.png',
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
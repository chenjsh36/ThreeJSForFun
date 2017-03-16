var WindowResize = require('./lib/threeex.windowresize.js');

// var THREEex = THREEex || {};
// THREEex.WindowResize = WindowResize;

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.THREEex = factory();
    }
}(this, function(){
    var THREEex = THREEex || {};
    THREEex.WindowResize = WindowResize;

    return THREEex;
}))
var WindowResize = require('./lib/threeex.windowresize.js');
var CoSystem = require('./lib/threeex.cosystem.js');
var Planets = require('./lib/threeex.planet.js');

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
    THREEex.CoSystem = CoSystem;
    THREEex.Planets = Planets;
    return THREEex;
}))
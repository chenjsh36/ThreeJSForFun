;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Planets = factory();
    }
}(this, function(){
    var Planets = {};
    Planets.baseURL = '/threejs/static/module/threeex/'
    Planets.createEarth = function() {
        var geometry = new THREE.SphereGeometry(0.5, 32, 32);
        var material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(THREEex.Planets.baseURL+'img/earthmap1k_2.jpg'),
            bumpMap: new THREE.TextureLoader().load(THREEex.Planets.baseURL+'img/earthbump1k.jpg'),
            bumpScale: 0.02,
            specularMap: new THREE.TextureLoader().load(THREEex.Planets.baseURL+'img/earthspec1k.jpg'),
            specular: new THREE.Color('gray'),
        });
        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    return Planets;
}))
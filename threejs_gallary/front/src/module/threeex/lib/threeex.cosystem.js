;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CoSystem = factory();
    }
}(this, function(){
    /**
     * Create coordinate system
     * @param {number} size  size of the system
     * @param {number} step  interval of tick
     * @param {0x******} color 
     */
    var CoSystem = function(size, step, color) {
        this.size = size || 1000;
        this.step = step || 10;
        this.color = color || 0x000000;
        return this;
    };
    CoSystem.prototype.create = function() {
        var size = this.size,
            step = this.step,
            color = this.color
            ;
        var geometry = new THREE.Geometry(),
            material,
            line
            ;
        for (i = -size; i <= size; i += step) {
            if (i == 0) {
                geometry.vertices.push(new THREE.Vector3(-size - step, 0, i));
                geometry.vertices.push(new THREE.Vector3(size + step, 0, i));
                geometry.vertices.push(new THREE.Vector3(i, 0, -size - step));
                geometry.vertices.push(new THREE.Vector3(i, 0, size + step));
            } else {
                geometry.vertices.push(new THREE.Vector3(-size, 0, i));
                geometry.vertices.push(new THREE.Vector3(size, 0, i));
                geometry.vertices.push(new THREE.Vector3(i, 0, -size));
                geometry.vertices.push(new THREE.Vector3(i, 0, size));                
            }

        }
        material = new THREE.LineBasicMaterial({color: color, opacity: .9, linewidth: 1});
        line = new THREE.LineSegments(geometry, material);
        return line;
    }

    return CoSystem;

}))
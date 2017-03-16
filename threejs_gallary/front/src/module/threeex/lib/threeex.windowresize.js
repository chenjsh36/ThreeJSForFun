;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.WindowResize = factory();
    }
}(this, function(){
    var WindowResize = function(renderer, camera, dimesion) {
        dimesion = dimesion || function() { return { width: window.innerWidth, height: window.innerHeight }};

        var callback = function() {
            var renderSize = dimesion();
            renderer.setSize(renderSize.width, renderSize.height);

            camera.aspect = renderSize.width / renderSize.height;
            camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', callback, false);

        return {
            trigger: function() {
                callback();
            },
            destroy: function() {
                window.removeEventListener('resize', callback);
            }
        }
    }

    return WindowResize;
}))
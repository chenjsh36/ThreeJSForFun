(function(){
    var AABB = 0;
    var SPHERE = 1;
    var ACCELERATOR = 2;

    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var min = Math.min;
    var max = Math.max;
    var pi = Math.PI;
    var tau = 2*pi;

    var body_ids = 0;

    var extend = function(a, b){
        var result = {};
        for(var name in a){
            result[name] = a[name];
        }
        for(var name in b){
            result[name] = b[name];
        }
        return result;
    };

    var Class = function(obj){
        var constructor = obj.__init__ || function(){};

        if(obj.__extends__){
            var base = obj.__extends__.prototype;
        }
        else{
            var base = {};
        }

        constructor.prototype = extend(base, obj);
        return constructor;
    };
    
    var Events = Class({
        __init__: function(obj){
            this.listeners = {};
            this.obj = obj;
            this.has_listeners = false;
        },
        on: function(name, fun){
            this.has_listeners = true;
            var listeners = this.listeners[name] = this.listeners[name] || [];
            listeners.push(fun);
            return this;
        },
        trigger: function(name){
            if(!this.has_listeners) return;

            var listeners = this.listeners[name];
            if(!listeners) return;

            var l = listeners.length;
            if(!l) return;
            var obj = this.obj;
            for(var i=0, listener; listener=listeners[i++];){
                listener.apply(obj, arguments);
            }
            return this;
        },
    });

    var clamp = function(left, right, value){
        return value < left ? left : (value > right ? right : value);
    };

    var Accelerator = Class({
        type: ACCELERATOR,
        remove: function(){
            this.to_remove = true;
        },
    });

    var handleContact = function(b1, b2, depth, xn, yn, zn, restitute){
        var v1x = b1.x - b1.px;
        var v1y = b1.y - b1.py;
        var v1z = b1.z - b1.pz;
        var v2x = b2.x - b2.px;
        var v2y = b2.y - b2.py;
        var v2z = b2.z - b2.pz;

        var mt = b1.inv_mass + b2.inv_mass;
        var f1 = b1.inv_mass/mt;
        var f2 = b2.inv_mass/mt;

        var off1 = depth*f1;
        var off2 = depth*f2;

        b1.x += xn*off1;
        b1.y += yn*off1;
        b1.z += zn*off1;
        b2.x -= xn*off2;
        b2.y -= yn*off2;
        b2.z -= zn*off2;
                    
        if(restitute){
            var vrx = v1x - v2x;
            var vry = v1y - v2y;
            var vrz = v1z - v2z;

            var vdotn = vrx*xn + vry*yn + vrz*zn;
            var modified_velocity = vdotn/mt;

            var j1 = -(1+b2.restitution)*modified_velocity*b1.inv_mass;
            var j2 = -(1+b1.restitution)*modified_velocity*b2.inv_mass;

            v1x += j1 * xn
            v1y += j1 * yn
            v1z += j1 * zn

            v2x -= j2 * xn
            v2y -= j2 * yn
            v2z -= j2 * zn
            
            b1.setVelocity(v1x, v1y, v1z);
            b2.setVelocity(v2x, v2y, v2z);
        }
    };

    var by_left = function(b1, b2){
        return b1.left - b2.left;
    }

    var Body = Class({
        init: function(args){
            var params = extend({
                hardness: 1,
                restitution: 1,
                x: 0,
                y: 0,
                z: 0,
                density: 1,
            }, args);

            this.id = body_ids++;
            this.events = new Events(this);

            this.restitution = params.restitution;
            this.hardness = params.hardness;
            this.density = params.density;
            // __doc__ is this .mass==0 ok ? there is a param.mass || in the else
            if(params.mass == 0 || this.dynamic == false){
                this.mass = 0;
                this.inv_mass = 0;
            }
            else{
                this.mass = params.mass || this.computeMass();
                this.inv_mass = 1/this.mass;
            }

            this.ax = 0;
            this.ay = 0;
            this.az = 0;

            this.x = params.x;
            this.y = params.y;
            this.z = params.z;

            this.px = this.x;
            this.py = this.y;
            this.pz = this.z;
        },
        onContact: function(other){
            this.world.onContact(this, other);
            other.events.trigger('contact', this);
            this.events.trigger('contact', other);
        },
        remove: function(){
            this.to_remove = true;
        },
        computeMass: function(){
            return this.density;
        },
        setVelocity: function(x, y, z){
            this.px = this.x - x;
            this.py = this.y - y;
            this.pz = this.z - z;
        },
        getVelocity: function(){
            return [
                this.x - this.px,
                this.y - this.py,
                this.z - this.pz,
            ];
        },
        setPosition: function(x, y, z){ // __doc__ added this one
            var velocity    = this.getVelocity();
            this.x = x;
            this.y = y;
            this.z = z;
            this.setVelocity(velocity[0], velocity[1], velocity[2]);
        },
        getPosition: function(){
            var u = this.world.u;
            return [
                this.px + (this.x - this.px)*u,
                this.py + (this.y - this.py)*u,
                this.pz + (this.z - this.pz)*u,
            ]
        },
        separatingVelocity: function(other){
            var b1 = this, b2 = other;
                
            var x = b1.x - b2.x;
            var y = b1.y - b2.y;
            var z = b1.z - b2.z;
            var l = sqrt(x*x + y*y + z*z);
            var xn = x/l;
            var yn = y/l; 
            var zn = z/l;
            
            var v1  = b1.getVelocity();
            var v2  = b2.getVelocity();

            var vrx = v1[0] - v2[0];
            var vry = v1[1] - v2[1];
            var vrz = v1[2] - v2[2];

            var vdotn = vrx*xn + vry*yn + vrz*zn;
            var xs = vrx*vdotn;
            var ys = vry*vdotn;
            var zs = vrz*vdotn;
            var speed = sqrt(xs*xs + ys*ys + zs*zs);

            return speed;
        },
        collide: function(other, restitute){
            switch(other.type){
                case AABB:
                    this.collideAABB(other, restitute);
                    break;
                case SPHERE:
                    this.collideSphere(other, restitute);
                    break;
            }
        },
        collideAABB: function(){},
        collideSphere: function(){},
        momentum: function(){
            if(this.dynamic){
                var x=this.x, y=this.y, z=this.z;

                var xn = x*2 - this.px;
                var yn = y*2 - this.py;
                var zn = z*2 - this.pz;

                this.px = x;
                this.py = y;
                this.pz = z;

                this.x = xn;
                this.y = yn;
                this.z = zn;
            }
        },
        applyAcceleration: function(sdelta){
            if(this.dynamic){
                this.x += this.ax * sdelta;
                this.y += this.ay * sdelta;
                this.z += this.az * sdelta;
                this.ax = 0;
                this.ay = 0;
                this.az = 0;
            }
        },
        accelerate: function(x, y, z){
            if(this.dynamic){
                this.ax += x;
                this.ay += y;
                this.az += z;
            }
        },
    });

    vphy = {
        types: {
            AABB            : AABB,
            SPHERE          : SPHERE,
            ACCELERATOR     : ACCELERATOR,
        },
        // expose extend+Class in namespace
        extend      : extend,   // __doc__ added this
        Class       : Class,
        Accelerator : Accelerator,
        
        World: Class({
            __init__: function(){
                this.u = 0;
                this.bodies = [];
                this.accelerators = [];
                this.managed = [this.bodies, this.accelerators];
                this.events = new Events(this);
            },
            add: function(){
                for(var i=0; i<arguments.length; i++){
                    var obj = arguments[i];
                    obj.world = this;
                    if(obj.type == ACCELERATOR){
                        this.accelerators.push(obj);
                    }
                    else{
                        this.bodies.push(obj);
                    }
                }
                return this;
            },
            // added __doc__
            remove: function(obj){
                for(var i=0; i<arguments.length; i++){
                    var obj = arguments[i];
                    obj.remove();
                }
            },
            onContact: function(body1, body2){
                this.events.trigger('contact', body1, body2);
            },
            momentum: function(){
                for(var i=0, bodies=this.bodies, body; body=bodies[i++];){
                    body.momentum();
                }
            },
            applyAcceleration: function(delta){
                var sdelta = delta*delta;
                for(var i=0, bodies=this.bodies, body; body=bodies[i++];){
                    body.applyAcceleration(sdelta);
                }
            },
            collide: function(restitute){
                this.updateBoundingVolumes();
                var bodies = this.bodies;
                bodies.sort(by_left);
                var l = bodies.length;
                for(var i=0; i<l-1; i++){
                    var b1 = bodies[i];
                    for(var j=i+1; j<l; j++){
                        var b2 = bodies[j];
                        if(b1.dynamic || b2.dynamic){
                            if(b1.right > b2.left){
                                if(b1.back < b2.front && b1.front > b2.back && b1.bottom < b2.top && b1.top > b2.bottom){
                                    b1.collide(b2, restitute);
                                }
                            }
                            else{
                                break;
                            }
                        }
                    }
                }
            },
            getCollection: function(){
                var c = [];
                this.managed.push(c);
                return c;
            },
            cleanupCollection: function(c){
                for(var i=0; i<c.length; i++){
                    if(c[i].to_remove){
                        c.splice(i, 1);
                        i--;
                    }
                }
            },
            cleanup: function(){
                var managed = this.managed;
                var l = managed.length;
                for(var i=0; i<l; i++){
                    this.cleanupCollection(managed[i]);
                }
            },
            updateBoundingVolumes: function(){
                var bodies = this.bodies;
                for(var i=0, body; body=bodies[i++];){
                    body.updateBoundingVolume();
                }
            },
            onestep: function(delta){
                this.time += delta;
                this.accelerate(delta);     // __doc__ passing delta to accelerator.perform()
                this.applyAcceleration(delta);
                this.collide(false);
                this.momentum();
                this.collide(true);
                this.cleanup();
            },
            step: function(timestep, now){
                if(now - this.time > 0.25){
                    this.time = now - 0.25;
                }
                while(this.time < now){
                    this.onestep(timestep);
                }
                var diff = this.time - now;
                if(diff > 0){
                    this.u = (timestep - diff)/timestep;
                }
                else{
                    this.u = 1.0;
                }
            },
            start: function(time){
                this.time = time;
            },
            accelerate: function(delta){
                var bodies = this.bodies;
                var accelerators = this.accelerators;
                for(var i=0, accelerator; accelerator=accelerators[i++];){
                    accelerator.perform(bodies, delta); // __doc__ passing delta to perform() thus accelerator may accelerate independantly of delta 
                }
            },
        }),
        LinearAccelerator: Class({
            __extends__: Accelerator,
            __init__: function(direction){
                this.x = direction.x;
                this.y = direction.y;
                this.z = direction.z;
            },
            perform: function(bodies){
                var x=this.x, y=this.y, z=this.z;
                for(var i=0, body; body=bodies[i++];){
                    body.accelerate(x, y, z); 
                }
            },
        }),
        AABB: Class({
            type: AABB,
            dynamic: false,
            __extends__: Body,
            __init__: function(args){
                var params = extend({
                    width: 1, height: 1, depth: 1,
                }, args);
                this.width = params.width;
                this.height = params.height;
                this.depth = params.depth;
                this.init(params);
            },
            updateBoundingVolume: function(){
                var x=this.x, y=this.y, z=this.z;
                var width=this.width/2, height=this.height/2, depth=this.depth/2;

                this.left = x - width;
                this.right = x + width;
                
                this.top = y + height;
                this.bottom = y - height;
                
                this.front = z + depth;
                this.back = z - depth;

                return this;
            },
            collideSphere: function(b, restitute){
                var cx = clamp(this.left, this.right, b.x);
                var cy = clamp(this.bottom, this.top, b.y);
                var cz = clamp(this.back, this.front, b.z);

                var x = cx - b.x;
                var y = cy - b.y;
                var z = cz - b.z;
                var ls = x*x + y*y + z*z;
                if(ls == 0){
                    var x = this.z - b.x;
                    var y = this.y - b.y;
                    var z = this.z - b.z;
                    var ls = x*x + y*y + z*z;
                }
                if(ls == 0){
                    return;
                }

                var radius = b.radius;
                if(ls < radius*radius){
                    var l = sqrt(ls);
                    var xn = x/l;
                    var yn = y/l;
                    var zn = z/l;
                    handleContact(this, b, radius-l, xn, yn, zn, restitute);
                    this.onContact(b);
                }
            },
        }),
        Sphere: Class({
            type: SPHERE,
            dynamic: true,
            __extends__: Body,
            __init__: function(args){
                var params = extend({
                    radius: 1,
                }, args);
                this.radius = params.radius;
                this.init(params);
            },
            computeMass: function(){
                return (4/3)*pi*pow(this.radius, 3)*this.density;
            },
            collideAABB: function(other, restitute){
                other.collideSphere(this, restitute);
            },
            updateBoundingVolume: function(){
                var x=this.x, y=this.y, z=this.z;
                var radius = this.radius;

                this.left = x - radius;
                this.right = x + radius;
                
                this.top = y + radius;
                this.bottom = y - radius;
                
                this.front = z + radius;
                this.back = z - radius;
                return this;
            },
            collideSphere: function(b2, restitute){
                var b1 = this;

                var x = b1.x - b2.x;
                var y = b1.y - b2.y;
                var z = b1.z - b2.z;
                var ls = x*x + y*y + z*z;
                var target = b1.radius + b2.radius;
                        
                if(ls < target*target){
                    var l = sqrt(ls);
                    var xn=x/l, yn=y/l, zn=z/l;
                    handleContact(b1, b2, target-l, xn, yn, zn, restitute);
                    b1.onContact(b2);
                }
            },
        }),
    };
})();
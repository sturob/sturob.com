// (function () {

var h = window.innerHeight;
var w = window.innerWidth;
var canvas = document.getElementById('bg');
canvas.width = w;
canvas.height = h;
var context = canvas.getContext('2d');

context.globalCompositeOperation = 'lighten';

// replace with backbone + skip draw on no change
var inputs = {
	set: function(a, b) {
		this.a = this.aRanger(a);
		this.b = this.bRanger(b);
	},
	aRanger: curry(range, [0, w]),
	bRanger: curry(range, [0, h]),
	mouseX: 0,
	mouseY: 0
};

var dotSizeRange = [ 20, 200 ];

function Dot (scaleX, scaleY) {
	_.extend(this, {
		changeSizeBy: 0.004,
		size:0, scaleX:scaleX, scaleY:scaleY, x:0, y:0,
	})
	this.pxSize = 
		lerp(dotSizeRange[0], dotSizeRange[1], TWEEN.Easing.Elastic.In(this.size) );
	return this;
}
_.extend( Dot.prototype, {
	bumpSize: function() {
		if (this.size > 1) {
			this.changeSizeBy = -0.004;
		} else if (this.size < 0) {
			this.changeSizeBy = 0.004;
		}
		this.size += this.changeSizeBy;
		this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1], TWEEN.Easing.Quadratic.InOut(this.size) );
	},
	reposition: function(x, y) { // [0-1, 0-1]
		this.x = Math.round( this.scaleX(x) )
		this.y = Math.round( this.scaleY(y) )
	},
	savePosition: function(x, y) { // (0-1, 0-1)
		this.savedX = this.x;
		this.savedY = this.y;
		this.savedSize = this.size;
	},
	hasMoved: function(x, y) { // (0-1, 0-1) 
		return ! (this.savedX == this.x && this.savedY == this.y && this.savedSize == this.size);
	}
})


var dots = {
	
	r: new Dot( curry(lerp, [ w * 0.84, w * 0.90 ]),
	            curry(lerp, [ h * 0.80, h * 0.85 ])  ),
	g: new Dot( curry(lerp, [ w * 0.72, w * 0.92 ]),
	            curry(lerp, [ h * 0.80, h * 0.82 ])  ),
	b: new Dot( curry(lerp, [ w * 0.82, w * 0.90 ]),
	            curry(lerp, [ h * 0.80, h * 0.91 ])  ),

	collision: function() {
		return dots.near(dots.r, dots.g, dots.b)
	},
	update: function () {
		var x = inputs.a;
		var y = inputs.b;

		dots.r.reposition(x, y)
		dots.g.reposition(x, y)
		dots.b.reposition(x, y)
		
		if (dots.collision()) {
			dots.r.bumpSize()
			dots.g.bumpSize()
			dots.b.bumpSize()
		}
	},
	close: function(x1, x2) {
		return (x1 + 5 > x2) && (x1 < x2) ||
		       (x2 + 5 > x1) && (x2 < x1)
	},
	near: function(a, b, c) {
		return dots.close( a.x, b.x ) &&
		       dots.close( a.x, c.x ) &&
		       dots.close( a.y, b.y ) &&
		       dots.close( a.y, c.y )
	}
}



function draw() {
	if (dots.r.hasMoved() || dots.g.hasMoved() || dots.b.hasMoved()) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context
		  .prop({ fillStyle: '#fcc' }).circle(dots.r.x, dots.r.y, dots.r.pxSize).fill()
		  .prop({ fillStyle: '#cfc' }).circle(dots.g.x, dots.g.y, dots.g.pxSize).fill()
		  .prop({ fillStyle: '#ccf' }).circle(dots.b.x, dots.b.y, dots.b.pxSize).fill()
		dots.r.savePosition();
		dots.g.savePosition();
		dots.b.savePosition();
	}
}

function animate() {
	requestAnimationFrame( animate )
	draw()
}

animate()


// inputs

var receivingDeviceMovement = false;  // window.DeviceOrientationEvent lies

gyro.frequency = 1000/60;

function setupGyro() {
	gyro.startTracking( function (o) {
		if (! receivingDeviceMovement) {
			if (o.gamma) { // FIXME exact zero would fail
				inputs.aRanger = curry( range, [-20, 20] )
				inputs.bRanger = curry( range, [ 10, 40] )
				receivingDeviceMovement = true;
			} else if (o.y) {

			} else { // getting null values for motion - screw you guys...
				gyro.stopTracking()
			}
		}

		if (o.gamma) { // FIXME exact zero would fail
			inputs.set( o.gamma, o.beta );
		} else if (o.y) {
			// TODO accelerometer support
		}
	})
}

setTimeout( setupGyro, 50 ); // magic number to wait for the gyro to activate

window.onmousemove = function (ev) {
	inputs.mouseX = ev.clientX;
	inputs.mouseY = ev.clientY;
};

setInterval(function() {
	if (! receivingDeviceMovement) { // use mouse
		inputs.set( inputs.mouseX, inputs.mouseY );
	}
	dots.update();
}, 1000/60)


// libs

function range(min, max, value) {
	return (value - min) / (max - min)
}

function lerp(v0, v1, t) {
	return v0*(1-t)+v1*t
}

function curry(func,args,space) {
	var n  = func.length - args.length; //arguments still to come
	var sa = Array.prototype.slice.apply(args); // saved accumulator array
	function accumulator(moreArgs,sa,n) {
		var saPrev = sa.slice(0); // to reset
		var nPrev  = n; // to reset
		for(var i=0;i<moreArgs.length;i++,n--) {
			sa[sa.length] = moreArgs[i];
		}
		if ((n-moreArgs.length)<=0) {
			var res = func.apply(space,sa);
			// reset vars, so curried function can be applied to new params.
			sa = saPrev;
			n  = nPrev;
			return res;
		} else {
			return function (){
				// arguments are params, so closure bussiness is avoided.
				return accumulator(arguments,sa.slice(0),n);
			}
		}
	}
	return accumulator([],sa,n);
}


// })();

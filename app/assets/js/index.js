var TWEEN     = require('tween.js');
var _         = require('underscore');
var autoscale = require('canvas-autoscale');
var canvas = document.getElementById('bg');

var id = function(a) { return a }

// replace with backbone + skip draw on no change
var inputs = {
	set: function(a, b) {
		this.a = this.aRanger(a);
		this.b = this.bRanger(b);
	},
	aRanger: id,
	bRanger: id,
	mouseX: 0,
	mouseY: 0
};

var w = canvas.width;
var h = canvas.height;

var postCanvasSetup = function () {
	w = canvas.width;
	h = canvas.height;

	inputs.aRanger = curry( range, [0, canvas.width] )
	inputs.bRanger = curry( range, [0, canvas.height] )
};


window.myResize = _.compose( autoscale(canvas), postCanvasSetup );
myResize();
window.onresize = myResize;



var context = canvas.getContext('2d');
context.globalCompositeOperation = 'screen';
// normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn
// hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity



// var target = [ 0.6, 0.8 ]; // => only a,b where rgb[a,b] all line up (ish)
var dotSizeRange = [ 15 * window.devicePixelRatio , 120 * window.devicePixelRatio ];
var dotGrowthSpeed = 0.01;

function Dot (scaleX, scaleY) {
	_.extend(this, {
		changeSizeBy: dotGrowthSpeed,
		size:0, scaleX:scaleX, scaleY:scaleY, x:0, y:0,
	})
	this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1], this.size);
	return this;
}
_.extend( Dot.prototype, {
	bumpSize: function() {
		if (this.size > 1) {
			this.changeSizeBy = -dotGrowthSpeed;
		} else if (this.size < 0) {
			this.changeSizeBy = dotGrowthSpeed;
		}
		this.size += this.changeSizeBy;
		this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1], TWEEN.Easing.Quadratic.InOut(this.size) );
	},
	reposition: function(x, y) { // [0-1, 0-1]
		this.x = Math.round( this.scaleX(x) )
		this.y = Math.round( this.scaleY(y) )
	},
	savePosition: function() {
		this.savedX = this.x;
		this.savedY = this.y;
		this.savedSize = this.size;
	},
	hasMoved: function(x, y) {

		var stationary = (within(1, this.savedX, this.x) &&
		                  within(1, this.savedY, this.y) &&
		                  within(0.01, this.savedSize, this.size))
		return ! stationary;
	}
})


var dots = {
	r: new Dot( curry(lerp, [ w * 0.64, w * 0.80 ]),
	            curry(lerp, [ h * 0.70, h * 0.75 ])  ),
	g: new Dot( curry(lerp, [ w * 0.70, w * 0.73 ]),
	            curry(lerp, [ h * 0.60, h * 0.76 ])  ),
	b: new Dot( curry(lerp, [ w * 0.78, w * 0.64 ]),
	            curry(lerp, [ h * 0.90, h * 0.73 ])  ),

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
	near: function(a, b, c) {
		return within(10, a.x, b.x ) && within(10, a.x, c.x ) &&
		       within(10, a.y, b.y ) && within(10, a.y, c.y )
	}
}



function draw() {
	if (dots.r.hasMoved() || dots.g.hasMoved() || dots.b.hasMoved()) {
		context.clearRect(0, 0, canvas.width, canvas.height)
		context
		  .prop({ fillStyle: '#f88' }).circle(dots.r.x, dots.r.y, dots.r.pxSize).fill()
		  .prop({ fillStyle: '#8f8' }).circle(dots.g.x, dots.g.y, dots.g.pxSize).fill()
		  .prop({ fillStyle: '#88f' }).circle(dots.b.x, dots.b.y, dots.b.pxSize).fill()
		dots.r.savePosition()
		dots.g.savePosition()
		dots.b.savePosition()
	}
}

function animate() {
	requestAnimationFrame( animate )
	draw()
}

animate()

///

var receivingDeviceMovement = false;  // window.DeviceOrientationEvent lies

gyro.frequency = 1000/60;

function setupGyro() {
	gyro.startTracking( function (o) {
		if (! receivingDeviceMovement) {
			if (o.gamma != null) {
				inputs.aRanger = curry( range, [-20, 20] )
				inputs.bRanger = curry( range, [ 10, 40] )
				receivingDeviceMovement = true;
			} else if (o.y != null) {
				inputs.aRanger = curry( range, [  2.5, -2.5 ] )
				inputs.bRanger = curry( range, [ 2,  8 ] )
				receivingDeviceMovement = true;
			} else { // getting null values for motion - screw you guys...
				gyro.stopTracking()
			}
		}

		if (o.gamma) { // FIXME exact zero would fail
			inputs.set( o.gamma, o.beta );
		} else if (o.x) {
			inputs.set( o.x, o.y );
		}
	})
}

setTimeout( setupGyro, 500 ); // magic number to wait for the gyro/accel to activate

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

function within (margin, x1, x2) {
	if (x1 == x2) return true;
	return (x1 + margin > x2) && (x1 < x2) ||
	       (x2 + margin > x1) && (x2 < x1)
}

function range(min, max, value) {
	return (value - min) / (max - min)
}

function lerp(v0, v1, t) {
	return v0*(1-t)+v1*t
}

// http://www.crockford.com/javascript/www_svendtofte_com/code/curried_javascript/index.html
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

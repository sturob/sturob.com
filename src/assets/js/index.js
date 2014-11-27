var TWEEN = require('tween.js');
var _     = require('underscore');
var fit   = require('canvas-fit');

var id = function(a) { return a };

var pixels = function(x) { return (window.devicePixelRatio || 1) * x; }

var canvas = document.getElementById('bg');
canvas.style.position = 'fixed'; // stop canvas-fit stomping position:fixed

var context = canvas.getContext('2d');



window.Images = {
	loadUrl: function (src, done) {
		var img = new Image();
		img.src = src;
		img.onload = done;
		return img;
	},
	onImagesLoaded: function () {
		animate();
	}
}

var allImagesLoaded = _.after(3, Images.onImagesLoaded)
_.extend(Images, {
	r: Images.loadUrl('assets/images/me-red.png', allImagesLoaded),
	g: Images.loadUrl('assets/images/me-green.png', allImagesLoaded),
	b: Images.loadUrl('assets/images/me-blue.png', allImagesLoaded)
});

// replace with backbone?
var inputs = {
	set: function(a, b) {
		var angle = window.orientation;

		if (! angle) { // no rotation (or not supported)
			this.a = this.aRanger(a);
			this.b = this.bRanger(b);
		} else {
			// debug.innerHTML = window.orientation;
			this.a = this.aRanger(b);
			this.b = this.bRanger(a);
		}
	},
	aRanger: id,
	bRanger: id,
	mouseX: 0,
	mouseY: 0,
	watchMouse: function() {
		window.onmousemove = function (ev) {
			inputs.mouseX = ev.clientX;
			inputs.mouseY = ev.clientY;
		};

		setInterval(function() {
			if (! AccelOrGyro.receivingData) { // use mouse
				inputs.set( inputs.mouseX, inputs.mouseY );
			}
			dots.update();
		}, 1000/60)
	}
};


var AccelOrGyro = {
	receivingData: false, // window.DeviceOrientationEvent exists when no sensor
	setAsAccel: function() {
		inputs.aRanger = curry( range, [-20, 20] )
		inputs.bRanger = curry( range, [ 0, 50] )
		this.receivingData = true;
	},
	setAsGyro: function() {
		inputs.aRanger = curry( range, [  3.5, -3.5 ] )
		inputs.bRanger = curry( range, [ 0,  8 ] )
		this.receivingData = true;
	},
	configureOnData: function (o) {
		if (o.gamma != null) {
			AccelOrGyro.setAsAccel()
		} else if (o.y != null) {
			AccelOrGyro.setAsGyro()
		} else { // getting null values for motion - screw you guys...
			gyro.stopTracking()
		}
	},
	setup: function () {
		gyro.frequency = 1000/60;
		gyro.startTracking( function(o) {
			if (! AccelOrGyro.receivingData) {
				AccelOrGyro.configureOnData(o)
			}
			if (o.gamma && o.gamma != 0) {
				inputs.set( o.gamma, o.beta );
			} else if (o.x && o.x != 0) {
				inputs.set( o.x, o.y );
			}
		})
	}
}

window.State = {
	drawCircles: false,
	blends: ('screen overlay lighten color-dodge color-burn difference exclusion hue hard-light soft-light saturation color luminosity').split(' '),
	blendN: 0,
	nextBlend: function () {
		State.blendN = (State.blendN + 1) % State.blends.length;
		this.setBlend();
	},
	prevBlend: function (ev) {
		if (ev.keyCode != 37) return;
		State.blendN = (State.blendN - 1) % State.blends.length;
		this.setBlend();
	},
	setBlend: function () {
		console.log( this.currentBlend() );
		context.globalCompositeOperation = this.currentBlend();
		State.redraw = true;
	},
	currentBlend: function () {
		return State.blends[ State.blendN ]
	}
}


var Dimensions = {
	w: canvas.width,
	h: canvas.height,
	postCanvasSetup: function(passedThru) {
		this.w = canvas.width;
		this.h = canvas.height;
		if (! AccelOrGyro.receivingData) {
			inputs.aRanger = curry( range, [0, this.w] )
			inputs.bRanger = curry( range, [0, this.h] )
		}
		// State.end();
	}
};
Dimensions.resize = _.compose(
	fit(canvas, window, pixels(1)),
	function(){
		setTimeout(Dimensions.postCanvasSetup.bind(Dimensions), 10) // magic :/
	}
);



window.addEventListener('load', function () {
	State.setBlend();
	document.addEventListener('click', State.nextBlend.bind(State));
	document.addEventListener('keydown', State.prevBlend.bind(State));
	document.addEventListener('touchend', State.nextBlend.bind(State));
	window.addEventListener('resize', Dimensions.resize.bind(Dimensions), false);

	setTimeout( AccelOrGyro.setup.bind(AccelOrGyro), 500 );
	inputs.watchMouse();
})

Dimensions.resize();



// var target = [ 0.6, 0.8 ]; // => only a,b where rgb[a,b] all line up (ish)
var dotSizeRange = [ pixels(80), pixels(120) ];
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
			State.nextBlend();
		}
		this.size += this.changeSizeBy;
		this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1], TWEEN.Easing.Quadratic.InOut(this.size) );
	},
	reposition: function(x, y) { // [0-1, 0-1]
		this.x = Math.round( this.scaleX(x) + pixels(50) )
		this.y = Math.round( this.scaleY(y) + pixels(50) )
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
	r: new Dot( function(n) { return lerp(Dimensions.w * 0.64, Dimensions.w * 0.80, n) },
	            function(n) { return lerp(Dimensions.h * 0.80, Dimensions.h * 0.70, n) }),
	g: new Dot( function(n) { return lerp(Dimensions.w * 0.72, Dimensions.w * 0.72, n) },
	            function(n) { return lerp(Dimensions.h * 0.70, Dimensions.h * 0.8, n) }),
	b: new Dot( function(n) { return lerp(Dimensions.w * 0.80, Dimensions.w * 0.64, n) },
	            function(n) { return lerp(Dimensions.h * 0.80, Dimensions.h * 0.70, n) }),
	collision: function() {
		return dots.near(dots.r, dots.g, dots.b)
	},
	update: function () {
		var x = inputs.a;
		var y = inputs.b;

		dots.r.reposition(x, y)
		dots.g.reposition(x, y)
		dots.b.reposition(x, y)

		// if (dots.collision()) {
		// 	dots.r.bumpSize()
		// 	dots.g.bumpSize()
		// 	dots.b.bumpSize()
		// }
	},
	// near: function(a, b, c) {
	// 	return within(pixels(10), a.x, b.x ) && within(pixels(10), a.x, c.x ) &&
	// 	       within(pixels(10), a.y, b.y ) && within(pixels(10), a.y, c.y )
	// }
}



function draw() {
	if (dots.r.hasMoved() || dots.g.hasMoved() || dots.b.hasMoved() || State.redraw) {
		context.clearRect(0, 0, canvas.width, canvas.height)

		var radius = { r: dots.r.pxSize, g: dots.g.pxSize, b: dots.b.pxSize };
		var width =  { r: dots.r.pxSize * 2, g: dots.g.pxSize * 2, b: dots.b.pxSize * 2 };

		if (State.drawCircles) {
			context
				.prop({ fillStyle: '#f00' }).circle(dots.r.x, dots.r.y, radius.r).fill()
				.prop({ fillStyle: '#0f0' }).circle(dots.g.x, dots.g.y, radius.g).fill()
				.prop({ fillStyle: '#00f' }).circle(dots.b.x, dots.b.y, radius.b).fill()
		} else {
			context.drawImage(Images.r, dots.r.x - radius.r, dots.r.y - radius.r, width.r, width.r)
			context.drawImage(Images.g, dots.g.x - radius.g, dots.g.y - radius.g, width.g, width.g)
			context.drawImage(Images.b, dots.b.x - radius.b, dots.b.y - radius.b, width.b, width.b)
		}

		dots.r.savePosition()
		dots.g.savePosition()
		dots.b.savePosition()
		State.redraw = false;
	}
}

function animate() {
	requestAnimationFrame( animate )
	draw()
}







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

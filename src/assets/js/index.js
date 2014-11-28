// var TWEEN  = require('tween.js')
var _      = require('underscore') // using: after extend
var fit    = require('canvas-fit')
var unlerp = require('unlerp')
var lerp   = require('lerp')
var curry  = require('lodash.curry')
var almostEqual = require('almost-equal')

var id    = function(a) { return a };
var pixels = function(x) { return (window.devicePixelRatio || 1) * x; }

var canvas = document.getElementById('bg');
canvas.style.position = 'fixed'; // stop canvas-fit stomping position:fixed

var context = canvas.getContext('2d');

var Images = {
	loadUrl: function (src, done) {
		var img = new Image();
		img.onload = done;
		img.src = src;
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


var Transform = {
	// util: {
	// 	w: function (zto1) {
	// 		return canvas.width * zto1
	// 	},
	// 	h: function (zto1) {
	// 		return canvas.height* zto1
	// 	},
	// },
	input: {
		a: function(n) {
			return unlerp(0, canvas.width, n)
		},
		b: function(n) {
			return unlerp(0, canvas.height, n)
		},
		setForAccel: function (currentA, currentB) {
			Transform.input.a = curry(unlerp)( -20, 20 )
			Transform.input.b = curry(unlerp)(   0, 50 )
		},
		setForGyro: function (currentA, currentB) {
			Transform.input.a = curry(unlerp)( 3.5, -3.5 )
			Transform.input.b = curry(unlerp)( 0.0,  8.0 )
		}
	},
	output: {
		r: {
			x: function (zto1) {
				return lerp(canvas.width * 0.64, canvas.width * 0.80, zto1)
			},
			y: function (zto1) {
				return lerp(canvas.height * 0.80, canvas.height * 0.70, zto1)
			}
		},
		g: {
			x: function (zto1) {
				return lerp(canvas.width * 0.72, canvas.width * 0.72, zto1)
			},
			y: function (zto1) {
				return lerp(canvas.height * 0.70, canvas.height * 0.8, zto1)
			}
		},
		b: {
			x: function (zto1) {
				return lerp(canvas.width * 0.80, canvas.width * 0.64, zto1)
			},
			y: function (zto1) {
				return lerp(canvas.height * 0.80, canvas.height * 0.70, zto1)
			}
		}
	}
}


// normalised to 0-1
var NormalisedInput = {
	a: 0,
	b: 0,
	set: function (a, b) {
		var angle = window.orientation;

		this.rawA = a;
		this.rawB = b;

		if (! angle) { // no rotation (or not supported)
			this.a = Transform.input.a(a);
			this.b = Transform.input.b(b);
		} else {
			// debug.innerHTML = window.orientation;
			this.a = Transform.input.a(b);
			this.b = Transform.input.b(a);
		}
	}
}



var Mouse = {
	x: 0,
	y: 0,
	watch: function () {
		window.onmousemove = function (ev) {
			Mouse.x = ev.clientX;
			Mouse.y = ev.clientY;
		};

		this.intervalId = setInterval(function() {
			if (! AccelOrGyro.receivingData) { // use mouse
				NormalisedInput.set( Mouse.x, Mouse.y );
			}
		}, 1000/60)
	},
	stopWatching: function () {
		clearInterval( this.intervalId )
	}
}

var AccelOrGyro = {
	receivingData: false, // window.DeviceOrientationEvent exists when no sensor
	setAsAccel: function(a, b) {
		Transform.input.setForAccel(a, b);
		this.receivingData = true;
	},
	setAsGyro: function(a, b) {
		Transform.input.setForGyro(a, b);
		this.receivingData = true;
	},
	configureOnData: function (o) {
		if (o.gamma != null) {
			AccelOrGyro.setAsAccel(o.gamma, o.beta)
			Mouse.stopWatching()
		} else if (o.y != null) {
			AccelOrGyro.setAsGyro(o.x, o.y)
			Mouse.stopWatching()
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
				NormalisedInput.set( o.gamma, o.beta );
			} else if (o.x && o.x != 0) {
				NormalisedInput.set( o.x, o.y );
			}
		})
	}
}

window.State = {
	drawCircles: false,
	blends: ('screen overlay lighten color-dodge color-burn difference exclusion hue hard-light soft-light saturation color luminosity').split(' '),
	nextBlend: function () {
		this.setBlend( this.blendCycle(+1) )
	},
	prevBlend: function (ev) {
		if (ev.keyCode != 37) return;
		this.setBlend( this.blendCycle(-1) )
	},
	setInitialBlend: function () {
		State.blendCycle = cycle(State.blends)
		this.setBlend( this.blendCycle() )
	},
	setBlend: function (blend) {
		context.globalCompositeOperation = blend;
		State.redraw = true;
	}
}

window.cycle = function (arr) {
	var pos = 0;
	return function (n) {
		n |= 0;
		pos += n;
		if (pos < 0) { pos = arr.length + pos } // negatives
		pos = pos % arr.length;
		return arr[pos];
	}
}


window.addEventListener('load', function () {
	var resize = fit(canvas, window, pixels(1));
	State.setInitialBlend();
	document.addEventListener('click', State.nextBlend.bind(State));
	document.addEventListener('keydown', State.prevBlend.bind(State));
	document.addEventListener('touchend', State.nextBlend.bind(State));
	window.addEventListener('resize', resize, false);

	setTimeout( AccelOrGyro.setup.bind(AccelOrGyro), 500 );
	Mouse.watch();
})


///////////////////////////////////////////////////////

function Dot (id, scaleX, scaleY, color) {
	// var dotGrowthSpeed = 0.01;
	var dotSizeRange = [ pixels(80), pixels(120) ];
	_.extend(this, {
		id:id, scaleX:scaleX, scaleY:scaleY, color:color, size:0, x:0, y:0
	})
	this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1], this.size);
	return this;
}
_.extend( Dot.prototype, {
	setXY: function(x, y) { // [0-1, 0-1]
		this.x = Math.round( this.scaleX(x) + pixels(50) )
		this.y = Math.round( this.scaleY(y) + pixels(50) )
	},
	savePosition: function() {
		this.savedX = this.x;
		this.savedY = this.y;
		this.savedSize = this.size;
	},
	hasMoved: function(x, y) {
		var stationary = (almostEqual(this.savedX, this.x, .05, 0) &&
		                  almostEqual(this.savedY, this.y, .05, 0) &&
                      almostEqual(this.savedSize, this.size, 0.01)
		                 )
		return ! stationary;
	},
	draw: function () {
		var radius = this.pxSize;
		var width =  this.pxSize * 2;

		if (State.drawCircles) {
			context.prop({ fillStyle: this.color }).circle(this.x, this.y, radius).fill()
		} else {
			context.drawImage(Images[this.id], this.x - radius, this.y - radius, width, width)
		}
	},
/*bumpSize: function() {
		if (this.size > 1) { this.changeSizeBy = -dotGrowthSpeed; }
		else if (this.size < 0) {
			this.changeSizeBy = dotGrowthSpeed;
			State.nextBlend();
		}
		this.size += this.changeSizeBy;
		this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1],
	                     TWEEN.Easing.Quadratic.InOut(this.size) );
  }, */
})


var Dots = {
	r: new Dot( 'r', Transform.output.r.x, Transform.output.r.y, '#f00' ),
	g: new Dot( 'g', Transform.output.g.x, Transform.output.g.y, '#0f0' ),
	b: new Dot( 'b', Transform.output.b.x, Transform.output.b.y, '#00f' ),
	// collision: function() {
	// 	return dots.near(dots.r, dots.g, dots.b)
	// },
	haveMoved: function () {
		return Dots.r.hasMoved() || Dots.g.hasMoved() || Dots.b.hasMoved()
	},
	savePositions: function () {
		Dots.r.savePosition()
		Dots.g.savePosition()
		Dots.b.savePosition()
	},
	updateXY: function () {
		var x = NormalisedInput.a;
		var y = NormalisedInput.b;

		Dots.r.setXY(x, y)
		Dots.g.setXY(x, y)
		Dots.b.setXY(x, y)

		// if (dots.collision()) {
		// 	dots.r.bumpSize()
		// 	dots.g.bumpSize()
		// 	dots.b.bumpSize()
		// }
	},
	draw: function () {
		Dots.r.draw();
		Dots.g.draw();
		Dots.b.draw();
	},
	// near: function(a, b, c) {
	// 	return within(pixels(10), a.x, b.x ) && within(pixels(10), a.x, c.x ) &&
	// 	       within(pixels(10), a.y, b.y ) && within(pixels(10), a.y, c.y )
	// }
}


function draw() {
	Dots.updateXY();

	if (Dots.haveMoved() || State.redraw) {
		context.clearRect(0, 0, canvas.width, canvas.height)
		Dots.draw()
		Dots.savePositions()
		State.redraw = false;
	}
}

function animate() {
	requestAnimationFrame( animate )
	draw()
}

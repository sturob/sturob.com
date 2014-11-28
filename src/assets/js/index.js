var TWEEN = require('tween.js')
var _     = require('underscore')
var fit   = require('canvas-fit')
var range = require('unlerp')
var lerp  = require('lerp')
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
	input: {
		a: function(n) {
			return range(0, canvas.width, n)
		},
		b: function(n) {
			return range(0, canvas.height, n)
		},
		setForAccel: function () {
			Transform.input.a = curry( range, [-20, 20] )
			Transform.input.b = curry( range, [ 0, 50] )
		},
		setForGyro: function () {
			Transform.input.a = curry( range, [  3.5, -3.5 ] )
			Transform.input.b = curry( range, [  0.0,  8.0 ] )
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


// replace with backbone?

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

		setInterval(function() {
			if (! AccelOrGyro.receivingData) { // use mouse
				NormalisedInput.set( Mouse.x, Mouse.y );
			}
			dots.update(); // what?
		}, 1000/60)
	}
}

var AccelOrGyro = {
	receivingData: false, // window.DeviceOrientationEvent exists when no sensor
	setAsAccel: function() {
		Transform.input.setForAccel();
		this.receivingData = true;
	},
	setAsGyro: function() {
		Transform.input.setForGyro();
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
// the mess starts here...

var dotSizeRange = [ pixels(80), pixels(120) ];
// var dotGrowthSpeed = 0.01;

function Dot (scaleX, scaleY) {
	_.extend(this, {
		// changeSizeBy: dotGrowthSpeed,
		size:0, scaleX:scaleX, scaleY:scaleY, x:0, y:0,
	})
	this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1], this.size);
	return this;
}
_.extend( Dot.prototype, {
	// bumpSize: function() {
	// 	if (this.size > 1) {
	// 		this.changeSizeBy = -dotGrowthSpeed;
	// 	} else if (this.size < 0) {
	// 		this.changeSizeBy = dotGrowthSpeed;
	// 		State.nextBlend();
	// 	}
	// 	this.size += this.changeSizeBy;
	// 	this.pxSize = lerp(dotSizeRange[0], dotSizeRange[1], TWEEN.Easing.Quadratic.InOut(this.size) );
	// },
	move: function(x, y) { // [0-1, 0-1]
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
	}
})


var dots = {
	r: new Dot( Transform.output.r.x, Transform.output.r.y ),
	g: new Dot( Transform.output.g.x, Transform.output.g.y ),
	b: new Dot( Transform.output.b.x, Transform.output.b.y ),
	// collision: function() {
	// 	return dots.near(dots.r, dots.g, dots.b)
	// },
	update: function () {
		var x = NormalisedInput.a;
		var y = NormalisedInput.b;

		dots.r.move(x, y)
		dots.g.move(x, y)
		dots.b.move(x, y)

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

			// context.drawImage.apply(context, [Images.r].concat( dots.calcImageXY() ))
			context.drawImage(Images.r, dots.r.x - radius.r, dots.r.y - radius.r, width.r, width.r)
			context.drawImage(Images.g, dots.g.x - radius.g, dots.g.y - radius.g, width.g, width.g)
			context.drawImage(Images.b, dots.b.x - radius.b, dots.b.y - radius.b, width.b, width.b)
		}

		// dots.savePositions()
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

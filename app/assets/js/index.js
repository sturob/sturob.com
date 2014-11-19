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
		this.a = this.aDom(a)
		this.b = this.bDom(b)
	},
	aDom: curry(range, [0, w]),
	bDom: curry(range, [0, h]),
	x: 0,
	y: 0
};

var change = 1;

function Dot (size, scaleX, scaleY) {
	this.size = size;
	this.scaleX = scaleX;
	this.scaleY = scaleY;
	this.x = 0;
	this.y = 0;
	return this;
}
Dot.prototype.reposition = function(x, y) { // [0-1,0-1]
	this.x = this.scaleX(x)
	this.y = this.scaleY(y)
}

var dots = {
	r: new Dot( 15, curry(lerp, [ w * 0.84, w * 0.90 ]),
	                curry(lerp, [ h * 0.80, h * 0.85 ])  ),
	g: new Dot( 15, curry(lerp, [ w * 0.72, w * 0.92 ]),
	                curry(lerp, [ h * 0.80, h * 0.82 ])  ),
	b: new Dot( 15, curry(lerp, [ w * 0.82, w * 0.90 ]),
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
			dots.r.size += change;
			dots.g.size += change;
			dots.b.size += change;

			if (dots.r.size > 200) {
				change = -1;
			} if (dots.r.size < 10) {
				change = 1;
			}
		}
	},
	close: function(x1, x2) {
		return (x1 + 5 > x2) && (x1 < x2) ||
		       (x2 + 5 > x1) && (x2 < x1)
	},
	near: function(a, b, c) {
		return dots.close( a[0], b[0] ) &&
		       dots.close( a[0], c[0] ) &&
		       dots.close( a[1], b[1] ) &&
		       dots.close( a[1], c[1] )
	}
}



function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context
	  .prop({ fillStyle: '#fcc' }).circle(dots.r.x, dots.r.y, dots.r.size).fill()
	  .prop({ fillStyle: '#cfc' }).circle(dots.g.x, dots.g.y, dots.g.size).fill()
	  .prop({ fillStyle: '#ccf' }).circle(dots.b.x, dots.b.y, dots.b.size).fill()
}

function animate() {
	requestAnimationFrame( animate )
	draw()
}

animate()


// inputs

// fix this - it currently always returns true on desktop chrome
// not what we want....
//window.DeviceOrientationEvent && 
if (window.location.hash == '#gyro') {
	inputs.aDom = curry(range, [-20, 20]);
	inputs.bDom = curry(range, [ 10, 40]);

	gyro.frequency = 1000/60;

	setTimeout(function() {
		gyro.startTracking(function(o){
			if (o.gamma) {
				inputs.set( o.gamma, o.beta )
				// alert(inputs.a)
			} else if (o.y) {
				inputs.set( o.y, o.z )
			} else {
				gyro.stopTracking()
			}
		})
	}, 2000)
} else {
}


window.onmousemove = _.throttle(function (ev) {
	inputs.x = ev.clientX;
	inputs.y = ev.clientY;
}, 1000/60)

setInterval(function() {
	// get mouse pos
	inputs.set( inputs.x, inputs.y );
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
var h = window.innerHeight;
var w = window.innerWidth;
var canvas = document.getElementById('bg');
canvas.width = w;
canvas.height = h;
var context = canvas.getContext('2d');

context.globalCompositeOperation = 'lighten';

// replace with backbone + skip draw on no change
var inputs = { }

var dots = {
	r: [200, 120, 15],
	g: [190, 120, 15],
	b: [195, 130, 15]
}


function close(x1, x2) {
	return (x1 + 5 > x2) && (x1 < x2) ||
	       (x2 + 5 > x1) && (x2 < x1)
}

function near(a,b,c) {
	return close( a[0], b[0] ) &&
	       close( a[0], c[0] ) &&
	       close( a[1], b[1] ) &&
	       close( a[1], c[1] )
}

function draw() {

	context.clearRect(0, 0, canvas.width, canvas.height);
	context
	  .prop({ fillStyle: '#fcc' }).circle(dots.r[0], dots.r[1], dots.r[2]).fill()
	  .prop({ fillStyle: '#cfc' }).circle(dots.g[0], dots.g[1], dots.g[2]).fill()
	  .prop({ fillStyle: '#ccf' }).circle(dots.b[0], dots.b[1], dots.b[2]).fill()
}

function animate() {
	requestAnimationFrame( animate )
	draw()
}

animate()

// data

var scale = {
	r: [
		d3.scale.linear(),
		d3.scale.linear()
	],
	g: [
		d3.scale.linear(),
		d3.scale.linear()
	],
	b: [
		d3.scale.linear(),
		d3.scale.linear()
	]
}


var xdom = [ 10, w ];
var ydom = [ 0, h ];


// scale.x.range([ 0, w ])
// scale.y.range([ 0, h ])

// fix this - it currently always returns true on desktop chrome
// not what we want....
//window.DeviceOrientationEvent && 
if (window.location.hash == '#gyro') {
	xdom = [ -20, 20 ];
	ydom = [ 10, 40 ];

	gyro.frequency = 1000/60;

	setTimeout(function() {
		gyro.startTracking(function(o){
			if (o.gamma) {
				updateModel({ 
					clientX: o.gamma,
					clientY: o.beta
				})
			} else if (o.y) {
				updateModel({ 
					clientX: o.gamma,
					clientY: o.beta
				})
			} else {
				gyro.stopTracking()
			}
		})
	}, 2000)
} else {
}


scale.r[0].domain( xdom ).range([ w * 0.84,  w * 0.9 ])
scale.r[1].domain( ydom ).range([ h * 0.8,   h * 0.85 ])

scale.g[0].domain( xdom ).range([ w * 0.72,  w * .92 ])
scale.g[1].domain( ydom ).range([ h * 0.8,  h * 0.82  ])

scale.b[0].domain( xdom ).range([ w * 0.82,  w * 0.9 ])
scale.b[1].domain( ydom ).range([ h * 0.8,   h * 0.91 ])


var change = 1;

var updateModel = function (ev) {
	var x = ev.clientX;
	var y = ev.clientY;

	dots.r[0] = scale.r[0](x);
	dots.r[1] = scale.r[1](y);
	dots.g[0] = scale.g[0](x);
	dots.g[1] = scale.g[1](y);
	dots.b[0] = scale.b[0](x);
	dots.b[1] = scale.b[1](y);
	
	if (near(dots.r, dots.g, dots.b)) {
		dots.r[2] += change;
		dots.g[2] += change;
		dots.b[2] += change;

		if (dots.r[2] > 200) {
			change = -1 // change //* 2;
		} if (dots.r[2] < 10) {
			change = 1//change //* -2;
		}

		// if (change > 100) {
		// 	change = 1;
		// 	if (dots.r[2] > 200) {
		// 		change = -1;
		// 	}
		// }

	}
}

window.onmousemove = _.throttle(function (ev) {
	inputs.x = ev.clientX;
	inputs.y = ev.clientY;
}, 1000/60)

setInterval(function() {
	// get mouse pos
	updateModel({ clientX: inputs.x, clientY: inputs.y });
}, 1000/60)




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
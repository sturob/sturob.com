var h = window.innerHeight;
var w = window.innerWidth;
var canvas = document.getElementById('bg');
canvas.width = w;
canvas.height = h;
var context = canvas.getContext('2d');

context.globalCompositeOperation = 'lighten';

// replace with backbone + skip draw on no change
var model = {
	r: [200, 120, 80],
	g: [190, 120, 80],
	b: [195, 130, 80]
}


function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context
	  .prop({ fillStyle: '#00f' }).circle(model.r[0], model.r[1], model.r[2]).fill()
	  .prop({ fillStyle: '#f00' }).circle(model.g[0], model.g[1], model.g[2]).fill()
	  .prop({ fillStyle: '#0f0' }).circle(model.b[0], model.b[1], model.b[2]).fill()
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
	], 
	x: d3.scale.linear(),
	y: d3.scale.linear()
}





// fix this - it currently always returns true on desktop chrome
// not what we want....
//window.DeviceOrientationEvent && 
if (window.location.hash == '#gyro') {
	// alert('ho')
	scale.x.domain([ -25, 25 ]) // // gamma -25 -> 25
	scale.y.domain([ 0, 50 ]) // beta 0 -> 50

	gyro.frequency = 50;

	setTimeout(function() {
		gyro.startTracking(function(o){
			if (o.gamma) {
				updateModel({ clientX: o.gamma, clientY: o.beta })
			} else {
				gyro.stopTracking()
				scale.x.range([ 0, w * 0.75 - 100 ])
				scale.y.range([ 0, h * 0.75 - 100 ])
			}
		})
	}, 2000)
} else {
	scale.x.domain([ 0, w ])
	scale.y.domain([ 0, h ])
}

scale.x.range([ 0, w * 0.75 - 100 ])
scale.y.range([ 0, h * 0.75 - 100 ])



var updateModel = function (ev) {
	var x = ev.clientX;
	var y = ev.clientY;

	var rx = scale.x(x) * 1.1;
	var ry = scale.y(y) * 1.1;

	var gx = scale.x(x) * 0.8;
	var gy = scale.y(y) * 1;

	var bx = scale.x(x);
	var by = scale.y(y) * 0.8;


	model.r[0] = rx;
	model.r[1] = ry;
	model.g[0] = gx;
	model.g[1] = gy;
	model.b[0] = bx;
	model.b[1] = by;
	
}

window.onmousemove = _.throttle(updateModel, 1000/30)









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
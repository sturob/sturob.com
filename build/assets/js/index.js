
function setPositions(r, g, b) {
	function rule (repeat, path, file, x, y) {
		return "url('" + path + file + "') " + x + 'px ' + y + 'px ' + repeat
	}

	var rules = { // universal parameters
		universal: curry(rule, [ 'no-repeat', 'assets/images/' ])
	}

	rules.r = curry( rules.universal, [ 'circle-red.png' ] )
	rules.g = curry( rules.universal, [ 'circle-green.png' ] )
	rules.b = curry( rules.universal, [ 'circle-blue.png' ] )

	a.style.background = [
			rules.r( r[0], r[1] ),
			rules.g( g[0], g[1] ),
			rules.b( b[0], b[1] )
		].join(', ');
	// a.style.backgroundSize = '200px'
}

var h = window.innerHeight;
var w = window.innerWidth;


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

scale.x.domain([ 0, w ])
scale.y.domain([ 0, h ])

// fix this - it currently always returns true on desktop chrome
// not what we want....
if (window.DeviceOrientationEvent) {
	// scale.x.domain([ -25, 25 ]) // // gamma -25 -> 25
	// scale.y.domain([ 0, 50 ]) // beta 0 -> 50
}

gyro.frequency = 50;

setTimeout(function() {
	gyro.startTracking(function(o){
		if (o.gamma) {
			updatePositions({ clientX: o.gamma, clientY: o.beta })
		} else {
			gyro.stopTracking()
			scale.x.range([ 0, w * 0.75 - 100 ])
			scale.y.range([ 0, h * 0.75 - 100 ])
		}
	})
}, 2000)


scale.x.range([ 0, w * 0.75 - 100 ])
scale.y.range([ 0, h * 0.75 - 100 ])


var updatePositions = function (ev) {
	var x = ev.clientX;
	var y = ev.clientY;

	var rx = scale.x(x) * 1.1;
	var ry = scale.y(y) * 1.1;

	var gx = scale.x(x) * 0.8;
	var gy = scale.y(y) * 1;

	var bx = scale.x(x);
	var by = scale.y(y) * 0.8;

	setPositions([rx, ry], [gx, gy], [bx, by]);
}

window.onmousemove = _.throttle(updatePositions, 1000/30)


var tmpX = 100, tmpY = 100;

// setInterval(function() {
	window.onmousemove({
		clientX: tmpX++,
		clientY: tmpY++
	})
// }, 100)




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
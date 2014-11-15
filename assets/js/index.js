
function setPositions(r, g, b) {
	function rule (repeat, path, file, x, y) {
		return "url('" + path + file + "') " + x + 'px ' + y + 'px ' + repeat
	}

	// function colorRule (color, x, y) {
	// 	return 'ba'
	// }

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

setPositions([4, 7], [-4, 1], [2, -7])

var h = window.innerHeight;
var w = window.innerWidth;

var scaleX = d3.scale.linear()
var scaleY = d3.scale.linear()

scaleX.domain([ 0, w ])
scaleX.range([ w/4 - 100, w/2 + w/4 - 100])

scaleY.domain([ 0, h ])
scaleY.range([ 0, h * 0.75 ])

// function cycle (n, by) {
// 	return (n + by) % 10
// }

window.onmousemove = _.throttle(function (ev) {
	var x = ev.clientX;
	var y = ev.clientY;

	var rx = scaleX(x) * 1.1;
	var ry = scaleY(y) * 1.1;

	var gx = scaleX(x) * 0.8;
	var gy = scaleY(y) * 1;

	var bx = scaleX(x);
	var by = scaleY(y) * 0.8;

	setPositions([rx, ry], [gx, gy], [bx, by]);
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
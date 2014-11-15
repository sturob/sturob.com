
function setPositions(r, g, b) {
	function rule (repeat, path, file, x, y) {
		return "url('" + path + file + "') " + x + 'px ' + y + 'px ' + repeat
	}

	var rules = {
		base: curry(rule, [ 'no-repeat', 'assets/images/' ])
	}

	rules.r = curry( rules.base, [ 'me-red.png' ] )
	rules.g = curry( rules.base, [ 'me-green.png' ] )
	rules.b = curry( rules.base, [ 'me-blue.png' ] )

	a.style.background = [
			rules.r( r[0], r[1] ),
			rules.g( g[0], g[1] ),
			rules.b( b[0], b[1] )
		].join(', ');


	a.style.backgroundSize = '100px'
}

setPositions([4, 7], [-4, 1], [2, -7])

var h = window.innerHeight;
var w = window.innerWidth;

var scaleX = d3.scale.linear()
var scaleY = d3.scale.linear()

scaleX.domain([ 0, w ])
scaleX.range([ -50, 200 ])

scaleY.domain([ 0, h ])
scaleY.range([ -50, 200 ])

// function cycle (n, by) {
// 	return (n + by) % 10
// }

window.onmousemove = _.throttle(function (ev) {
	var x = ev.clientX;
	var y = ev.clientY;

	var rx = scaleX(x);
	var ry = scaleY(y);

	var gx = scaleX(x) * 1.4;
	var gy = scaleY(y)* 1.4;

	var bx = scaleX(x) * 0.5;
	var by = scaleY(y) * 0.5;

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
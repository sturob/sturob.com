

function setPositions(r, g, b) {
	function rule (repeat, path, file, x, y) {
		return "url('" + path + file + "') " + x + ' ' + y + ' ' + repeat
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
		].join(', ')
}

setPositions(['4px', '7px'], ['-4px', '1px'], ['2px', '-7px'])

// window.title = 'hello'


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
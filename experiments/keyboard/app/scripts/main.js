var $lettering = $('.lettering');

var letterEl = function (letter) { return '<span><b>' + letter + '</b></span>' };

var measureLetter = function (letter) {
	return Math.max( $('#ruler').html(letter).width(), 10 )
}

var insertion = {
	startTime: 0,
	$el: null,
	width: 0,
	letter: ''
}

window.onkeypress = function(k) {

	// console.log( 'press' + String.fromCharCode( k.which ) );
	if (insertion.$el && insertion.letter == String.fromCharCode(k.which)) {
		return;
	}

	insertion.startTime = Date.now();
	insertion.letter = String.fromCharCode( k.which );
	insertion.width = measureLetter( insertion.letter );
	insertion.$el= $( letterEl( insertion.letter ) );
	$lettering.append( insertion.$el )
};

window.onkeydown = function(k) {
	if (k.which == 8) {
		$lettering.find('span').last().remove()
		return;
	}
}

window.onkeyup = function (k) {
	console.log( String.fromCharCode(k.which) )
	insertion.$el = null;
}

window.onblur = function() {
	insertion.$el = null;
};

var loop = setInterval(function() {
	if (insertion.$el) {
		var scale = Math.pow(1 + (Date.now() - insertion.startTime) / 1000, 2);
		// console.log( scale );
		insertion.$el.css({
			width: scale * insertion.width
		})
		insertion.$el.find('b').css({
			transform: 'scale(' + scale + ')'
		});
		// scale based on time
	}
}, 60);
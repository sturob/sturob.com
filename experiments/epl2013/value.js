
var margin = { top: 20, right: 0, bottom: 50, left: 50 },
    w = 1200 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
    padding = 0;

var cycle = function (arr) {
	var i = 0;	
	return function() {
		return arr[i++ % arr.length]
	}
}

var nextStat = cycle([ 'points', 'ppg', 'goalsScored', 'goalDiff' ]);

var x = d3.scale.linear(),
  	y = d3.scale.linear();

// X+Y axis
var yAxe = d3.svg.axis();
var xAxe = d3.svg.axis();

var svg1 = d3.select("body")
             .append("svg")
             .attr("width", w + margin.left + margin.right)
             .attr("height", h + margin.top + margin.bottom)
             .on("click", switchYStat);


$("body").append('<div id="teams">');

// ---------------------------------


function dataReady() {
	window.teamsArray = _.chain(teams).sortBy(function (team) {
		return team.totalPoints()
	}).sortBy(function (team) {
		return team.seasonsInPremiership()
	}).reverse().value();

	var teamNames = teamsArray.map(function (team) { return team.name })

	_.each(teamNames, function (t, n) {
		$('#teams').append( '<b>' + t + '</b> ' )
	});

	$('body').on('click', function() {
		console.log('boom')
	});

	$('b').on('click', function () {
		var teamName = $(this).text();
		var n =  teamNames.indexOf( teamName );
		$('text.year').hide();
		$('text.year.n' + n).show();
	
		$('b').removeClass('selected')
		$(this).addClass('selected')
		d3.selectAll('path.line').classed('selected', false)
		d3.select('path.line.n' + n).classed('selected', true)
	});

	window.data = _.map(teamsArray, function (team) {
		var seasons = _(yearsRange).map(function (year) {
			var t   = team.seasons[year],
			    cpp = t.cost / t.currentPoints;
			return { year:year, cpp:cpp, cost:t.cost, points:t.currentPoints }
		});
		seasons = _.filter(seasons, function (season) {
			return season.points && ! isNaN(season.cost) 
		})
		seasons.team = team; // hacky
		return seasons;
	});

	// var max =  d3.max(teamArray, function (d){ return d[ currentize(stat) ] });
	// var min =  d3.min(teamArray, function (d){ return d[ currentize(stat) ] });

	// min = min > 0 ? 0 : min; //
	// max = max < 3 ? 3 : max; // hack for ppg

	x.domain([ 0, 300 ]).range([ margin.left, w ]);
	y.domain([ 20, 95 ]).range([ h, margin.bottom ]);
	

	initAxis()

	var line = d3.svg.line()
	    .interpolate( 'monotone' ).tension(0.99)
	    .x(function(d, n) { return x(d.cost); })
	    .y(function(d, n) { return y(d.points) })

	window.lines = svg1.selectAll('path.line').data( data );

	lines.enter()
		.append('path').attr("d", line)
		  .attr('class', function (d, n) { return 'line n' + n })
			.on("click", function (d, n, line) {
				console.log( d.team.name );
				return false;
			});

	_.each(data, function(team, n) {
		var dots = svg1.selectAll("text.n" + n).data( team );

		 dots.enter().append("text")
		 		 .attr('class', 'year n' + n)
		     // .attr("width", function(d) { return 4 })
		     // .attr("height", function(d) { return 4 })
		     .text(function(d){ return (d.year - 1) + "-" + (d.year - 2000) })
		     .attr("x", function(d) { return x(d.cost) - 12 })
		     .attr("y", function(d) { return y(d.points) + 4 })
		     .on("click", function(d, n) {
			     	console.log( d.year + ": " + d.cost + "m " + d.points );
			     	return false;
		     });
	})
  
  $('text.year').hide();

}



function initAxis () {
	xAxe.scale(x).ticks(4);
  yAxe.scale(y).orient("left").ticks(9);
	
	svg1.append("g")
	    .attr("class", "axis x")
	    .attr("transform", "translate(0," + h + ")")
	    .call(xAxe);

	svg1.append("g")
	    .attr("class", "axis y")
	    .attr("transform", "translate(" + margin.left + ",0)")
	    .call(yAxe);
}


function currentize(stat) {
	return 'current' + stat[0].toUpperCase() + stat.slice(1);
}


function update(yStat){

 
	window.tNames = svg1.selectAll("text").data(teamArray);

  var current = currentize(yStat);

	tNames.enter()
        .append("svg:text")
        .attr("x", function(datum, n) { return 540 })
        .attr("y", function(datum) { return y(datum[current]); })
        .attr("class", "team-name")
        .text(function(datum) { return datum.name });

 	tNames.transition().duration(transTime).attr('y', function(d) { 
 		return y(d[current])
 	});

	// window.guidelines = svg1.append("svg:g")
	// 	                 .attr('class', 'guidelines')
	// 	                 .attr("transform", "translate("+ padding + ", " + padding + ")");

 // 	guidelines.append("svg:line")
	//           .attr("x1", 0).attr("y1", d3.round(y(championsPoints)))
	//           .attr("x2", w).attr("y2", d3.round(y(championsPoints)));

	// guidelines.append("svg:line")
	//           .attr("x1", 0).attr("y1", d3.round(y(safetyPoints)))
	//           .attr("x2", w).attr("y2", d3.round(y(safetyPoints)));
}




function switchYStat() {
	// window.stat = nextStat();
	// document.title = stat;
	// initGraph( stat );
	// update( stat );
	// var t = svg1.transition().duration(transTime);
	// t.select(".y.axis").call( yAxe );
}

var w = 600,
    h = 600,
    padding = 0;

// todo - calc averages
var championsPoints = 95,
    safetyPoints = 40;


var period = {
	end: 2013
};
period.start = period.end - 1;
period.file = period.start + '-' + (period.end - 2000) + '.csv';

var cycle = function (arr) {
	var i = 0;
	return function() {
		return arr[i++ % arr.length]
	}
}

var nextStat = cycle([ 'points', 'ppg', 'goalsScored', 'goalDiff' ]);
var teams = {},
    x = d3.time.scale(),
  	y = d3.scale.linear();

// X+Y axis
var yAxe = d3.svg.axis();
var xAxe = d3.svg.axis();

var svg1 = d3.select("body")
             .append("svg")
             .attr("width", w).attr("height", h)
             .on("click", switchYStat);

d3.csv(period.file, loadCSV);


// ---------------------------------

function switchYStat() {
	var stat = nextStat();
	document.title = stat;
	initGraph( stat );
	update( stat );
	var t = svg1.transition().duration(1500);
	t.select(".y.axis").call( yAxe );
}

function initGraph(stat) {
	var max =  d3.max(teamArray, function(d){ return d[ currentize(stat) ] });
	var min =  d3.min(teamArray, function(d){ return d[ currentize(stat) ] });
	min = min > 0 ? 0 : min;

	x.domain([ new Date(period.start, 7, 13), new Date(period.end, 5, 19) ]).range([ 0, w ]);
	y.domain([ min, max ]).range([ h, 0 ]);	
}


function initAxis () {
	xAxe.scale(x).ticks(7);
  yAxe.scale(y).orient("left").ticks(5);
	
	svg1.append("g")
	    .attr("class", "axis x")
	    // .text(function(d, i) { return monthNames[i]; })
	    .attr("transform", "translate(0," + 0 + ")")
	    .call(xAxe);

	svg1.append("g")
	    .attr("class", "axis y")
	    .attr("transform", "translate(" + 30 + ",0)")
	    .call(yAxe);
}


function loadCSV(matches) {
	matches.forEach( populateTeamResults ); // Matches -> Team + Results
	
	// club titles
	window.teamArray = _.map(teams, function(t){ 
		return t
	});

	window.data = _.map(teams, function(t, name){ 
		return t.results
	});

	switchYStat();

	initAxis();

	var guidelines = svg1.append("svg:g")
			                 .attr('class', 'guidelines')
			                 .attr("transform", "translate("+ padding + ", " + padding + ")");

	guidelines.append("svg:line")
	          .attr("x1", 0).attr("y1", d3.round(y(championsPoints)))
	          .attr("x2", w).attr("y2", d3.round(y(championsPoints)));

	guidelines.append("svg:line")
	          .attr("x1", 0).attr("y1", d3.round(y(safetyPoints)))
	          .attr("x2", w).attr("y2", d3.round(y(safetyPoints)));
}


function currentize(stat) {
	return 'current' + stat[0].toUpperCase() + stat.slice(1);
}

function update(yStat){
  var line = d3.svg.line()
      .interpolate('monotone')
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d[yStat]); });

  window.lines = svg1.selectAll('path').data( data );

  lines.enter().append('path').attr("d", line)
       .on("click", function(d, n) {
      	 console.log( teamArray[n].name )
      	 return false;
       })
       .attr("class", "line")
       .attr('stroke', function(d, n) {
         return Kits[teamArray[n].name] ? Kits[teamArray[n].name].base : '#888'
       });

  lines.transition().duration(1500).attr("d", line);
  lines.exit().remove();		

	window.tNames = svg1.selectAll("text").data(teamArray);

  var current = currentize(yStat);

	tNames.enter()
        .append("svg:text")
        .attr("x", function(datum, index) { return 540 })
        .attr("y", function(datum) { return y(datum[current]); })
        .attr("class", "team-name")
        .text(function(datum) { return datum.name });

 	tNames.transition().duration(1500).attr('y', function(d) { 
 		return y(d[current])
 	});
}



function populateTeamResults(match, n) {
	_.extend(match, Match);

	function saveResult(name) {
		var t = teams[name];
		if (! t) {
			teams[name] = t = new Team(name);
		}

		t.currentPoints += match.points(name);
		t.currentGoalDiff += match.difference(name);
		t.currentGoalsScored += match.scored(name);
		t.currentPpg = t.currentPoints / (t.results.length + 1);

		t.results.push({
			date: new Date( match.date() ),
			ppg: t.currentPpg,
			goalDiff:  t.currentGoalDiff,
			points:    t.currentPoints,
			goalsScored: t.currentGoalsScored
		});
	}

	saveResult(match.HomeTeam);
	saveResult(match.AwayTeam);
}


// --------------------------------------
// Team Class
// --------------------------------------
var Season = {
	sorted: function() {} // returns array sorted by position
}




var TeamProto = {};

function Team(name){
	this.name = name;
	this.results = [];
	this.currentPpg = 0;
	this.currentPoints = 0;
	this.currentGoalDiff = 0;
	this.currentGoalsScored = 0;
};

Team.prototype = TeamProto;



var w = 600,
    h = 400,
    padding = 0;

// todo - calc averages
var championsPoints = 95,
    safetyPoints = 40;

var svg1 = d3.select("body")
             .append("svg")
             .attr("width", w).attr("height", h); 	

d3.csv('2012-13.csv', loadCSV);

var teams = {},
    x = d3.time.scale(),
    y = d3.scale.linear()

function loadCSV(matches) {
	var max = 105; //d3.max(matches, function(d){ return d.points });
	
	x.domain([ new Date(2012, 7, 16), new Date(2013, 5, 19) ]).range([ 0, w ]);
	y.domain([ 0, max ]).range([ h, 0 ]);

	matches.forEach(function populateTeamResults(match) {
		_.extend(match, Match);

		function saveResult(name) {
			var t = teams[name];
			if (! t) {
				teams[name] = t = new Team(name);
			}
			t.currentPoints += match.points(name);
			t.currentGoalDiff += match.difference(name);
			t.currentGoalsScored += match.scored(name);

			t.results.push({
				date: new Date( match.date() ),
				goalDiff:  t.currentGoalDiff,
				points:    t.currentPoints,
				goalsScored: t.currentGoalsScored
			});
		}

		saveResult(match.HomeTeam);
		saveResult(match.AwayTeam);
	});
	
	// todo do this in d3 natively by using teamArray
	for (t in teams) {
		graphTeam(teams[t], t)
	}

	// club titles
	var teamArray = _.map(teams, function(t, name){ return t });

	svg1.selectAll("text")
	    .data(teamArray)
      .enter()
      .append("svg:text")
      .attr("x", function(datum, index) { return 400 })
      .attr("y", function(datum) { return y(datum.currentPoints); })
      .attr("class", "team-name")
      .text(function(datum) { return datum.name });

	// X+Y axis
	var yAxe = d3.svg.axis();
	var xAxe = d3.svg.axis();

	xAxe.scale(x).ticks(7);
  yAxe.scale(y).orient("left").ticks(5);

	svg1.append("g")
	    .attr("class", "axis")
	    // .text(function(d, i) { return monthNames[i]; })
	    .attr("transform", "translate(0," + 0 + ")")
	    .call(xAxe);

	svg1.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + 30 + ",0)")
	    .call(yAxe);


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


function graphTeam(data, team) {
	var line = d3.svg.line();

  line.x(function(d) { return x(d.date); })
    	.y(function(d) { return y(d.points); })
      .interpolate("basis");

  svg1.append("path")
     .datum(data.results)
     .on("click", function() {
       console.log(team)
     })
     .attr("class", "line")
     .attr('stroke', Kits[team] ? Kits[team].base : '#333')
     .attr("d", line);

	// ddd.exit().remove();
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
	this.currentPoints = 0;
	this.currentGoalDiff = 0;
	this.currentGoalsScored = 0;
};

Team.prototype = TeamProto;


var w = 500,
    h = 400,
    padding = 0;

// todo - calc averages
var championsPoints = 95,
    safetyPoints = 40;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w).attr("height", h); 	

d3.csv('2012-13.csv', loadCSV);

function loadCSV(matches) {
	window.d = matches;
	window.teams = {};

	var max = 120; //d3.max(matches, function(d){ return d.points });
	
	window.x = d3.time.scale()
	          .domain([ new Date(2012, 7, 16), new Date(2013, 5, 19) ])
	          .range([ 0, w ]);

	window.y = d3.scale.linear()
	          .domain([ 0, max ])
	          .range([h, 0]);

	window.y2 = d3.scale.linear()
	          .domain([ 0, max ])
	          .rangeRound([h, 0]);



	matches.forEach(function(match) {
		_.extend(match, Match);

		function saveResult(name) {
			var t = teams[name];
			if (! t) {
				teams[name] = t = new Team(name);
			}
			t.currentPoints += match.points(name);
			t.currentGoalDiff += match.difference(name);
			t.currentGoalsScored += match.scored(name);

			t.matches.push({
				date: new Date( match.date() ),
				points: t.currentPoints,
				scored: t.currentGoalsScored
			});
		}

		saveResult(match.HomeTeam);
		saveResult(match.AwayTeam);
	});
	
	for (t in teams) {
		graphTeam(teams[t], t)
	}

	// club titles
	var tots = _.map(teams, function(t, name){ 
		return { name: name, currentPoints: t.currentPoints } 
	});

	svg.selectAll("text").
    data(tots).
    enter().
    append("svg:text").
    attr("x", function(datum, index) { return 400 }).
    attr("y", function(datum) { return y2(datum.currentPoints); }).
    attr("class", "team-name").
    text(function(datum) { return datum.name });

    // Y axis
		var yAxis = d3.svg.axis()
		              .scale(y)
		              .orient("left")
		              .ticks(5);

		svg.append("g")
		    .attr("class", "axis")
		    .attr("transform", "translate(" + 30 + ",0)")
		    .call(yAxis);

		// X axis
		var xAxis = d3.svg.axis()
		              .scale(x)
		              .ticks(7);

		svg.append("g")
		    .attr("class", "axis")
        // .text(function(d, i) { return monthNames[i]; })
		    .attr("transform", "translate(0," + 0 + ")")
		    .call(xAxis);


		var lineGroup = svg.append("svg:g")
  			               .attr("transform", "translate("+ padding + ", " + padding + ")");

		lineGroup.append("svg:line")
		         .attr("x1", 0).attr("y1", d3.round(y(championsPoints)))
		         .attr("x2", w).attr("y2", d3.round(y(championsPoints)))
		         .attr("stroke", "lightgray");

		lineGroup.append("svg:line")
		         .attr("x1", 0).attr("y1", d3.round(y(safetyPoints)))
		         .attr("x2", w).attr("y2", d3.round(y(safetyPoints)))
		         .attr("stroke", "lightgray");
}


function graphTeam(data, team) {
	var line = d3.svg.line()
  	  .x(function(d) { return x(d.date); })
    	.y(function(d) { return y(d.points); })
      .interpolate("basis");

  svg.append("path")
      .datum(data.matches)
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

var TeamProto = {};

function Team(name){
	this.name = name;
	this.matches = [];
	this.currentPoints = 0;
	this.currentGoalDiff = 0;
	this.currentGoalsScored = 0;
};

Team.prototype = TeamProto;


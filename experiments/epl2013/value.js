
// if (false) { switchYStat(); initAxis(); }

////////////////////////////////////////////
// show data bit
////////////////////////////////////////////


var margin = { top: 20, right: 0, bottom: 30, left: 50 },
    w = 800 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
    padding = 0;

var transTime = 1500;

function n_to_date (n, period) {
	var a = new Date( period.start, 7, 13 )
	var b = new Date( period.end, 5, 19 )
	return new Date( a + ((b - a) / n) )
}



// var winner_data = d3.range(0, 38).map(function(d, n){ 
// 	return {
// 		points: championsPoints/38 * d,
// 		date: n_to_date( d )
// 	}
// });

var cycle = function (arr) {
	var i = 0;	
	return function() {
		return arr[i++ % arr.length]
	}
}

var interpols = {
	points: 'step-after',
	ppg: 'monotone',
	goalsScored: 'monotone', 
	goalDiff: 'monotone'
};

var nextStat = cycle([ 'points', 'ppg', 'goalsScored', 'goalDiff' ]);

var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);


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




// ---------------------------------

function switchYStat() {
	// window.stat = nextStat();
	// document.title = stat;
	// initGraph( stat );
	// update( stat );
	// var t = svg1.transition().duration(transTime);
	// t.select(".y.axis").call( yAxe );
}

function dataReady() {
	window.data = _.map(teams, function (team) {
		var seasons = _(yearsRange).map(function (year) {
			var t   = team.seasons[year],
			    cpp = t.cost / t.currentPoints;
			return { year:year, cpp:cpp, cost:t.cost, points:t.currentPoints }
		});
		return seasons // { name:name, seasons:seasons }
	});

	// var max =  d3.max(teamArray, function (d){ return d[ currentize(stat) ] });
	// var min =  d3.min(teamArray, function (d){ return d[ currentize(stat) ] });

	// min = min > 0 ? 0 : min; //
	// max = max < 3 ? 3 : max; // hack for ppg

	x.domain([ 21, 300 ]).range([ margin.left, w ]);
	y.domain([ 40, 95 ]).range([ h, margin.bottom ]);



	var line = d3.svg.line()
	    .interpolate( 'monotone' ).tension(0.99)
	    .x(function(d, n) { return x(d.cost); })
	    .y(function(d, n) { return y(d.points) })


	window.lines = svg1.selectAll('path.line').data( data )	    


	// debugger;

	lines.enter()
		.append('path').attr("d", line).attr("class", "line").attr('stroke', function(d, n) {
         // return teams[ c[n] ].kit.base
       })
			.on("click", function(d, n) {
				console.log( c[n] );
				return false;
			});


	_.each(data, function(team) {
		var dots = svg1.selectAll("dot").data( team );

		 dots.enter().append("circle")
		     .attr("r", 1)
		     .attr("cx", function(d) { return x(d.cost); })
		     .attr("cy", function(d) { return y(d.points); })
	})

}


     // .on("click", function(d, n) {
    	//  console.log( teamArray[n].name );
    	//  return false;
     // })
     // .attr("transform", function(d, n) {
     // 		return "translate(0, " + (100 * n) + ')'
     // })
     // .attr('stroke-dasharray', function(d, n) { return 8*(n+1) + ',1' })





function initAxis () {
	xAxe.scale(x).ticks(7);
  yAxe.scale(y).orient("left").ticks(5);
	
	svg1.append("g")
	    .attr("class", "axis x")
	    // .text(function(d, i) { return monthNames[i]; })
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
  var line = d3.svg.line()
      .interpolate( interpols[stat] )
      .x(function(d) { return x(d.date); })
      .y(function(d, n) { return y(d[yStat]) });

  var w_line = d3.svg.line()
      .interpolate( 'linear' )
      .x(function(d) { return x(d.date); })
      .y(function(d, n) { return y('points') } );

  window.lines = svg1.selectAll('path.line').data( results );

  lines.enter().append('path').attr("d", line)
       .on("click", function(d, n) {
      	 console.log( teamArray[n].name );
      	 return false;
       })
       .attr("transform", function(d, n) {
       		return "translate(0, " + (100 * n) + ')'
       })
       // .attr('stroke-dasharray', function(d, n) { return 8*(n+1) + ',1' })
       .attr("class", "line")
       // .attr('stroke', function(d, n) {
       //   return teamArray[n].kit.base
       // });

  lines.transition().duration(transTime).attr("d", line);
  lines.exit().remove();






  


	// var dots = svg1.selectAll("dot").data( results[19] );

 //  dots.enter().append("circle")
 //      .attr("r", 1.5)
 //      .attr("cx", function(d) { return x(d.date); })
 //      .attr("cy", function(d) { return y(d[yStat]); })
 //      .on("mouseover", function(d) {      
 //          div.transition().duration(200).style("opacity", .9);
 //          div.html(d.result).style("left", (d3.event.pageX) + "px")
 //                            .style("top", (d3.event.pageY - 28) + "px");
 //          })
 //      .on("mouseout", function(d) {
 //          div.transition().duration(500).style("opacity", 0);
 //      });

	// dots.transition().duration(transTime)
	//     .attr("cx", function(d) { return x(d.date); })
 //      .attr("cy", function(d) { return y(d[yStat]); });

	// dots.exit().remove();



  window.short = svg1.selectAll('path.line-2').data( results );
  short.enter().append('path').attr("d", line)
       // .attr('stroke-dasharray', function(d, n) { return 8*(n+1) + ',1' })
       .attr("class", "line-2")
       .attr("transform", function(d, n) {
       	 return "translate(0, " + (20 * (20-n)) + ')'
       })

       // .attr('stroke', function(d, n) {
       //   return teamArray[n].kit.v
       // });
  short.transition().duration(transTime).attr("d", line);
  short.exit().remove();




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




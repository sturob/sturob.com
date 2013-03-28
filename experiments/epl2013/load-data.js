///////////////////
// Get data bit 
//////////////////

var teams = {};

var data_host = 'http://localhost:6969/football/';
var yearsRange = _.range(2003, 2012);

var yearAsGet = function (year) {
	var yearCSV = function (csv) {
		var yearData = d3.csv.parse( csv );
		loadSeason( year, yearData );
	};
	return $.get(data_host + year + '.csv').done( yearCSV ) 
}

var requests = yearsRange.map( yearAsGet );
requests.unshift( $.getJSON( data_host + 'spend-2000-10.json' ) );



// .apply() cos we're passing in an array not args (jquery is stoopid)
$.when.apply($, requests).then(function (requests, b) {
	var spendData = requests[0];
	_(spendData).each(function (club) {
		_.each(yearsRange, function (year) {
			var total_wages  = (club['total' + (year - 1)] - 0),
			    net_transfer = (club['net' + (year - 1)] - 0),
			    yearly_cost  = total_wages + net_transfer;

			if (isNaN(yearly_cost)) { cost = 0; }
			if (teams[ club.team ]) {
				teams[ club.team ].seasons[year].cost = yearly_cost;	
			}
		})
	});


	window.data = _.map(teams, function (team) {
		var seasons = _(yearsRange).map(function (year) {
			var t   = team.seasons[year],
			    cpp = t.cost / t.currentPoints;
			return { year:year, cpp:cpp, cost:t.cost, points:t.currentPoints }
		});
		return seasons // { name:name, seasons:seasons }
	});

	dataReady(); // some what hacky
})



function loadSeason(year, matches) {
	matches.forEach(function (match) { 
		populateTeamResults(match, year);
	}); // Matches -> Team + Results

	// club titles

	window.teamArray = _.chain(teams)
	                    .map(function (t) { return t })
	                    .sortBy(function (t) { return t.currentPoints })
	                    .value();

	return;

	window.results = _.map(teamArray, function (t, name) { 
		return t.results
	});
}

function populateTeamResults(match, year) {
	_.extend(match, Match);

	function saveResult(name) {
		var t = teams[name];
		if (! t) {
			teams[name] = t = new Team(name);
		}

		var season = t.seasons[year];

		season.currentPoints += match.points(name);
		season.currentGoalDiff += match.difference(name);
		season.currentGoalsScored += match.scored(name);
		season.currentPpg = season.currentPoints / (season.results.length + 1);

		season.results.push({
			date: new Date( match.date() ),
			result: match.toString(),
			ppg: season.currentPpg,
			goalDiff:  season.currentGoalDiff,
			points:    season.currentPoints,
			goalsScored: season.currentGoalsScored
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

var TeamProto = {
	setEmptySeasons: function (a, b) {
		var team = this;
		team.seasons = {};

		_.each( _.range(a, b), function (year) {
			team.seasons[year] = {
				results: [],
				currentPpg: 0,  currentPoints: 0,
				currentGoalDiff: 0,  currentGoalsScored: 0
			};
		})
	}
};

function Team(name){
	this.name = name;
	this.kit = Kits[name] ? Kits[name] : Kits.default;
	this.setEmptySeasons(2000, 2013);
};

Team.prototype = TeamProto;


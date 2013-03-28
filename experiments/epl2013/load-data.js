///////////////////
// Get data bit 
//////////////////

var teams = {},
		seasons = {};

var data_host = 'http://localhost:6969/football/';
var yearsRange = _.range(2003, 2012);

var yearAsGet = function (year) {
	var yearCSV = function (csv) {
		var matches = d3.csv.parse( csv );
		seasons[year] = new Season( matches, year );
	};
	return $.get(data_host + year + '.csv').done( yearCSV ) 
}

var requests = yearsRange.map( yearAsGet );
requests.unshift( $.getJSON( data_host + 'spend-2000-10.json' ) );

var mergeSpendingData = function(requests, b) {
	var spendData = requests[0];
	_.each(spendData, function (club) {
		_.each(yearsRange, function (year) {
			var total_wages  = (club['total' + (year - 1)] - 0);
			var net_transfer = (club['net' + (year - 1)] - 0);
			var yearly_cost  = total_wages + net_transfer;
			if (isNaN(yearly_cost)) { cost = 0; }
			if (teams[ club.team ]) {
				teams[ club.team ].seasons[year].cost = yearly_cost;	
			}
		})
	})
	dataReady();
}

// .apply() cos we're passing in an array not args (jquery is stoopid)
$.when.apply($, requests).then( mergeSpendingData );


// --------------------------------------
// Season Class
// --------------------------------------

var SeasonProto = {
	sorted: function() {}, // returns array sorted by position
	propagateResults: function() {
		var season = this;
		season.matches.forEach(function (match) { 
			Teams.propagateMatch(match, season.end);
		}); // Matches -> Team + Results
	}
}

function Season(matches, year){
	this.start = year - 1;
	this.end = year;
	this.matches = matches;
	this.propagateResults();
};

Season.prototype = SeasonProto;


var Teams = {
	propagateMatch: function(match, year) {
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
};

// --------------------------------------
// Team Class
// --------------------------------------

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


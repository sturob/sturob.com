// match mixin...
//  Div = League Division
//  Date = Match Date (dd/mm/yy)
//  HomeTeam = Home Team
//  AwayTeam = Away Team
//  FTHG = Full Time Home Team Goals
//  FTAG = Full Time Away Team Goals
//  FTR = Full Time Result (H=Home Win, D=Draw, A=Away Win)
//  HTHG = Half Time Home Team Goals
//  HTAG = Half Time Away Team Goals
//  HTR = Half Time Result (H=Home Win, D=Draw, A=Away Win)



var Match = {
	date: function() {
		var date = this.Date.split('/').reverse();
		date[0] = '20' + date[0];
		return date.join('-');
	},
	home: function (team) {
		return (this.HomeTeam == team)
	},
	away: function (team) {
		return (this.AwayTeam == team)
	},
	played: function (team) {
		return this.home(team) || this.away(team)
	},
	scored: function (team) {
		if (this.home(team)) return this.FTHG - 0;
		if (this.away(team)) return this.FTAG - 0;
	},
	opponent: function (team) {
		if (this.home(team)) return this.AwayTeam;
		if (this.away(team)) return this.HomeTeam;	
	},
	conceded: function (team) {
		if (this.home(team)) return this.FTAG - 0;
		if (this.away(team)) return this.FTHG - 0;
	},
	difference: function (team) {
		return this.scored(team) - this.conceded(team)
	},
	points: function (team) {
		if (this.played(team)) {
			var diff = this.difference(team);
			if (diff > 0) return 3;
			else if (diff < 0) return 0;
			else return 1;
		}
	},
	toString: function() {
		var score = this.HomeTeam + ' ' + this.FTHG + '-' + this.FTAG + ' ' + this.AwayTeam;
		return this.date() + ': ' + score;
	}
}
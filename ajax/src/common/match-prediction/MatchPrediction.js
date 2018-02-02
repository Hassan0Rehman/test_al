import React, { Component } from 'react';
import * as _ from 'lodash';
import AnimateHeight from 'react-animate-height';

class MatchPredictionApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchState: document.getElementsByClassName("match-prediction-data")[0].attributes["data-attr-ms"].value,
            visible: "",
            matchId: document.getElementsByClassName("match-prediction-data")[0].attributes["data-attr-id"].value,
            matchPredictionResult: []
        }
    }

    componentWillMount() {
        if (this.state.matchState == 0) {
            this.fetchData(this.state.matchId);
        } else {
            this.state.visible = "teams";
        }
    }

    clickHandler(teamId, matchId) {
        this.fetchData(matchId, teamId);
    }

    fetchData(matchId, teamId) {
        const self = this;
        const url = 'https://cig-prod-api.azurewebsites.net/api/polls/anonymoususer/submit';

        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
        myHeaders.append('content-type', 'application/json');
        var myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({
                matchId: matchId,
                teamId: teamId
            })
        };

        fetch(url, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (matchPrediction) {
                    self.setState({
                        visible: "graphs",
                        matchPredictionResult: matchPrediction
                    });
                });
            }
        })
    }

    fetchData(matchId) {
        const self = this;
        const url = 'http://cig-prod-api.azurewebsites.net/api/polls/match/' + matchId;

        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
        myHeaders.append('content-type', 'application/json');
        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        fetch(url, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (matchPrediction) {
                    self.setState({
                        visible: "graphs",
                        matchPredictionResult: matchPrediction
                    });
                });
            }
        })
    }

    render() {
        
        if (this.state.visible === "")
            return null;
        var team1Id, team1Title, team2Id, team2Title, matchId, team1Votes, team2Votes, getTemplate;
        const predictionResult = this.state.matchPredictionResult;
        const obj = document.getElementsByClassName("match-prediction-data");
        team1Id = obj[0].attributes['data-attr-team1Id'].value;
        team1Title = obj[0].attributes['data-attr-team1title'].value;
        team2Id = obj[0].attributes['data-attr-team2Id'].value;
        team2Title = obj[0].attributes['data-attr-team2title'].value;
        matchId = obj[0].attributes['data-attr-id'].value;


        if (this.state.visible === "teams") {
            getTemplate = <div className="match-report bg-white three-border">
                <div className="title">Match Prediction</div>
                <div className="pitch-summary" style={{ marginBottom: '0px' }}>
                    <div className="win-prediction">
                        <div className="team-flag" onClick={() => this.clickHandler(team1Id, matchId)}
                            style={{ backgroundImage: 'url(https://d7d7wuk1a7yus.cloudfront.net/team-images/100x100/' + team1Title.replace(/\s+/g, "").toLowerCase() + '.png)' }}>
                        </div>
                        <div className="team-name">{team1Title}</div>
                    </div>
                    <div className="prediction-vs">VS</div>
                    <div className="win-prediction">
                        <div className="team-flag" onClick={() => this.clickHandler(team2Id, matchId)}
                            style={{ backgroundImage: 'url(https://d7d7wuk1a7yus.cloudfront.net/team-images/100x100/' + team2Title.replace(/\s+/g, "").toLowerCase() + '.png)' }}>
                        </div>
                        <div className="team-name">{team2Title}</div>
                    </div>
                </div>
                <div className="prediction-text">
                    <p>Who will win this match?</p>
                </div>
            </div>
        } else if (this.state.visible === "graphs") {
            team1Votes = (predictionResult.t1v / predictionResult.tv) * 100;
            team2Votes = 100 - team1Votes;
            team1Votes = team1Votes.toFixed(1);
            team2Votes = team2Votes.toFixed(1);


            getTemplate = <div className="match-report bg-white three-border">
                <div className="title">Match Prediction</div><div className="prediction-chart">
                    <div className="bars">
                        <div className="bars-column">
                            <AnimateHeight
                                duration={500}
                                height={'auto'}>
                                <div className="bar" style={{ height: team1Votes + '%' }}>
                                    <p> {team1Votes} % </p>
                                </div>
                            </AnimateHeight>
                            <div className="team-name"> {team1Title} </div>
                        </div>
                        <div className="bars-column left">
                            <div className="bar" style={{ height: team2Votes + '%' }}>
                                <AnimateHeight
                                    duration={1000}
                                    height={'auto'}>
                                    <p> {team2Votes}% </p>
                                </AnimateHeight>
                            </div>
                            <div className="team-name"> {team2Title} </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        return (
            getTemplate
        );
    }
}

export default MatchPredictionApp;

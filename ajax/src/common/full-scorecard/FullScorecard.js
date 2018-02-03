import React, { Component } from 'react';
import * as _ from 'lodash';
import MatchCalculator from '../states-calculator/states-Calculator';

class FullScoreCardApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
        innings: {
            in: []
        }
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    const self = this;
    const apis = ['https://cig-prod-api.azurewebsites.net/api/matches/' + self.props.id + '/fullscorecard'];
    const url = apis[0];
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
    myHeaders.append('content-type', 'application/json');

    var myInit = { 
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default' 
    };

    fetch(url, myInit).then(function(response) {
        if (response.status === 200) {
            response.json().then(function(fullScorecard) {
                self.setState({
                    innings: self.mapScoreCard(fullScorecard)
                });
            });
        }  
    });
  }

  mapScoreCard(fullScorecard) {
    _.each(_.reverse(fullScorecard.in), function(inningScore) {
        let batsman = [], bowlers = [];
        _.map(inningScore, function(value, key) {
            if (_.get(value, 'Id')) {
                _.get(value, 'ov') === null || _.get(value, 'ov') === '' ? batsman.push(value) : bowlers.push(value);
                _.omit(inningScore, key);
            }
        });
        _.set(inningScore, 'bowlers', bowlers);
        _.set(inningScore, 'batsman', batsman);
    });
    return fullScorecard;
  }

  render() {
    const inningTitles = ['IST INNINGS', '2ND INNINGS', '3RD INNINGS', '4TH INNINGS'];

    return (
        <div className="action-tabs">
            <div className="bg-white" style={{paddingTop: '10px'}}>
                {this.state.innings.in.map((inning, i) => {
                    return (
                        <div key={i+1} className="full-scorecard">
                            <div className="inning-title">
                                { inningTitles[this.state.innings.in.length - (i+1)] }
                            </div>
                            <div className="team-row">
                                <div className="team-row">
                                    {i % 2 === 0 && <img className="" id="sc-team-flag" 
                                        src={"https://d7d7wuk1a7yus.cloudfront.net/team-images/100x100/" + this.state.innings.t1.t.replace(/\s+/g, '').toLowerCase() + ".png"} 
                                        width="50"/>}
                                    {i % 2 !== 0 && <img className="" id="sc-team-flag" 
                                        src={"https://d7d7wuk1a7yus.cloudfront.net/team-images/100x100/" + this.state.innings.t2.t.replace(/\s+/g, '').toLowerCase() + ".png"} 
                                        width="50"/>}
                                    <div className="team-title">{ i % 2 === 0 ? this.state.innings.t1.t : this.state.innings.t2.t }</div>    
                                </div>
                                <div>Run Rate { MatchCalculator.calculateRR(inning.ov, inning.ts)}</div>                                
                            </div>
                            <div className="player-scores">
                                <div className="sc-header">
                                    <div className="sc-category-1">BATTING</div>
                                    <div className="sc-category-inning">R</div>
                                    <div className="sc-category-inning">B</div>
                                    <div className="sc-category-inning">4</div>
                                    <div className="sc-category-inning">6</div>
                                    <div className="sc-category-inning">SR</div>
                                </div>
                                <div>
                                    {inning.batsman.map((indBatsman, batsmanIndex) => {
                                        return(
                                            <div className="sc-values margin-15" key={ batsmanIndex + 1 }>
                                                <div className="sc-player-1">
                                                    { indBatsman.pl1.fn }
                                                    <div className="player-status">
                                                        { indBatsman.ho }
                                                    </div>
                                                </div>
                                                <div className="sc-category-inning">
                                                    { indBatsman.ru }
                                                </div>
                                                <div className="sc-category-inning">
                                                    { indBatsman.b }
                                                </div>
                                                <div className="sc-category-inning">
                                                    { indBatsman.f }
                                                </div>
                                                <div className="sc-category-inning">
                                                    { indBatsman.s }
                                                </div>
                                                <div className="sc-category-inning">
                                                    {MatchCalculator.CalculateSR(indBatsman.b, indBatsman.ru) }
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="sc-header">
                                    <div className="sc-category-1">TOTAL</div>
                                    <div className="sc-category-inning">{ inning.ts }</div>
                                </div>
                                <div className="player-scores inning-bowling">
                                    <div className="sc-header">
                                        <div className="sc-category-1">BOWLING</div>
                                        <div className="sc-category-inning">O</div>
                                        <div className="sc-category-inning">R</div>
                                        <div className="sc-category-inning">M</div>
                                        <div className="sc-category-inning">W</div>
                                        <div className="sc-category-inning">ECON</div>
                                    </div>
                                    <div>
                                        {inning.bowlers.map((ingBowler, bowlerIndex) => {
                                            return(
                                                <div className="sc-values" key={ bowlerIndex + 1 }>
                                                    <div className="sc-player-1">
                                                        { ingBowler.pl1.fn }
                                                    </div>
                                                    <div className="sc-category-inning">
                                                        { ingBowler.ov }
                                                    </div>
                                                    <div className="sc-category-inning">
                                                        { ingBowler.rc }
                                                    </div>
                                                    <div className="sc-category-inning">
                                                        { ingBowler.m }
                                                    </div>
                                                    <div className="sc-category-inning">
                                                        { ingBowler.w }
                                                    </div>
                                                    <div className="sc-category-inning">
                                                        { MatchCalculator.CalculateEcon(ingBowler.ov, ingBowler.rc) }
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>    
                                </div>
                            </div>
                        </div>    
                    );
                })}
            </div>
        </div>
    );
  }
}

export default FullScoreCardApp;

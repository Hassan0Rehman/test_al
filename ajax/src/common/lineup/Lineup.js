import React, { Component } from 'react';
import * as _ from 'lodash';

class LineupApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
        players: []
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    const self = this;
    const apis = ['https://cig-prod-api.azurewebsites.net/api/matches/inns/' + self.props.id + '/players'];
    // const apis = ['https://cig-prod-api.azurewebsites.net/api/matches/inns/16629/players'];
    const url = apis[0];
    let myHeaders = new Headers();
    
    myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
    // myHeaders.append('Authorization', 'Token HHiQLYvZnkGqfD5xzxr/Sw');
    myHeaders.append('content-type', 'application/json');

    var myInit = { 
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default' 
    };

    fetch(url, myInit).then(function(response) {
        if (response.status === 200) {
            response.json().then(function(allPlayers) {
                self.setState({
                    players: self.mapTeamSquads(allPlayers)
                });
            });
        }  
    });
  }

  mapTeamSquads(allPlayers) {
    const team1 = _.slice(allPlayers, 0, 16);
    const team2 = _.slice(allPlayers, 16, allPlayers.length);
    return [{
        playing: _.chunk(_.filter(team1, {ia: true}), 2), 
        notPlaying: _.chunk(_.filter(team1, {ia: false}), 4),
        captain: _.filter(team1, { ic: 1 }),
        name: document.getElementsByClassName("match-prediction-data")[0].attributes['data-attr-team1title'].value
    }, {
        playing: _.chunk(_.filter(team2, {ia: true}), 2), 
        notPlaying: _.chunk(_.filter(team2, {ia: false}), 4),
        captain: _.filter(team2, { ic: 1 }),
        name: document.getElementsByClassName("match-prediction-data")[0].attributes['data-attr-team2title'].value
    }];
  }

  render() {
    if (_.isEmpty(this.state.players)) return null;

    return (
        <div className="action-tabs">
            <div className="bg-white" style={{paddingTop: '10px'}}>
                <div className="full-scorecard">
                    {this.state.players.map((squad, teamIndex) => {
                        return (
                            <div key={ teamIndex }>
                                <div className="squad-name">{ squad.name }</div>
                                <div className="squad-row">
                                    <div className="squad-column">
                                        {squad.playing.map((player, playerIndex) => {
                                            return (
                                                <div key={ playerIndex } className="squad-row">
                                                    <div className="squad-player">
                                                        <img className="squad-player-image" src={'https://d7d7wuk1a7yus.cloudfront.net/player-images/' + player[0].pid + '.png'} /> 
                                                        <div>
                                                            <div className="player-name">{player[0].n}</div>
                                                            <div className="player-department">{player[0].d}</div>
                                                        </div>
                                                    </div>
                                                    { player.length > 1 &&
                                                        <div className="squad-player">
                                                            <img className="squad-player-image" src={'https://d7d7wuk1a7yus.cloudfront.net/player-images/' + player[1].pid + '.png'} /> 
                                                            <div>
                                                                <div className="player-name">{player[1].n}</div>
                                                                <div className="player-department">{player[1].d}</div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>                
                                            );
                                        })}
                                    </div>
                                    <div className="squad-column" style={{width: '40%'}}>
                                        {squad.captain.map((captain, captainIndex) => {
                                            return (
                                                <div key={ captainIndex } className="squad-row">
                                                    <div className="squad-player captain">
                                                    <img className="squad-player-image" src={'https://d7d7wuk1a7yus.cloudfront.net/player-images/' + captain.pid + '.png'} /> 
                                                        <div>
                                                            <div className="player-name captain">{ captain.n }(Capt.)</div>
                                                            <div className="player-department captain">{ captain.d }</div>
                                                        </div>
                                                    </div>
                                                </div>                
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                <div key={ teamIndex + 'not' } className="squad-not-playing">
                                    <div className="not-playing-heading">NOT PLAYING</div>
                                    {squad.notPlaying.map((player, playerIndex) => {
                                        return (
                                            <div key={ playerIndex + 'not' } className="squad-row">
                                                <div className="squad-player">
                                                    <img className="squad-player-image" src={'https://d7d7wuk1a7yus.cloudfront.net/player-images/' + player[0].pid + '.png'} />
                                                    <div>
                                                        <div className="player-name">{player[0].n}</div>
                                                        <div className="player-department">{player[0].d}</div>
                                                    </div>
                                                </div>
                                                { player.length > 1 &&
                                                    <div className="squad-player">
                                                        <img className="squad-player-image" src={'https://d7d7wuk1a7yus.cloudfront.net/player-images/' + player[1].pid + '.png'} />
                                                        <div>
                                                            <div className="player-name">{player[1].n}</div>
                                                            <div className="player-department">{player[1].d}</div>
                                                        </div>
                                                    </div>
                                                }
                                                { player.length > 2 &&
                                                    <div className="squad-player">
                                                        <img className="squad-player-image" src={'https://d7d7wuk1a7yus.cloudfront.net/player-images/' + player[2].pid + '.png'} />
                                                        <div>
                                                            <div className="player-name">{player[2].n}</div>
                                                            <div className="player-department">{player[2].d}</div>
                                                        </div>
                                                    </div>
                                                }
                                                { player.length > 3 &&
                                                    <div className="squad-player">
                                                        <img className="squad-player-image" src={'https://d7d7wuk1a7yus.cloudfront.net/player-images/' + player[3].pid + '.png'} />
                                                        <div>
                                                            <div className="player-name">{player[3].n}</div>
                                                            <div className="player-department">{player[3].d}</div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>                
                                        );
                                    })}
                                </div>
                            </div>            
                        );
                    })}
                </div>
            </div>
        </div>
    );
  }
}

export default LineupApp;

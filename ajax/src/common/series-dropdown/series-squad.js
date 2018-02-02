import React, { Component } from 'react';
import * as _ from 'lodash';
import LazyLoad from 'react-lazyload';

let TeamName, TeamsResult;
class SeriesSquad extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            seriesId: this.props.seriesId,
            teams: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/series/' + this.props.seriesId + '/teams'];
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

        fetch(url, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    TeamsResult = response;
                    self.fetchTeams(response[0].Id);
                });
            }
        })
    }

    fetchTeams(teamId) {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/tours/series/' + this.props.seriesId + '/team/' + teamId + '/squad'];
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

        fetch(url, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    TeamName = _.get(_.find(TeamsResult, {Id: teamId}), 't');
                    self.setState({
                        teams: response
                    });
                });
            }
        })
    }

    render() {
        if (this.state.teams.length == 0 && (TeamsResult ==  undefined || TeamsResult.length == 0))
            return null;
        let template = null;    
        if (this.state.teams.length > 0) {
            template = this.state.teams.map((team, i) => {
                return (
                    <div className="squad-row" key={i + 1}>
                        <div className="squad-order">{i + 1}</div>
                        <div className="squad-pic">
                            {<LazyLoad height={35}><img className="rounded" height="35" width="35" src={"https://d7d7wuk1a7yus.cloudfront.net/player-images/" + team.Id + ".png"} /></LazyLoad>}
                        </div>
                        <div>
                            <div className="squad-name">{team.n}</div>
                            <div className="squad-description">{team.d}</div>
                        </div>
                    </div>
                );
            })
        } else {
            template = <div className="Squad-text"><h4>Ye to be announced</h4></div>
        }
        return (
            <div>   
                <div className="inline-block pull-right">
                    <div className="dropdown">
                        <div className="dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">
                            <div className="three-dots"></div>
                        </div>
                        <ul className="dropdown-menu">
                            {TeamsResult.map((team, i) => {
                                return (
                                    <li key={team.Id} onClick={() => this.fetchTeams(team.Id)}>
                                        <a className={"teamId" + team.Id}>{team.t}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="copy-text">
                    <p className="no-margin-bottom team-test-title">{TeamName}</p>
                </div>
                <div className="teams-squad">
                    { template }
                </div>
            </div>
        )
    }
}

export default SeriesSquad;

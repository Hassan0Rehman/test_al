import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import * as _ from 'lodash';

class RankingsApp extends Component {
  constructor(props) {
    super(props);
    const self = this;
    this.isTeamRanking = props.rankingType === 'Team Rankings' ? true : false;
    this.state = {
      filterName: self.isTeamRanking ? props.options[0].name+' Teams' : props.options[0].name,
      filterValue: props.options[0].value,
      teams: []
    };
  }

  componentDidMount() {
    this.fetchData(1);
  }

  fetchData(index) {
    const self = this;
    const apis = ['https://cig-prod-api.azurewebsites.net/api/rankings/team/type/',
    'https://cig-prod-api.azurewebsites.net/api/rankings/player/type/'];
    const url = self.isTeamRanking ? apis[0] : apis[1];
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
    myHeaders.append('content-type', 'application/json');

    var myInit = { 
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default' 
    };

    fetch(url+index, myInit).then(function(response) {
      if (response.status === 200) {
        response.json().then(function(ranked) {
          const arr = ranked;
          const selected = _.get(_.find(self.props.options, {value: index}), 'name');
          if (self.isTeamRanking)
            document.getElementById('team-rankings-server').style.display = "none";
          else
            document.getElementById('player-rankings-server').style.display = "none";
          
          self.setState({
            filterName: self.isTeamRanking ? selected+" Teams" : selected,
            filterValue: _.get(_.find(self.props.options, {value: index}), 'value'),
            teams: arr
          });
        });
      }  
    })
  }

  render() {
    return (
      <div>
        {this.state.teams.length > 0 && <div className="rankings-header">
          <div className="rankings-title inline-block">
            <h4 className="detail-text">
              <p className="no-margin-bottom">{this.props.rankingType}</p>
            </h4>
            <div className="copy-text">
              <p className="team-rank-title">ICC's Top 10 {this.state.filterName}</p>
            </div>
          </div>
          <div className="rankings-dropdown inline-block pull-right">
            <div className="dropdown">
              <div className="dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">
                  <div className="three-dots"></div>
              </div>
              <ul className="dropdown-menu">
                  {this.props.options.map((option, i) => {
                    return (<li key={i} onClick={() => this.fetchData(option.value)}>
                        <a>{option.name}</a>
                    </li>);
                  })}
              </ul>
            </div>
          </div>
        </div>}
        <div className="ranked-teams">
          {this.state.teams.map((team, i) => {
            return(
              <div className="team-row" key={i+1}>
                <div className="team-order">{i+1}</div>
                <div className="team-flag">
                  {this.isTeamRanking && <div height="25" width="30" className={"sprite-" + team.tt.replace(/\s+/g, '').toLowerCase()}></div>}
                  {!this.isTeamRanking && <LazyLoad height={35}><img className="rounded" height="35" width="35" src={"https://d7d7wuk1a7yus.cloudfront.net/player-images/" + team.pi + ".png"} /></LazyLoad>}
                </div>
                <div className="team-name">{this.isTeamRanking ? team.tt : team.pn}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default RankingsApp;

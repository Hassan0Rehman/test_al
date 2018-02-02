import React, { Component } from 'react';
import * as _ from 'lodash';

class MatchDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchesList: [
        {title: 'Recently Finished', matches: []},        
        {title: 'Live Cricket', matches: []},
        {title: 'Upcoming Matches', matches: []}
      ]
    };
  }

  componentDidMount() {
    const self = this;
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Token 5EjwJuor9EyhvdLZaNcYpw');
    myHeaders.append('content-type', 'application/json');

    var myInit = { 
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default' 
    };

    fetch('https://cig-staging-api.azurewebsites.net/api/schedules/widget', myInit).then(function(response) {
      if (response.status === 200) {
        response.json().then(function(matchesList) {
          if (matchesList.length > 0) {
            let matchesChunk = [
                {title: 'Live Cricket', matches: []},
                {title: 'Upcoming Matches', matches: []},
                {title: 'Recently Finished', matches: []}
            ]
            _.each(matchesList, function(match) {
              if (match.ms === 0) matchesChunk[0].matches.push(match)
              else if (match.ms === 1) matchesChunk[1].matches.push(match)
              else if (match.ms === 2) matchesChunk[2].matches.push(match)  
            });
            console.log(matchesChunk);
            self.setState({matchesList: matchesChunk});
            console.log(self.state);
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="right-widget">
        {this.state.matchesList.map((category, index) => {
          return (<div className="recently-finished" key={index}>
            <div className="today-match-heading bg-color-green">
              <p>{category.title}</p>
            </div>
            {category.matches.map((match, i) => {
              return (<a className="anchorcolor" href="/match/{match.mid}" key={match.mid+'-'+index}>
                <div className="match-container">
                  <div className="match-score-inner match-score-inner-edit">
                    <div className="mc-top-container mc-top-container-edit">
                      <div className="match-headline">
                        {index <= 0 && <p className="truncate-text">{match.mr}</p>}
                        {index > 0 && <p className="truncate-text">{match.mh + ' ' + match.ml}</p>}
                      </div>
                      <div className={index === 0 ? "live-tag" : ""}>
                        {index === 0 && <p>Live</p>}
                        {index === 2 && <p className="completed-text">Completed</p>}
                      </div>
                    </div>
                    <div className="match-score-container match-score-container-edit">
                      <div className="team-one-container text-align-left team-one-container-edit">
                        <div className="flag-and-name">
                          <div>
                            <img src={"/optimized/"+match.t1t.replace(/\s+/g, '').toLowerCase()+".jpg"}/>
                            <span>{match.t1n}</span>
                          </div>
                          {index <= 0 && 
                            <div className="score-and-overs">
                                {match.t1i1s + ' ( ' + match.t1i1o + ' )'}
                            </div>
                          }
                        </div>
                      </div>
                      <div className="versus-container-parent">
                        <div className="vs-text versus-container versus-container vs-left">
                          <span>vs</span>
                        </div>
                      </div>
                      <div className="team-two-container text-align-right team-two-container-edit">
                        <div className="flag-and-name">
                          <div>
                            <span className="margin-right-5">{match.t2n}</span>
                            <img src={"/optimized/"+match.t2t.replace(/\s+/g, '').toLowerCase()+".jpg"}/>
                          </div>
                          {index <= 0 && 
                            <p className="score-and-overs">
                                {match.t2i1s + ' ( ' + match.t2i1o + ' )'}
                            </p>
                          }
                        </div>
                      </div>
                    </div>
                    {index === 1 && 
                      <p className="msc-center-text padding-top-5">
                        {match.md}
                      </p>
                    }
                  </div>
                </div>
              </a>);
            })}
          </div>)
        })}
      </div>
    );
  }

  handleClick(i) {
    this.setState({selected: i});
  }
}

export default MatchDetails;

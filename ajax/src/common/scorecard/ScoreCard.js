import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import RunRateCalculator from '../states-calculator/states-Calculator';
import shortScoreCardService from '../../match-page/pusher-service/short-scorecard';
import * as _ from 'lodash';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import Timer from '../../common/timer/Timer';
import Tabs from '../../common/tabs/Tabs';


class ScoreCardApp extends Component {
  constructor(props) {
    super(props);
    this.scKey = 0;
    this.state = {
      scores: {},
      secondsRemaining: 0
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    const self = this;
    const apis = ['https://cig-prod-api.azurewebsites.net/api/matches/' + self.props.id + '/shortscorecard'];
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
        response.json().then(function (shortScorecard) {
          document.getElementById('schort-sc-temp').style.display = "none";
          shortScoreCardService.subscribeShortScoreCard(self.updateScorecard.bind(self));
          self.updateScorecard(shortScorecard);
        });
      }
    })
  }

  updateScorecard(shortScorecard) {
    this.setState({
      scores: shortScorecard
    });
  }

  next() { this.reactSwipe.next() }

  prev() { this.reactSwipe.prev() }


  tick() {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1000});
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
    }
  };

  render() {
    const _sCard = this.state.scores; var latestScore, latestOvers;
    if (_.isEmpty(_sCard)) {
      return null;
    }

    // Live match
    if (_sCard.sm.ms == 1 || _sCard.sm.ms == 0) {
      if (_sCard.bt == _sCard.sm.t1i) {
        if (_sCard.sm.t1i2s !== "") {
          latestScore = _sCard.sm.t1i1s.split('/')[0];
          latestOvers = _sCard.sm.t1i1o;
        } else {
          latestScore = _sCard.sm.t1i1s.split('/')[0];
          latestOvers = _sCard.sm.t1i1o;
        }

      }
      else if (_sCard.bt == _sCard.sm.t2i) {
        if (_sCard.sm.t2i2s !== "") {
          latestScore = _sCard.sm.t2i2s.split('/')[0];
          latestOvers = _sCard.sm.t2i2o;
        } else {
          latestScore = _sCard.sm.t2i1s.split('/')[0];
          latestOvers = _sCard.sm.t2i1o;
        }
      }

      const swipeOptions = {
        startSlide: 0,
        auto: 0,
        speed: 300,
        disableScroll: false,
        continuous: true
      }, isDesktop = window.innerWidth >= 767;
      let template = null;
      if (!isDesktop) {
        template = <ReactSwipe className="carousel" key={this.scKey++} ref={reactSwipe => this.reactSwipe = reactSwipe} swipeOptions={swipeOptions}>
          <div className="team-scores">
            <div className="short-sc-container">
              <div className="match-summary">
                <div className="teams">
                  <div className="team-1">
                    <div className={"sprite-" + _sCard.sm.t1t.replace(/\s+/g, '').toLowerCase()}></div>&nbsp;&nbsp;
                              <div className="team-name">{_sCard.sm.t1n}</div>
                  </div>
                  <div className="vs-text">VS</div>
                  <div className="team-2">
                    <div className="team-name">{_sCard.sm.t2n}</div>&nbsp;&nbsp;
                              <div className={"sprite-" + _sCard.sm.t2t.replace(/\s+/g, '').toLowerCase()}></div>
                  </div>
                </div>
                <div className="teams scoring">
                  <div className="team-1 team-scores">
                    {_sCard.sm.mt === 'Test' ? (
                      <div>
                        {(_sCard.sm.t1i2s === '') ? (
                          <div>
                            <div className="latest-score">
                              {_sCard.sm.t1i1s}
                            </div>
                            <div className="latest-overs" style={{textAlign: 'right'}}>
                              {_sCard.sm.t1i1o + ' overs'}
                            </div>
                          </div>  
                        ) : (
                          <div>
                            <div className="latest-score">
                              {_sCard.sm.t1i2s}
                            </div>
                            <div className="latest-overs" style={{textAlign: 'right'}}>
                              {_sCard.sm.t1i2o + ' overs'}
                            </div>
                            <div className="first-innings" style={{textAlign: 'right'}}>
                              {_sCard.sm.t1i1s + '(' + _sCard.sm.t1i1o + ')'}
                            </div>
                          </div> 
                        )}
                      </div>
                    ) : (
                        <div>
                          <div className="latest-score">
                            {_sCard.sm.t1i1s}
                          </div>
                          <div className="latest-overs" style={{textAlign: 'right'}}>
                            {_sCard.sm.t1i1o + ' overs'}
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="no-cont"></div>
                  <div className="team-2 team-scores">
                    {_sCard.sm.mt === 'Test' ? (
                      <div>
                          {(_sCard.sm.t2i2s === '') ? (
                            <div>
                              <div className="latest-score">
                                {_sCard.sm.t2i1s}
                              </div>
                              <div className="latest-overs">
                                {_sCard.sm.t2i1o + ' overs'}
                              </div>
                            </div>  
                          ) : (
                            <div>
                              <div className="latest-score">
                                {_sCard.sm.t2i2s}
                              </div>
                              <div className="latest-overs">
                                {_sCard.sm.t2i2o} overs
                              </div>
                              <div className="first-innings">
                                {_sCard.sm.t2i1s + '(' + _sCard.sm.t2i1o + ')'}
                              </div>
                            </div> 
                          )}
                      </div>
                    ) : (
                        <div>
                          <div className="latest-score" id="t2s">
                            {_sCard.sm.t2i1s}
                          </div>
                          <div className="latest-overs" id="t2o">
                            {_sCard.sm.t2i1o} overs
                              </div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="game-name">
                { _sCard.sm.mh + ' ' + _sCard.sm.ml + "  "} {_sCard.sm.ms == 1 ? "LIVE NOW" : "" }
                </div>
                <div className="latest-sr" id="runRate">RR: {RunRateCalculator.calculateRR(latestOvers, latestScore)}</div>
              </div>
            </div>
          </div>
          <div className="player-scores">
            <div className="player-scores-container">
              <div className="sc-header">
                <div className="sc-category-1">Batsman</div>
                <div className="sc-category">R</div>
                <div className="sc-category">B</div>
                <div className="sc-category">4</div>
                <div className="sc-category">6</div>
                <div className="sc-category">SR</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.b1n}</div>
                <div className="sc-player">{_sCard.b1r}</div>
                <div className="sc-player">{_sCard.bt1b}</div>
                <div className="sc-player">{_sCard.b14s}</div>
                <div className="sc-player">{_sCard.b16s}</div>
                <div className="sc-player">{RunRateCalculator.CalculateSR(_sCard.bt1b, _sCard.b1r)}</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.bt2n}</div>
                <div className="sc-player">{_sCard.bt2r}</div>
                <div className="sc-player">{_sCard.bt2b}</div>
                <div className="sc-player">{_sCard.bt24s}</div>
                <div className="sc-player">{_sCard.bt26s}</div>
                <div className="sc-player">{RunRateCalculator.CalculateSR(_sCard.bt2b, _sCard.b2r)}</div>
              </div>
              <div className="sc-header">
                <div className="sc-category-1">Bowler</div>
                <div className="sc-category">O</div>
                <div className="sc-category">M</div>
                <div className="sc-category">R</div>
                <div className="sc-category">W</div>
                <div className="sc-category">EC</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.bw1n}</div>
                <div className="sc-player">{_sCard.bw1o}</div>
                <div className="sc-player">{_sCard.bw1m}</div>
                <div className="sc-player">{_sCard.bw1r}</div>
                <div className="sc-player">{_sCard.bw1w}</div>
                <div className="sc-player">{RunRateCalculator.CalculateEcon(_sCard.bw1o, _sCard.bw1r)}</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.b2n}</div>
                <div className="sc-player">{_sCard.b2o}</div>
                <div className="sc-player">{_sCard.b2m}</div>
                <div className="sc-player">{_sCard.b2r}</div>
                <div className="sc-player">{_sCard.b2w}</div>
                <div className="sc-player">{RunRateCalculator.CalculateEcon(_sCard.b2o, _sCard.b2r)}</div>
              </div>
            </div>
          </div>
        </ReactSwipe>
      } else {
        template = <div><div className="team-scores">
          <div className="short-sc-container">
            <div className="match-summary">
              <div className="teams">
                <div className="team-1">
                  <div className={"sprite-" + _sCard.sm.t1t.replace(/\s+/g, '').toLowerCase()}></div>&nbsp;&nbsp;
                  <div className="team-name">{_sCard.sm.t1n}</div>
                </div>
                <div className="vs-text">VS</div>
                <div className="team-2">
                  <div className="team-name">{_sCard.sm.t2n}</div>&nbsp;&nbsp;
                  <div className={"sprite-" + _sCard.sm.t2t.replace(/\s+/g, '').toLowerCase()}></div>
                </div>
              </div>
              <div className="teams scoring">
                <div className="team-1 team-scores">
                  {_sCard.sm.mt === 'Test' ? (
                    <div>
                      {(_sCard.sm.t1i2s === '') ? (
                        <div>
                          <div className="latest-score">
                            {_sCard.sm.t1i1s}
                          </div>
                          <div className="latest-overs" style={{textAlign: 'right'}}>
                            {_sCard.sm.t1i1o + ' overs'}
                          </div>
                        </div>  
                      ) : (
                        <div>
                          <div className="latest-score">
                            {_sCard.sm.t1i2s}
                          </div>
                          <div className="latest-overs" style={{textAlign: 'right'}}>
                            {_sCard.sm.t1i2o + ' overs'}
                          </div>
                          <div className="first-innings" style={{textAlign: 'right'}}>
                            {_sCard.sm.t1i1s + '(' + _sCard.sm.t1i1o + ')'}
                          </div>
                        </div> 
                      )}
                    </div>
                  ) : (
                      <div>
                        <div className="latest-score">
                          {_sCard.sm.t1i1s}
                        </div>
                        <div className="latest-overs" style={{textAlign: 'right'}}>
                          {_sCard.sm.t1i1o + ' overs'}
                        </div>
                      </div>
                    )}
                </div>
                <div className="no-cont"></div>
                <div className="team-2 team-scores">
                  {_sCard.sm.mt === 'Test' ? (
                    <div>
                        {(_sCard.sm.t2i2s === '') ? (
                          <div>
                            <div className="latest-score">
                              {_sCard.sm.t2i1s}
                            </div>
                            <div className="latest-overs">
                              {_sCard.sm.t2i1o + ' overs'}
                            </div>
                          </div>  
                        ) : (
                          <div>
                            <div className="latest-score">
                              {_sCard.sm.t2i2s}
                            </div>
                            <div className="latest-overs">
                              {_sCard.sm.t2i2o} overs
                            </div>
                            <div className="first-innings">
                              {_sCard.sm.t2i1s + '(' + _sCard.sm.t2i1o + ')'}
                            </div>
                          </div> 
                        )}
                    </div>
                  ) : (
                      <div>
                        <div className="latest-score" id="t2s">
                          {_sCard.sm.t2i1s}
                        </div>
                        <div className="latest-overs" id="t2o">
                          {_sCard.sm.t2i1o} overs
                            </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="game-name">
                {_sCard.sm.mh + ' ' + _sCard.sm.ml}
              </div>
              <div className="latest-sr" id="runRate">RR: {RunRateCalculator.calculateRR(latestOvers, latestScore)}</div>
            </div>
          </div>
        </div>
          <div className="player-scores">
            <div className="player-scores-container">
              <div className="sc-header">
                <div className="sc-category-1">Batsman</div>
                <div className="sc-category">R</div>
                <div className="sc-category">B</div>
                <div className="sc-category">4</div>
                <div className="sc-category">6</div>
                <div className="sc-category">SR</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.b1n}</div>
                <div className="sc-player">{_sCard.b1r}</div>
                <div className="sc-player">{_sCard.bt1b}</div>
                <div className="sc-player">{_sCard.b14s}</div>
                <div className="sc-player">{_sCard.b16s}</div>
                <div className="sc-player">{RunRateCalculator.CalculateSR(_sCard.bt1b, _sCard.b1r)}</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.bt2n}</div>
                <div className="sc-player">{_sCard.bt2r}</div>
                <div className="sc-player">{_sCard.bt2b}</div>
                <div className="sc-player">{_sCard.bt24s}</div>
                <div className="sc-player">{_sCard.bt26s}</div>
                <div className="sc-player">{RunRateCalculator.CalculateSR(_sCard.bt2b, _sCard.bt2r)}</div>
              </div>
              <div className="sc-header">
                <div className="sc-category-1">Bowler</div>
                <div className="sc-category">O</div>
                <div className="sc-category">M</div>
                <div className="sc-category">R</div>
                <div className="sc-category">W</div>
                <div className="sc-category">EC</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.bw1n}</div>
                <div className="sc-player">{_sCard.bw1o}</div>
                <div className="sc-player">{_sCard.bw1m}</div>
                <div className="sc-player">{_sCard.bw1r}</div>
                <div className="sc-player">{_sCard.bw1w}</div>
                <div className="sc-player">{RunRateCalculator.CalculateEcon(_sCard.bw1o, _sCard.bw1r)}</div>
              </div>
              <div className="sc-values">
                <div className="sc-player-1">{_sCard.b2n}</div>
                <div className="sc-player">{_sCard.b2o}</div>
                <div className="sc-player">{_sCard.b2m}</div>
                <div className="sc-player">{_sCard.b2r}</div>
                <div className="sc-player">{_sCard.b2w}</div>
                <div className="sc-player">{RunRateCalculator.CalculateEcon(_sCard.b2o, _sCard.b2r)}</div>
              </div>
            </div>
          </div></div>
      }
      return (
        <div className="short-sc-wrap">
          {!isDesktop && <div className="carousal left" onClick={this.prev.bind(this)}></div>}
          {!isDesktop && <div className="carousal right" onClick={this.next.bind(this)}></div>}
          {template}
        </div>
      );
    } else if (_sCard.sm.ms == 2) {  // Upcoming Match
      var matchDateInSeconds = new Date(_sCard.sm.md + " " + _sCard.sm.mti + " GMT").valueOf();
      document.getElementById("match-overview").style.display = "block";
      return (
        <div className="short-sc-wrap">
          <div className="team-scores">
          <div className="short-sc-container">
            <div className="match-summary">
              <div className="teams">
                <div className="team-1">
                  <div className={"sprite-" + _sCard.sm.t1t.replace(/\s+/g, '').toLowerCase()}></div>&nbsp;&nbsp;
                        <div className="team-name">{_sCard.sm.t1n}</div>
                </div>
                <div className="vs-text">VS</div>
                <div className="team-2">
                  <div className="team-name">{_sCard.sm.t2n}</div>&nbsp;&nbsp;
                        <div className={"sprite-" + _sCard.sm.t2t.replace(/\s+/g, '').toLowerCase()}></div>
                </div>
              </div>
              <div className="teams scoring" style={{justifyContent: 'center'}}>
                <div id="match-timer">{<Timer secondsRemaining={matchDateInSeconds} />}</div>
              </div>
              <div className="game-name"  style={{ marginTop: '20px'}}>
                {_sCard.sm.mh + ' ' + _sCard.sm.ml}
              </div>
            </div>
          </div>
        </div>
        </div>
      );
    }
  }
}

export default ScoreCardApp;

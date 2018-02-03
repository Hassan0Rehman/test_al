import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import OverDetail from '../over-detail/OverDetail';
import { Scrollbars } from 'react-custom-scrollbars';
import shortScoreCardService from '../../match-page/pusher-service/short-scorecard';
import * as _ from 'lodash';
// import { setTimeout } from 'timers';

class BallByBallApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
        allBalls: [],
        selectedInnings: {value: '', label: ''},
        selectedOver: [],
        playBallVideo: null
    };
  }

  componentDidMount() {}

  componentWillMount() {
    const innings = JSON.parse(this.props.allInnings);
    const defaultInning = innings[0].split('-');
    this.fetchData({ value: defaultInning[1], label: defaultInning[0] });
  }

  updateBall(newBall) {
    const self = this;
    const ballDescription = _.pick(newBall, ['Id', 'bn', 'by', 'ifh', 'ilb', 'ms', 'inb', 'on', 'sc', 'wd']);
    const ballDetail = _.pick(newBall, [
        'Id', 'aid', 'bn', 'bt', 'bw', 'by', 'co', 'dt', 'fav', 'fh', 'glh', 'glh2',
        'glhc', 'glhc2', 'gll', 'gll2', 'gsl', 'gt', 'ht', 'ib', 'ifh', 'iid', 'ilb',
        'inb', 'iw', 'lb', 'lt', 'ms', 'mvc', 'nb', 'on', 'pl', 'pl1', 's', 'sc', 'st',
        'vc', 'visibleGif', 'wd']);
    const lastOver = self.state.allBalls[self.state.allBalls.length - 1];
    const _allBalls = _.clone(self.state.allBalls, true);
    if (_.get(lastOver[lastOver.length - 1], 'bn') !== "6") {
        _allBalls[_allBalls.length - 1].push(ballDescription);
        const _selectedOver = _.clone(self.state.selectedOver, true);
        if (_.get(ballDescription, 'on') === _.get(_selectedOver[0], 'on')) {
            _selectedOver.push(ballDetail);
            self.setState({
                allBalls: _allBalls,
                selectedOver: _selectedOver
            });
        } else {
            self.setState({
                allBalls: _allBalls
            });
        }
    } else {
        _allBalls.push([ballDescription]);
        self.setState({
            allBalls: _allBalls,
            selectedOver: [ballDetail]
        });
    }

    self.scrollOvers();
  }

  scrollOvers() {
    this.refs.scrollbars.scrollToRight();
  }

  fetchData(innings) {
    const self = this;
    const id = _.get(innings, 'label') ? _.get(innings, 'value') : innings;
    const apis = ['https://cig-prod-api.azurewebsites.net/api/balls/inns/' + id];
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
            response.json().then(function(balls) {
                const _allOvers = _.uniqBy(balls, 'on');
                const _allBalls = _.map(_allOvers, function(over, ballIndex) {
                    return _.filter(balls, {on: over.on});
                });
                if (_allBalls.length > 0) {
                    self.setState({
                        allBalls: self.orderOvers(_allBalls),
                        selectedInnings: innings,
                        selectedOver: _allBalls[0],
                        playBallVideo: self.props.matchState === "0" ? _.get(_allBalls[0][0], "Id") : null
                    });
                    if (shortScoreCardService.getChannel) {
                        shortScoreCardService.subscribeBallUpdate(self.updateBall.bind(self));
                    }
                    self.scrollOvers();
                }
            });
        }  
    });
  }

  getClass(score) {
    if (score === "0")
        return "dot";
    if (score === "1" || score === "2" || score === "3" || score === "5")
        return "score";
    if (score === "4" || score === "6")
        return "boundry";
    if (score === "W")
        return "wicket";    
  }

  handleChange(selectedOption) {
    selectedOption !== null && this.fetchData(selectedOption);
  }
  
  orderOvers(allOvers) {
    const _allOvers = _.map(allOvers, function(over, overNum) {
        return over.slice().reverse();
    }).slice().reverse();    
    return _allOvers;
  }

  handleScroll() {}

  setPlayList(overNumber, ballNumber, ballId) {
    // let currentOver = [];
    // _.each(this.state.allBalls[overNumber], function(ball, i) {
    //     if (i >= ballNumber) currentOver.push(ball);
    // });
    // let commingOvers = this.state.allBalls.slice(overNumber + 1);
    // commingOvers.unshift(currentOver);
    const commingOvers = [[this.state.allBalls[overNumber][ballNumber]]];
    const ballsPlaylist = _.flattenDeep(_.map(commingOvers, function(over, oi) {
        return _.map(over, function(ball, bi) {
            return ball.Id;
        })   
    }));
    return ballsPlaylist
  }

  render() {
    if (_.isEmpty(this.state.allBalls)) {
        return (
            <div style={{background: 'white', height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9em',
                    fontFamily: 'poppins-semibold',
                    color: '#333'}}>
                No Data In This Section !!
            </div>
        )
    }
    
    const innings = JSON.parse(this.props.allInnings);
    const options = _.map(innings, function(o) {
        return {
            label: o.split('-')[0],
            value: o.split('-')[1]
        }
    });

    const selectedOver = _.clone(this.state.selectedOver, true);
    const selectedInnings = _.clone(this.state.selectedInnings, true);
    const playBallVideo = _.clone(this.state.playBallVideo, true);
    const allOvers = _.clone(this.state.allBalls, true);
    return (
        <div style={{background: 'white'}}>
            <div className="ball-filters">
                <div className="inning-dropdown">
                    <div className="inning-title">Innings</div>
                    <Select
                        name="form-field-name"
                        className="inning-selection needsclick"
                        value={ this.state.selectedInnings }
                        onChange={ this.handleChange.bind(this) }
                        optionClassName="inning-option"
                        options={ options }
                        searchable={ false }
                    />
                </div>
            </div>
            <div className="horizontal-slider">
                <Scrollbars style={{ height: '115px', overflow: 'hidden' }}
                    onScrollFrame={ this.handleScroll.bind(this) }
                    thumbMinSize={30}
                    renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
                    renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                    renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                    renderView={props => <div {...props} className="horizontal-slider-area"/>}
                    onWheel={ function(event) {
                            var list = event.currentTarget.firstChild; 
                            var delta = (event.deltaX == 0 ? event.deltaY : event.deltaX); 
                            list.scrollLeft += delta; event.preventDefault(); 
                        }
                    }
                    ref="scrollbars">
                    {allOvers.map((over, overNumber) => {
                        return (
                            <div className="over-col" 
                                key={ overNumber }
                                onClick={ () => this.setState({ selectedOver: over.slice().reverse() }) }>
                                
                                <div className="over-number">Over { overNumber + 1 }</div>
                                <div className="over-row" name={ (overNumber + 1).toString() }>
                                    {over.map((ball, ballIndex) => {
                                        return (
                                            <div className={"over-ball " + this.getClass(ball.s || ball.sc)} 
                                                key={ ballIndex + '' + overNumber }
                                                onClick={ () => this.setState({ playBallVideo: this.setPlayList(overNumber, ballIndex, ball.Id) }) }>
                                                { ball.s || ball.sc }
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </Scrollbars>
            </div>
            <div className="over-detail">
                <OverDetail selectedOver={ selectedOver } 
                    selectedInnings={ selectedInnings }
                    playedBallVideo={ playBallVideo }/>
            </div>
        </div>
    );
  }
}

export default BallByBallApp;

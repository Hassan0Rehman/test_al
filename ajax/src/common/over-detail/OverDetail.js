import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import shortScoreCardService from '../../match-page/pusher-service/short-scorecard';
import videoPlaylistService from '../../match-page/video-playlist/video-playlist';
import * as _ from 'lodash';

let __selectedInnings = null;
const __allowedGif = JSON.parse(document.getElementById('match-content').dataset.attrAllowgif);
class OverDetailApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
        overDetail: []
    }
  }

  componentWillReceiveProps(nextProps) {
    // Update selected innings if it has changed
    if (!_.isEqual(nextProps.selectedInnings, this.props.selectedInnings)) {
        __selectedInnings = nextProps.selectedInnings;
    }

    // You don't have to do this check first, but it can help prevent an unneeded render
    if (!_.isEqual(nextProps.selectedOver, this.props.selectedOver) && 
        _.isEqual(nextProps.playedBallVideo, this.props.playedBallVideo)) {
        
        // CASE FOR NEW OVER SELECTED OLD BALL SELECTED FOR VIDEO
        this.fetchData(nextProps.selectedOver[0].on, false);
    } else if (!_.isEqual(nextProps.selectedOver, this.props.selectedOver) && 
        !_.isEqual(nextProps.playedBallVideo, this.props.playedBallVideo)) {
        
        // CASE FOR NEW OVER SELECTED NEW BALL SELECTED FOR VIDEO
        this.fetchData(nextProps.selectedOver[0].on, nextProps.playedBallVideo);
    } else if (!_.isEqual(nextProps.playedBallVideo, this.props.playedBallVideo) &&
        _.isEqual(nextProps.selectedOver, this.props.selectedOver)) {
        
        // CASE FOR OLD OVER SELECTED NEW BALL SELECTED FOR VIDEO        
        this.playVideo(nextProps.playedBallVideo);
    }
  }

  componentWillMount() {
    __selectedInnings = this.props.selectedInnings;
    this.fetchData(this.props.selectedOver[0].on, [this.props.playedBallVideo]);
  }

  fetchData(overNum, changedBall) {
    const self = this;
    const apis = ['https://cig-prod-api.azurewebsites.net/api/balls/inns/' + __selectedInnings.value + '/over/' + overNum + '/video/true'];
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
            response.json().then(function(over) {
                if (over.length > 0) {
                    const completeOver = _.map(self.props.selectedOver, function(ball, i) {
                        const _ball = _.find(over, {Id: ball.Id});
                        return _.assign({}, _ball, ball, { visibleGif: false });
                    }).sort(function(a, b) {
                        return parseInt(b.bn) - parseInt(a.bn) 
                    });
                    self.setState({
                        overDetail: completeOver
                    });
                    if (changedBall) {
                        self.playVideo(changedBall);
                    }
                } else {
                    throw "error fetching this over";
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
  
  toggleGif(clickedBall, ballIndex) {
    const _clickedBall = _.clone(clickedBall), _currentOver = _.clone(this.state.overDetail);
    _.set(_clickedBall, 'visibleGif', _clickedBall.visibleGif = !_clickedBall.visibleGif);
    _.pullAt(_currentOver, ballIndex);
    _currentOver.splice(ballIndex, 0, _clickedBall);

    this.setState({
        overDetail: _currentOver
    });
  }

  playVideo(balls) {
    const self = this;
    const selectedBalls = _.map(balls, function(ball) {
        return _.find(self.state.overDetail, {Id: ball})
    });
    const videos = _.map(selectedBalls, function(ball) {
        return {
            sources: [{
                src: _.get(ball, 'glh') ? ball.glh : '',
                type: 'video/mp4'
            }],
            poster: ''
        };
    });
    videoPlaylistService.createPlaylist(videos);
    
    // const selectedBalls = _.takeRightWhile(this.state.overDetail, {Id: ballId});
    // const videoLink = selectedBall.glh;
    // const ballNumber = selectedBall.on + "." + selectedBall.bn;
    // const bowlTBatsman = "bowler to batsmen";
    // if (videoLink && videoLink !== '') {
    //     const streamPlayer = document.getElementById('stream-video');
    //     streamPlayer && streamPlayer.classList.add('hide-video');
    //     const vidoElem = document.getElementById('bllbyball-clips');
    //     document.getElementById('video-ball-detail').innerHTML = ballNumber + ' - ' + bowlTBatsman;
    //     vidoElem.classList.remove('hide-video');
    //     vidoElem.src = videoLink;
    // }
  }

  render() {
    console.log("over detail", this.state.overDetail);
    if (_.isEmpty(this.state.overDetail)) return null;
    
    const isDesktop = window.innerWidth >= 767;
    return (
        <div className="over-detail-comp">
            {this.state.overDetail.map((ball, ballIndex) => {
                let isGif = ball.visibleGif ? ball.gll : ball.gsl;
                isGif = isGif === '' ? 'https://d7d7wuk1a7yus.cloudfront.net/static-assets/placeholder.png' : isGif;
                if (!__allowedGif) {
                    return (
                        <div className="ball-detail" key={ballIndex}>
                            <div className="ball-data">
                                <div className="ball-num-mob">
                                    <div className="ball-num">{ ball.on + '.' + ball.bn}</div>
                                    { !isDesktop && <div>bowler to batsman</div> }
                                </div>
                                <div className="ball-num-desk">
                                    { isDesktop && <div>bowler to batsman</div> }
                                    <div>{ ball.co }</div>
                                </div>
                            </div>
                            <div className={"over-ball " + this.getClass(ball.s || ball.sc)}>
                                { ball.s || ball.sc }
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="ball-detail" key={ ballIndex }>
                            <div className="ball-gif-cover" 
                                onClick={ () => this.toggleGif(ball, ballIndex) }
                                style={{ backgroundImage: 'url(' + isGif + ')' }}>
                                {!ball.visibleGif && <img className="gif-icon" src="https://d7d7wuk1a7yus.cloudfront.net/static-assets/gif_icon.png" />}
                            </div>
                            <div className="ball-data">
                                <div className="ball-num">{ ball.on + '.' + ball.bn}</div>                        
                                <div>
                                    <div>bowler to batsman</div>
                                    <div>{ ball.co }</div>
                                </div>
                                <div className={"over-ball-full " + this.getClass(ball.s)}>
                                    { ball.s || ball.sc }
                                </div>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    )
  }
}

export default OverDetailApp;

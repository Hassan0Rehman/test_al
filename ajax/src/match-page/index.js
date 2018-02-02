import React from 'react';
import ReactDOM from 'react-dom';
import SeriesDropdown from '../common/series-dropdown/SeriesDropdown';
import Tabs from '../common/tabs/Tabs';
import ScoreCard from '../common/scorecard/ScoreCard';
import FullScoreCard from '../common/full-scorecard/FullScorecard';
import Lineup from '../common/lineup/Lineup';
import MatchPrediction from '../common/match-prediction/MatchPrediction';
import WormChart from '../common/worm-chart/WormChart';
import RelatedNews from '../common/related-news/RelatedNews';
import BallByBall from '../common/ball-by-ball/BallByBall';
import shortScoreCardService from './pusher-service/short-scorecard';

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        const videoStreamUrl = document.getElementById("stream-video");
        if (videoStreamUrl) {
            var matchState = videoStreamUrl.attributes["data-attr-state"].value;
            if (matchState == 1) {
                var matchUrl = videoStreamUrl.attributes["data-attr-url"].value;
                var playerInstance = window.videojs('stream-video', {
                    width: "100%",
                    aspectratio: "16:9",
                    controls: true,
                    autoplay: true,
                    muted: true,
                    preload: 'auto',
                    nativeControlsForTouch: true,
                    notSupportedMessage: "Please refresh to load video correctly",
                    sourceOrder: true,
                    sources: [{
                        src: matchUrl,
                        type: "application/x-mpegURL"
                    }],
                    techOrder: ['html5', 'flash']
                });
            }
        }
    }
};

const idElem = document.getElementById('match-content');
let id = null;
if (idElem) {
    id = idElem.dataset.attrId;
    const inningId = idElem.dataset.attrInningid,
    allInnings = idElem.dataset.attrAllinnings,
    matchState = idElem.dataset.attrMatchstate;
    
    if (matchState === "1") {
        shortScoreCardService.setChannel(id);
    }
    // ScoreCard component on match page
    ReactDOM.render(<FullScoreCard id={ id } />, document.getElementById('scorecard'));

    // ScoreCard component on match page
    ReactDOM.render(<Lineup id={ inningId } />, document.getElementById('lineup'));
    
    ReactDOM.render(<MatchPrediction />, document.getElementById('prediction-result'));
    
    // ShortScoreCard component on match page
    ReactDOM.render(<ScoreCard id={ id } />, document.getElementById('schort-sc-ajax-temp'));

    // Related News on match page
    id && ReactDOM.render(<RelatedNews id={ id } />, document.getElementById('related-news'));

    // Ball by ball action on match page
    if (JSON.parse(allInnings).length > 0) {
        ReactDOM.render(<BallByBall allInnings={ allInnings } matchState={ matchState }/>, document.getElementById('ball-by-ball'));
    } else {
        ReactDOM.render(<div style={{
            background: 'white', height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9em',
            fontFamily: 'poppins-semibold',
            color: '#333'}}>
            No coverage yet !!
        </div>, document.getElementById('ball-by-ball'));
    }
}

if (window.innerWidth >= 767) {
    // Set series header dropdown
    const scoreCardElem = document.getElementById('series-header-dropdown');
    ReactDOM.render(<SeriesDropdown />, scoreCardElem);

    // Worm Chart component
    id && ReactDOM.render(<WormChart id={id} />, document.getElementById('worm-chart'));
}

import React from 'react';
import ReactDOM from 'react-dom';
import FbComments from '../fb-comments/FbComments';
import SeriesDropdown from '../common/series-dropdown/SeriesDropdown';
import PerfectScrollbar from '../common/perfect-scroller/PerfectScroller';
import ShareWidgetApp from '../share-widget/ShareWidgetApp';
import Timer from '../common/timer/Timer';
import Tabs from '../common/tabs/Tabs';
import * as _ from 'lodash';
import ShareWidgetAppMobile from '../share-widget/ShareWidgetApp-mobile';


// INITIALIZE EMOTICONS
// var script = document.createElement("script")
// script.type = "text/javascript";
// script.src="https://vuukle.com/js/vuukle.js";
// document.getElementsByTagName("head")[0].appendChild(script);
// script.onload = function () {
//     const topTitle = document.getElementById('story-info');
//     var VUUKLE_CUSTOM_TEXT = '{ "rating_text": "Give a rating:", "comment_text_0": "Leave a comment", "comment_text_1": "comment", "comment_text_multi": "comments", "stories_title": "Talk of the Town" }';
//     var UNIQUE_ARTICLE_ID = topTitle.dataset.attrId;
//     var SECTION_TAGS = '';
//     var ARTICLE_TITLE = topTitle.dataset.attrTitle;
//     var GA_CODE = "UA-123456";
//     var VUUKLE_API_KEY = "5fe0d857-4e84-42cf-abfd-359574886f80";
//     var TRANSLITERATE_LANGUAGE_CODE = "en";
//     var VUUKLE_COL_CODE = "25b609";
//     var ARTICLE_AUTHORS = btoa(encodeURI('[{"name": "cricingif", "email":"nabeel.muneer@cricingif.com","type": "internal"}]'));
//     window.create_vuukle_platform(VUUKLE_API_KEY, UNIQUE_ARTICLE_ID, "0", SECTION_TAGS, ARTICLE_TITLE, TRANSLITERATE_LANGUAGE_CODE, "1", "", GA_CODE, VUUKLE_COL_CODE, ARTICLE_AUTHORS);
// };

if (window.innerWidth >= 767) {
    // Share widget on stories page    
    ReactDOM.render(<ShareWidgetApp />, document.getElementById('share-widget'));
    // Set series header dropdown
    ReactDOM.render(<SeriesDropdown />, document.getElementById('series-header-dropdown'));
}else{
    ReactDOM.render(<ShareWidgetAppMobile />, document.getElementById('share-widget'));
}

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
        // INITIALIZE FACEBOOK COMMENTS
        ReactDOM.render(<FbComments />, document.getElementById('fb-article-comments'));

        // Set Tweet Widget
        const tweets = document.getElementsByClassName("tweet-markup-container");
        _.each(tweets, (tweet, i) => {
            const tweetIdDiv = tweet.firstElementChild;
            const args = tweet.firstElementChild.dataset.attrArgs;
            window.twttr.widgets.createTweet(args , document.getElementById(args), { conversation: 'none', width: '400px'  });
        });
    }
});

// Add timers in widget for upcoming matches.
const upcomingMatches = document.getElementsByClassName("time-remaining-in-match");
_.each(upcomingMatches, (match, i) => {
  const _date = new Date(match.innerHTML + " GMT").valueOf();
  ReactDOM.render(<Timer secondsRemaining={_date} />, match);
});

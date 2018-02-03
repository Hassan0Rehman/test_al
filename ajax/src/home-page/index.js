// ALL JS THAT NEED TO BE EXECUTED ON BROWSER ON HOME PAGE SHOULD GO HERE
import React from 'react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';
import CookieParse from '../common/cookie-parser/CookieParser';
import RankingsApp from '../common/rankings/RankingsApp';
import PerfectScrollbar from '../common/perfect-scroller/PerfectScroller';
import MobileNavigation from '../common/mobile-navigation/MobileNavigation';
import Timer from '../common/timer/Timer';
import SeriesDropdown from '../common/series-dropdown/SeriesDropdown';
import Tabs from '../common/tabs/Tabs';
import LatestMatch from '../common/home-page/series-redtext';
// import LazyloadImage from '../common/lazyload-image/lazyload-image';

var countryObj = window.getCountryObj('cig-location');

// Add timers in widget for upcoming matches.
const upcomingMatches = document.getElementsByClassName("time-remaining-in-match");
_.each(upcomingMatches, (match, i) => {
  const _date = new Date(match.innerHTML + " GMT").valueOf();
  ReactDOM.render(<Timer secondsRemaining={_date} />, match);
});

var seriesIds = document.getElementsByClassName("bl-overlay-match-details");
_.each(seriesIds, (series, i) => {
  ReactDOM.render(<LatestMatch seriesId={series.attributes["series-attr-id"].value} />,
   document.getElementById("article-headliner-" + series.attributes["series-attr-id"].value));
});

if (window.innerWidth >= 767) { 
  // Add rankings for team and players, these modules hot reload after going to client.
  ReactDOM.render(<RankingsApp rankingType={'Team Rankings'} options={[{name: 'Test', value: 1}, {name: 'Odi', value: 2},{name: 'T20', value: 3}, {name: 'Women', value: 4}]}/>, document.getElementById('team-rankings'));
  ReactDOM.render(<RankingsApp rankingType={'Player Rankings'} options={[{name: 'Test Batsman', value: 1}, {name: 'Test Bowlers', value: 2},{name: 'Odi Batsman', value: 3}, {name: 'Odi Bowlers', value: 4}, {name: 'T20 Batsman', value: 5}, {name: 'T20 Bowlers', value: 6}, {name: 'Women Odi Batsman', value: 7}, {name: 'Women Odi Bowlers', value: 8}, {name: 'Women T20 Batsman', value: 9}, {name: 'Women T20 Bowlers', value: 10}]}/>, document.getElementById('player-rankings'));

  // Set series header dropdown
  ReactDOM.render(<SeriesDropdown />, document.getElementById('series-header-dropdown'));
}

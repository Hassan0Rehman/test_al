import React from 'react';
import ReactDOM from 'react-dom';
import SeriesDropdown from '../common/series-dropdown/SeriesDropdown';
import PerfectScrollbar from '../common/perfect-scroller/PerfectScroller';
import FeatureArticle from '../common/series-dropdown/feature-article-series';
import ArticleTemplateMobile from '../common/series-dropdown/articles-series-mobile';
import SeriesArticleTemplate from '../common/series-dropdown/article-series-desktop';
import TeamsSquad from '../common/series-dropdown/series-squad';
import TeamsPools from '../common/series-dropdown/series-pools';
import SeriesStat from '../common/series-dropdown/series-stats';
import LatestMatch from '../common/series-dropdown/series-redtext';
import * as _ from 'lodash';
import Tabs from '../common/tabs/Tabs';
import Timer from '../common/timer/Timer';

if (window.innerWidth >= 767) {
  // Set series header dropdown
  ReactDOM.render(<SeriesDropdown />, document.getElementById("series-header-dropdown"));

  // Fetch Feature Articles 
  ReactDOM.render(<FeatureArticle />, document.getElementById("feature-article"));

  // Fetch Series Articles 
  ReactDOM.render(<SeriesArticleTemplate />, document.getElementById("series-article"));
}
if (window.innerWidth <= 767) {
  ReactDOM.render(<ArticleTemplateMobile />, document.getElementById("article-template"));
}

var seriesIds = document.getElementsByClassName("series-squad-menu");
_.each(seriesIds, (series, i) => {
  ReactDOM.render(<TeamsSquad seriesId={series.attributes["attr-series-squad"].value} />,
    document.getElementById("series-squad-" + series.attributes["attr-series-squad"].value));
});

const upcomingMatches = document.getElementsByClassName("time-remaining-in-match");
_.each(upcomingMatches, (match, i) => {
  const _date = new Date(match.innerHTML + " GMT").valueOf();
  ReactDOM.render(<Timer secondsRemaining={_date} />, match);
});


ReactDOM.render(<TeamsPools />, document.getElementById("series-pools"));

ReactDOM.render(<SeriesStat />, document.getElementById("series-stat"));

// ReactDOM.render(<LatestMatch />, document.getElementById("article-headliner"));

import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './Timer';
import * as _ from 'lodash';
import * as moment from 'moment';
import PerfectScrollbar from 'perfect-scrollbar';

// Handle scrolling and title text change for scrolling widget
const container = document.querySelector("#right-widget-scroller");
const ps = new PerfectScrollbar(container);
container.addEventListener('ps-scroll-y', () => {
  const topTitle = document.querySelector("#top-scrolled-category");
  const activeTitles = document.getElementsByClassName("active-title");
  const topScrolled = _.map(activeTitles, function(title) {
    const scrollTop = window.pageYOffset || title.scrollTop;
    const pos = title.getBoundingClientRect().top + scrollTop;
    return pos <= 200 ? {value: title, top:  pos} : null;
  });
  const scrolled = _.maxBy(topScrolled, function(o) { if (o) return o.top; });
  if (scrolled) {
    topTitle.innerHTML = scrolled.value.innerHTML;
  }
});

// Add timers in widget for upcoming matches
const upcomingMatches = document.getElementsByClassName("time-remaining-in-match");
_.each(upcomingMatches, (match, i) => {
  const _date = new Date(match.innerHTML + " GMT").valueOf();
  ReactDOM.render(<Timer secondsRemaining={_date} />, match);
});

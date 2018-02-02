import PerfectScrollbar from 'perfect-scrollbar';
import * as _ from 'lodash';

if (window.innerWidth >= 767) {
  // Handle scrolling and title text change for scrolling widget.
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
}

import PerfectScrollbar from "perfect-scrollbar";

$(document).ready(function() {
  // Place JavaScript code here...
  const container = document.querySelector("#right-widget-scroller");
  const ps = new PerfectScrollbar(container, {
    wheelSpeed: 2,
    wheelPropagation: true,
    minScrollbarLength: 20
  });
});
import React from 'react';
import ReactDOM from 'react-dom';
import RankingsApp from './RankingsApp';

ReactDOM.render(<RankingsApp rankingType={'Team Rankings'} options={[{name: 'Test', value: 1}, {name: 'Odi', value: 2},{name: 'T20', value: 3}, {name: 'Women', value: 4}]}/>, document.getElementById('team-rankings'));
ReactDOM.render(<RankingsApp rankingType={'Player Rankings'} options={[{name: 'Test Batsman', value: 1}, {name: 'Test Bowlers', value: 2},{name: 'Odi Batsman', value: 3}, {name: 'Odi Bowlers', value: 4}, {name: 'T20 Batsman', value: 5}, {name: 'T20 Bowlers', value: 6}, {name: 'Women Odi Batsman', value: 7}, {name: 'Women Odi Bowlers', value: 8}, {name: 'Women T20 Batsman', value: 9}, {name: 'Women T20 Bowlers', value: 10}]}/>, document.getElementById('player-rankings'));

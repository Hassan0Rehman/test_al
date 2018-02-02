import React from 'react';
import ReactDOM from 'react-dom';
import FbComments from './FbComments';

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
        ReactDOM.render(<FbComments />, document.getElementById('fb-article-comments'));        
    }
});

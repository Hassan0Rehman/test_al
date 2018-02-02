import React, { Component } from 'react';
import FacebookProvider, { Comments } from 'react-facebook';

class FbCommentsApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (window.FB) {
        // Read the entire document for `fb-*` classnames
        window.FB.XFBML.parse();
    }
  }

  render() {
    return (
        <FacebookProvider appId="1883181371897712">
          <Comments href="www.cricingif.com/stories/8646/Afghan-board-declines-speculations-of-Bangladeshs-series   " width="100%" numPopsts="25"/>
        </FacebookProvider>
    );
  }
}

export default FbCommentsApp;

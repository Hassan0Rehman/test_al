import React, { Component } from 'react';
import FacebookProvider, { Share } from 'react-facebook';
import {
  ShareButtons,
  generateShareIcon
} from 'react-share';

class ShareWidgetApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  onClick(event) {
    console.log("Hello Bookmark");
  }

  render() {
    const {
      FacebookShareButton,
      GooglePlusShareButton,
      TwitterShareButton,
    } = ShareButtons;

    const TwitterIcon = generateShareIcon('twitter');
    const GooglePlusIcon = generateShareIcon('google');
    const FacebookIcon = generateShareIcon('facebook');

    const obj = document.getElementsByClassName("nid-text-container");
    var id = obj[0].attributes['data-attr-id'].value;
    var title = obj[0].attributes['data-attr-title'].value;
    var url = obj[0].attributes['data-attr-url'].value;
    var articletype = obj[0].attributes['data-attr-articletype'].value;
    if (articletype != 5) {
      articletype = "news";
    } else {
      articletype = "stories";
    }

    return (
      <div>
        <div className="heart-circle heart-like-action fixed-share-links" onClick={this.onClick}>
          <i className="icon-heart-empty"></i>
        </div>
        <div className="social-vertical-links fixed-share-links">
          <FacebookShareButton appId="1883181371897712" cookie={true} version="v2.3"
            url={'https://www.cricingif.com/' + articletype + '/' + id + '/' + url}
            title={title}
            className="fb-share">
            <FacebookIcon
              size={32}
              round />
          </FacebookShareButton>

          <TwitterShareButton
            url={'https://www.cricingif.com/' + articletype + '/' + id + '/' + url}
            title={title}
            className="tweet-share">
            <TwitterIcon
              size={32}
              round />
          </TwitterShareButton>

          <GooglePlusShareButton
            url={'https://www.cricingif.com/' + articletype + '/' + id + '/' + url}
            title={title}
            className="google-share">
            <GooglePlusIcon
              size={32}
              round />
          </GooglePlusShareButton>



        </div>
      </div>
    );
  }
}


export default ShareWidgetApp;

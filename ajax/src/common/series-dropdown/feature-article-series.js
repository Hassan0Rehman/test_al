import React, { Component } from 'react';

class FeatureArticle extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            seriesId: document.getElementsByClassName("wrapper-inner")[0].attributes["data-attr-seriesid"].value,
            featureArticle: []
        };
    }

    componentDidMount() {
        this.fetchData(0);
    }

    fetchData(index) {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/articles/tour/' + this.state.seriesId + '/blogs/page/'];
        const url = apis[0];
        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token HHiQLYvZnkGqfD5xzxr/Sw');
        myHeaders.append('content-type', 'application/json');

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        fetch(url + index, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    self.setState({
                        featureArticle: response
                    });
                });
            }
        })
    }

    render() {
        let template = null;
        template = this.state.featureArticle.map((featurearticle, i) => {
            let publishDate = new Date(featurearticle.dt);
            var date = new Date();
            var hours = Math.abs(date - publishDate) / 36e5;
            if (hours <= 1) {
                publishDate = "just now"
            } else if (hours > 1 && hours <= 23) {
                publishDate = Math.floor(hours) + "h"
            } else if (hours > 23) {
                publishDate = ""
            }

            return (
                <div className="blogs-hm-section-two">
                    <a href={"/news/" + featurearticle.Id + "/" + featurearticle.u}>
                        <div className="wrapper">
                            <div className="four-by-five xs-sixteen-by-nine"
                                style={{ backgroundImage: 'url(http://d7d7wuk1a7yus.cloudfront.net/article-images/0.86/' + featurearticle.Id + '.jpg)', paddingBottom: '116%', backgroundSize: 'cover' }}>
                            </div>
                            <div className="content" style={{ top: 'auto' }}>
                                <div className="blog-pic-overlay blog-pic-overlay-hm" style={{ positionion: 'relative', verticalAlign: 'bottom' }}>
                                    <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
                                        <div className="blog-overlay-tag blog-overlay-tag-sm">{featurearticle.h}</div>
                                        <div className="blog-overlay-title blog-overlay-title-sm" style={{ height: 'auto' }}>{featurearticle.t}</div>
                                        <div className="featured-article-desc-row">
                                            <div className="author-details author-details-sm inline-block">
                                                <img className="inline" width="30" height="30" src={"https://d7d7wuk1a7yus.cloudfront.net/blogger-images/" + featurearticle.bi + ".png"} />
                                                <p className="inline">{featurearticle.bn}</p>
                                            </div>
                                            <div className="blog-time-and-comments blog-time-and-comments-sm pull-right inline-block">
                                                <div>
                                                    <p className="inline">
                                                        {
                                                            publishDate
                                                        }
                                                    </p>
                                                </div>
                                                &nbsp;
                                                    <div>
                                                    <i className="inline fa fa-comments-o"></i>
                                                    <p className="inline">{featurearticle.v}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            );
        })
        return template;
    }
}

export default FeatureArticle;

import React, { Component } from 'react';
import * as _ from "lodash";
import LatestMatch from '../series-dropdown/series-redtext';

class seriesarticle extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            seriesId: document.getElementsByClassName("wrapper-inner")[0].attributes["data-attr-seriesid"].value,
            seriesArticle: [],
            page: 0,
            flag: 0
        };
    }

    componentDidMount() {
        this.fetchData(this.state.page);
    }

    fetchData(index) {
        const self = this;
        const apis = ['https://cig-prod-api.azurewebsites.net/api/articles/tour/' + this.state.seriesId + '/page/' + index];
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

        fetch(url, myInit).then(function (response) {
            if (response.status === 200) {
                response.json().then(function (response) {
                    if (response.length > 0) {
                        if(!(response.length >= 10))
                        {
                            if (document.getElementById('loadMore'))
                            document.getElementById('loadMore').style.display = "none";
                        }
                        document.getElementById('temp-series-article').style.display = "none";
                        self.setState({
                            seriesArticle: _.concat(self.state.seriesArticle, response),
                            page: self.state.page + 1,
                            flag: 1
                        });
                    } else {
                        document.getElementById('temp-series-article').style.display = "none";
                        if (document.getElementById('loadMore'))
                            document.getElementById('loadMore').style.display = "none";
                        self.setState({
                            seriesArticle: _.concat(self.state.seriesArticle, response),
                            flag: 1
                        });
                    }
                });
            }
        })
    }

    articleFirst(first) {
        let template = null;
        if (!first)
            return null;
        template = <div className="no-padding col-md-6">
            <a href={"/news/" + first.Id + "/" + first.u}>
                <div className="news-sm-block" style={{ width: '100%' }}>
                    <div className="single-news-block single-news-block-responsive">
                        <div className="wrapper" href={"/news/" + first.Id + "/" + first.u} style={{ height: '168.925px' }}>
                            <img src={"https://www.cricingif.com/Images/ArticleImages/1.78/" + first.Id + ".jpg"} width="100%" height="100%" />
                        </div>
                        <div className="news-sm-content-wrapper series-sm-content-wrapper">
                            <div className="news-main-title">
                                <div className="  main-news-link inline-block series-head-title-text">
                                    <div className="Series-Col-Articles captial-text">
                                        {first.ht}
                                    </div>
                                </div>

                            </div>
                            <div className="news-sub-title">
                                <div className="Series-Col-Articles">
                                    {first.t}
                                </div>
                            </div>
                            <div className="news-copy-text">
                                <p className="copy-text">
                                    {first.e}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        return template;
    }
    articleSecond(second) {
        let template = null;
        if (!second)
            return null;
        template = <div className="no-padding col-md-6">
            <a href={"/news/" + second.Id + "/" + second.u}>
                <div className="news-sm-block" style={{ width: '100%' }}>
                    <div className="single-news-block single-news-block-responsive">
                        <div className="wrapper" href={"/news/" + second.Id + "/" + second.u} style={{ height: '168.925px' }}>
                            <img src={"https://www.cricingif.com/Images/ArticleImages/1.78/" + second.Id + ".jpg"} width="100%" height="100%" />
                        </div>
                        <div className="news-sm-content-wrapper series-sm-content-wrapper">
                            <div className="news-main-title">
                                <div className="  main-news-link inline-block series-head-title-text">
                                    <div className="Series-Col-Articles captial-text">
                                        {second.ht}
                                    </div>
                                </div>

                            </div>
                            <div className="news-sub-title">
                                <div className="Series-Col-Articles">
                                    {second.t}
                                </div>
                            </div>
                            <div className="news-copy-text">
                                <p className="copy-text">
                                    {second.e}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        return template;
    }

    render() {
        if (this.state.flag == 0 && this.state.seriesArticle.length == 0)
            return null;
        let articlesList = _.clone(this.state.seriesArticle, true);
        if (this.state.seriesArticle.length == 0) {
            return (
                <div className="no-margin-left no-padding">
                    <div id="headline-article" className="col-md-12 no-padding-left blogs-hm-section-one">
                        <div className="login-container-right">
                            <p>No News Coverage Yet</p>
                        </div>
                    </div>
                </div>
            );
        }
        let template = null, tempTopArticle = null, topArticle = null, button = null;
        topArticle = articlesList.splice(0, 1);
        let articles = _.chunk(articlesList, 2);
        if (topArticle) {
            tempTopArticle = <div className="no-margin-left no-padding">
                <div id="headline-article no-padding-left blogs-hm-section-one" style={{ paddingRight: '20px' }}>
                    <div className="wrapper margin-bottom-20 ">
                        <a className="main-article-trigger" href={"/news/" + topArticle[0].Id + "/" + topArticle[0].u} style={{ height: '100px' }}>
                            <div className="sixteen-by-nine">
                                <img src={"https://www.cricingif.com/Images/ArticleImages/1.78/" + topArticle[0].Id + ".jpg"} width="100%" />
                            </div>
                        </a>
                        <div className="content" style={{ top: 'auto' }}>
                            <div className="blog-pic-overlay blog-pic-overlay-hm" style={{ position: 'relative', verticalAlign: 'bottom' }}>
                                <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
                                    <div className="blog-overlay-sub-title">
                                        <p className="inline">
                                            {topArticle[0].mt}
                                        </p>
                                        <p className="inline blog-duration-hm"></p>
                                    </div>
                                    <div className="blog-overlay-title blog-overlay-title-hm" style={{ height: 'auto' }}>
                                        <h2 className="inline">
                                            <a className="article-title-link main-article-trigger" href={"/news/" + topArticle[0].Id + "/" + topArticle[0].u}>
                                                {topArticle[0].t}
                                            </a>
                                        </h2>
                                    </div>
                                    <div className="bl-overlay-match-details" id="article-headliner">
                                        {<LatestMatch />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        template = articles.map((article, i) => {
            let first = null, second = null;
            if (article.length == 2) {
                first = article[0];
                second = article[1];
            } else if (article.length == 1) {
                first = article[0];
            }
            return (
                <div>
                    {this.articleFirst(first)}
                    {this.articleSecond(second)}
                </div>
            );
        })
        if (this.state.seriesArticle.length >= 10) {
            button = <div id="loadMore" onClick={() => this.fetchData(this.state.page)}>
                <a>Load More</a>
            </div>
        }
        return (
            <div id="homepage-content" className="margin-top-20">
                {tempTopArticle}
                <div className="no-margin-left no-padding">
                    {template}
                </div>
                {button}
            </div>
        );
    }
}

export default seriesarticle;

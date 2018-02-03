import React, { Component } from 'react';
import * as _ from "lodash";

class FeatureArticle extends Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            seriesId: document.getElementsByClassName("wrapper-inner")[0].attributes["data-attr-seriesid"].value,
            ArticleList: [],
            BlogList: [],
            page: 0,
            flag: 0
        };
    }

    componentDidMount() {
        this.fetchData(this.state.page);
    }

    fetchData(index) {
        const self = this;
        const apis = ['https://cig-staging-api.azurewebsites.net/api/tours/' + this.state.seriesId + '/page/' + index + '/articles'];
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
                    if (response.BlogList.length > 0 ||response.BlogList.length > 0 || response.ArticleList.length > 0 > 0) {
                        if(!(response.ArticleList.length >= 10))
                        {
                            if (document.getElementById('loadMore'))
                            document.getElementById('loadMore').style.display = "none";
                        }
                        document.getElementById('temp-article-template').style.display = "none";
                        self.setState({
                            ArticleList: _.concat(self.state.ArticleList, response.ArticleList),
                            BlogList: _.concat(self.state.BlogList, response.BlogList),
                            page: self.state.page + 1,
                            flag: 1
                        });
                    } else {
                        if (document.getElementById('loadMore'))
                            document.getElementById('loadMore').style.display = "none";
                    }
                });
            }
        })
    }

    blog(obj) {
        let template = null;
        let publishDate = new Date(obj.dt);
        var date = new Date();
        var hours = Math.abs(date - publishDate) / 36e5;
        if (hours <= 1) {
            publishDate = "just now"
        } else if (hours > 1 && hours <= 23) {
            publishDate = Math.floor(hours) + "h"
        } else if (hours > 23) {
            publishDate = ""
        }

        template = <div className="blogs-hm-section-two">
            <a href={"/news/" + obj.Id + "/" + obj.u}>
                <div className="wrapper">
                    <div className="four-by-five xs-sixteen-by-nine" style={{
                        backgroundImage: 'url(http://d7d7wuk1a7yus.cloudfront.net/article-images/0.86/' + obj.Id + '.jpg)',
                        paddingBottom: '116%', backgroundSize: 'cover'
                    }}>
                    </div>
                    <div className="content" style={{ top: 'auto' }}>
                        <div className="blog-pic-overlay blog-pic-overlay-hm" style={{ position: 'relative', verticalAlign: 'bottom' }}>
                            <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
                                <div className="blog-overlay-tag blog-overlay-tag-sm">
                                    {obj.h}
                                </div>
                                <div className="blog-overlay-title blog-overlay-title-sm" style={{ height: 'auto' }}>
                                    {obj.t}
                                </div>
                                <div className="featured-article-desc-row">
                                    <div className="author-details author-details-sm inline-block">
                                        <img className="inline" width="30" height="30" src={"https://d7d7wuk1a7yus.cloudfront.net/blogger-images/" + obj.bi + ".png"}
                                        />
                                        <p className="inline">
                                            {obj.bn}
                                        </p>
                                    </div>
                                    <div className="blog-time-and-comments blog-time-and-comments-sm pull-right inline-block">
                                        <div>
                                            <p className="inline">
                                                {publishDate}
                                            </p>
                                        </div>
                                        &nbsp;
                                                    <div>
                                            <i className="inline fa fa-comments-o"></i>
                                            <p className="inline">
                                                {obj.v}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        return template;
    }

    articleFirst(first) {
        let template = null;
        if (!first)
            return null;
        template = <div className="no-padding col-sm-6 col-xs-6">
            <a href={"/news/" + first.Id + "/" + first.u}>
                <div className="news-sm-block" style={{ width: '100%' }}>
                    <div className="single-news-block single-news-block-responsive">
                        <div className="wrapper" href={"/news/" + first.Id + "/" + first.u} style={{ height: '100px' }}>
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
        template = <div className="no-padding col-sm-6 col-xs-6">
            <a href={"/news/" + second.Id + "/" + second.u}>
                <div className="news-sm-block" style={{ width: '100%' }}>
                    <div className="single-news-block single-news-block-responsive">
                        <div className="wrapper" href={"/news/" + second.Id + "/" + second.u} style={{ height: '100px' }}>
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
        if (this.state.flag == 0)
            return null;
        if (this.state.ArticleList.length == 0 && this.state.BlogList.length == 0) {
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
        let template = null, blogtemp = null, _blog = null, counter = 0, first = null,
            second = null, articletempfirst = null, articletempsecond = null, loadMoreButton= null;

        let articles = _.chunk(this.state.ArticleList, 2);
        let featureArticle = _.chunk(this.state.BlogList, 1);
        if (articles.length > 0 && articles.length >= featureArticle.length) {
            template = articles.map((article, i) => {
                first = null, second = null;
                if (article.length == 2) {
                    first = article[0];
                    second = article[1];
                } else if (article.length == 1) {
                    first = article[0];
                }
                counter = counter + 1;
                if (counter <= featureArticle.length) {
                    _blog = featureArticle[i][0];
                } else {
                    _blog = null;
                    blogtemp = null;
                }
                if (_blog) {
                    blogtemp = this.blog(_blog);
                }
                return (
                    <div style={{ display: 'inline-block' }}>
                        {blogtemp}
                        <div className="no-margin-left no-padding col-sm-12 col-xs-12" style={{ paddingBottom: '15px !important' }}>
                            {this.articleFirst(first)}
                            {this.articleSecond(second)}
                        </div>
                    </div>
                );
            })
        } else if (featureArticle.length > 0 && featureArticle.length > articles.length) {
            counter = 0;
            template = featureArticle.map((featurearticle, i) => {
                first = null, second = null;
                counter = counter + 1;
                let article = articles[i];
                if (counter <= articles.length) {
                    if (article.length == 2) {
                        first = article[0];
                        second = article[1];
                    } else if (article.length == 1) {
                        first = article[0];
                    }
                }
                let _blog = this.blog(featurearticle[0]);
                if ((first || second) && _blog) {
                    return (
                        <div style={{ display: 'inline-block' }}>
                            {_blog}
                            <div className="no-margin-left no-padding col-sm-12 col-xs-12" style={{ paddingBottom: '15px !important' }}>
                                {this.articleFirst(first)}
                                {this.articleSecond(second)}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            {_blog}
                        </div>
                    );
                }
            })
            if (this.state.ArticleList.length >= 10) {
                loadMoreButton = <div id="loadMore" onClick={() => this.fetchData(this.state.page)}>
                    <a>Load More</a>
                </div>
            }
        }
        return (
            <div>
                <div>
                    {template}
                </div>
                {loadMoreButton}
            </div>
        );
    }
}

export default FeatureArticle;

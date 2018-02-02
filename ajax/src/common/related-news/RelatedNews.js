import React, { Component } from 'react';
import * as _ from 'lodash';

const isDesktop = window.innerWidth >= 767;

class RelatedNewsApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: []
        }
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        const self = this;
        // const apis = ['https://cig-staging-api.azurewebsites.net/articles/match/' + this.props.id + '/related'];
        const apis = ['https://cig-prod-api.azurewebsites.net/api/articles/match/3382/related'];        
        const url = apis[0];
        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Token PkpKCM6xF0ugysR/MNPRAQ');
        myHeaders.append('content-type', 'application/json');
    
        var myInit = { 
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default' 
        };
    
        fetch(url, myInit).then(function(response) {
          if (response.status === 200) {
            response.json().then(function(articles) {
                self.setState({
                    articles: isDesktop ? articles : _.chunk(articles, 2)
                });
            });
          }  
        });
    }

    render() {
        let template = null;
        if (isDesktop) {
            template =  <div className="articles-row">
                {this.state.articles.map((article, i) => {
                    return (
                        <a key={i} className="article-link" href={"/news/" + article.id + "/" + article.u}>
                            <div className="article-block">
                                <div className="wrapper">
                                    <div className="sixteen-by-nine" 
                                        style={{backgroundImage: "url(https://www.cricingif.com/Images/ArticleImages/1.78/" + article.id + ".jpg)"}}>
                                    </div>
                                    <div className="content"></div>
                                </div>
                                <div className="related-news-content">
                                    <div className="green-color-uppercase">{ article.ta }</div>
                                    <div className="news-sub-title">{ article.t }</div>                    
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        } else {
            template =  <div>
                {this.state.articles.map((articleChunk, j) => {
                    return( 
                    <div key={j} className="articles-row">
                        {articleChunk.map((article, i) => {
                            return (
                                <a key={i} className="article-link" href={"/news/" + article.id + "/" + article.u}>
                                    <div className="article-block">
                                        <div className="wrapper">
                                            <div className="sixteen-by-nine" 
                                                style={{backgroundImage: "url(https://www.cricingif.com/Images/ArticleImages/1.78/" + article.id + ".jpg)"}}>
                                            </div>
                                            <div className="content"></div>
                                        </div>
                                        <div className="related-news-content">
                                            <div className="green-color-uppercase">{ article.ta }</div>
                                            <div className="news-sub-title">{ article.t }</div>                    
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>)
                })}
            </div>
        }
        return template;
    }
}

export default RelatedNewsApp;

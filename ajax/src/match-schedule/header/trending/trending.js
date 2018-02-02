import React from 'react';

function TrendingNews(props) {
    return (
        <div className="trending-widget top-border-line no-display" style={{display: 'block'}}>
            <div className="rw-title">
                <p className="no-margin-bottom" style={{margin: 0}}> Trending - {props.articles.length} </p>
            </div>
            <div className="tr-content trendings">            
                {props.articles.map((article, i) => {
                    return article.ty === 2 && <Trending article={article} key={i}/>
                })}
            </div>
        </div>
    );
}

function Trending(props) {
    console.log(props.article);
    return (
        <a href={"/news/:" + props.article.id}>
            <p>{props.article.t}</p>
        </a>
    );
}

export default TrendingNews;

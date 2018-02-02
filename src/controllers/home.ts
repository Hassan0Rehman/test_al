import { Request, Response } from "express";
import  * as articleTextHelper  from "../helpers/article-text-helper";
import * as async from "async";
import * as _ from "lodash";
import * as fs from "fs";
import * as path from "path";
import * as uglifycss from "uglifycss";
import { Promise } from "bluebird";
import * as ejs from "ejs";
import * as customMemcache from "../helpers/memcache";
import * as redisCache  from "../helpers/redis-cache";
import * as request from "request";
import * as config from "../config/config";
import * as cachePubSub from "../helpers/cache-pub-sub";
const minify = require("html-minifier").minify;

function htmlToString(partialName: string, response: any) {
  let _data: any; const _keyName = _.kebabCase(partialName);
  if (_keyName === "schedule-widget") {
    _data = [
        {title: "Live Cricket", matches: <any>[]},
        {title: "Upcoming Matches", matches: <any>[]},
        {title: "Recently Finished", matches: <any>[]}
    ];
    _.each(response, function(match) {
      if (match.ms === 1) _data[0].matches.push(match);
      else if (match.ms === 2) _data[1].matches.push(match);
      else if (match.ms === 0) _data[2].matches.push(match);
    });
    return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + _keyName + ".ejs"), "utf8"), {[partialName]: _data});
  } else if (_keyName === "home-page") {
    _data = { articles: _.chunk(response[0], 3), featuredArticles: response[1] };
    return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/articles.ejs"), "utf8"), _data);
  } else {
    if (_keyName === "player-rankings" || _keyName === "team-rankings") {
      return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + _keyName + ".ejs"), "utf8"), response);
    }
    return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + _keyName + ".ejs"), "utf8"), {[partialName]: response});
  }
}

function requestApi(partialName: string, ) {
  return new Promise(function(resolve, reject) {
    const key = "__express__" + partialName;
    const _keyName = _.camelCase(partialName);
    if (partialName === "homePage") {
      async.parallel([function(next) { // 0
        request.get({
          url: config.index.base.prod + config.index["articles"].url,
          json: true,
          headers: {
            "Authorization": "Token HHiQLYvZnkGqfD5xzxr/Sw",
            "content-type" : "application/json"
          }
        }, function(error: any, response: any, body: any) {
          next(null, _.get(response, "body"));
        });
      }, function(next) { // 1
        request.get({
          url: config.index.base.prod + config.index["featured-articles"].url,
          json: true,
          headers: {
            "Authorization": "Token HHiQLYvZnkGqfD5xzxr/Sw",
            "content-type" : "application/json"
          }
        }, function(error: any, response: any, body: any) {
          next(null, _.get(response, "body"));
        });
      }], function(err: any, results: any) {
        const _articles = htmlToString("homePage", [results[0], results[1]]);
        customMemcache.default.setCache("homePage", _articles);
        redisCache.default.setCache("homePage", _articles, {exTime: 86400000});
        resolve({"homePage": _articles});
      });
    } else {
      const api = _.get(config.index, _.kebabCase(partialName));
      return request.get({
        url: config.index.base.prod + api.url,
        json: true,
        headers: {
          "Authorization": "Token HHiQLYvZnkGqfD5xzxr/Sw",
          "content-type" : "application/json"
        }
      }, function(error: any, response: any, body: any) {
        let _response = _.get(response, "body");
        if (partialName === "teamRankings") {
          _response = _.extend({}, {
            playerRankings: _response,
            selected: { filterName: "Test Batsman" },
            options: [{name: "Test"}, {name: "Odi"}, {name: "T20"}, {name: "Women"}]
          });
        }

        if (partialName === "playerRankings") {
          _response = _.extend({}, {
            playerRankings: _response,
            selected: { fileterName: "Test Batsman" },
            options: [{name: "Test Batsman", value: 1}, {name: "Test Bowlers", value: 2}, {name: "Odi Batsman", value: 3}, {name: "Odi Bowlers", value: 4}, {name: "T20 Batsman", value: 5}, {name: "T20 Bowlers", value: 6}, {name: "Women Odi Batsman", value: 7}, {name: "Women Odi Bowlers", value: 8}, {name: "Women T20 Batsman", value: 9}, {name: "Women T20 Bowlers", value: 10}]
          });
        }
        const _htmlStr = htmlToString(partialName, _response);
        redisCache.default.setCache(_keyName, _htmlStr, {exTime: 86400000});
        customMemcache.default.setCache([_keyName], _htmlStr);
        resolve({[_keyName]: _htmlStr});
      });
    }
  });
}

function getTemplate(key: string) {
  return new Promise(function(resolve, reject) {
    const _htmlStr = customMemcache.default.getCache(key);
    if (_htmlStr) {
      resolve({[key]: _htmlStr});
    } else {
      redisCache.default.getCache(key, function(redisResp: any) {
        if (redisResp) {
          customMemcache.default.setCache(key, redisResp);
          resolve({[key]: redisResp});
        } else {
          resolve(requestApi(key));
        }
      });
    }
  });
}
/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  console.log("START", new Date());
  const myCss = {
    style : fs.readFileSync(path.join(__dirname, "../public/css/main.css"), "utf8")
  };
  cachePubSub.default.start();
  // const widget = customMemcache.default.getCache("scheduleWidget"), homePage = customMemcache.default.getCache("homePage"),
  //   seriesHeaderDropdown = customMemcache.default.getCache("seriesHeaderDropdown"), trendingArticles = customMemcache.default.getCache("trendingArticles"),
  //   teamRankings = customMemcache.default.getCache("teamRankings"), playerRankings = customMemcache.default.getCache("playerRankings");
  //   if (widget && homePage && seriesHeaderDropdown && trendingArticles && teamRankings && playerRankings) {
  //   console.log(new Date(), "BEFORE PROCESS STRING MEMCAHCE");
  //   const minifyConfig = {
  //     collapseWhitespace: true,
  //     removeComments: true,
  //     minifyCSS: true,
  //     minifyJS: true
  //   };
  //   const obj =  {
  //     title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
  //     myCss: uglifycss.processString(myCss.style, {}),
  //     renderingContext: customMemcache.default.getCache("renderingContext"),
  //     matchWidgetTemplate: widget,
  //     articlesTemplate: homePage,
  //     seriesHeaderDropdownTemplate: seriesHeaderDropdown,
  //     trendingArticlesTemplate: trendingArticles,
  //     playerRankingTemplate: playerRankings,
  //     teamRankingTemplate: teamRankings
  //   };

  //   console.log(new Date(), "Before HOME render");
  //   const str = minify(ejs.render(fs.readFileSync(path.join(__dirname, "../../views/home-cache.ejs"), "utf8"), obj), minifyConfig);
  //   console.log(new Date(), "After HOME render");
  //   res.send(str).end();
  // } else {
    Promise.all([getTemplate("scheduleWidget"), getTemplate("homePage"), getTemplate("seriesHeaderDropdown"),
        getTemplate("trendingArticles"), getTemplate("playerRankings"), getTemplate("teamRankings")])
        .then(function(results) {
          const minifyConfig = {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
          };
          const obj =  {
            title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
            myCss: uglifycss.processString(myCss.style, {}),
            matchWidgetTemplate: _.get(results[0], "scheduleWidget"),
            articlesTemplate: _.get(results[1], "homePage"),
            seriesHeaderDropdownTemplate: _.get(results[2], "seriesHeaderDropdown"),
            trendingArticlesTemplate: _.get(results[3], "trendingArticles"),
            playerRankingTemplate: _.get(results[4], "playerRankings"),
            teamRankingTemplate: _.get(results[5], "teamRankings")
          };
          console.log(new Date(), "Before HOME render");
          const str = minify(ejs.render(fs.readFileSync(path.join(__dirname, "../../views/home-cache.ejs"), "utf8"), obj), minifyConfig);
          console.log(new Date(), "After HOME render");
          res.send(str);
        });

  //   Promise.all([redisCache.default.getCache("scheduleWidget", function(redisResp: any) {
  //     if (redisResp) {
  //       customMemcache.default.setCache("scheduleWidget", redisResp);
  //       return Promise.resolve({scheduleWidget: redisResp});
  //     } else {
  //       return requestApi("schedule-widget");
  //     }
  //   }), redisCache.default.getCache("homePage", function(redisResp: any) {
  //     if (redisResp) {
  //       customMemcache.default.setCache("homePage", redisResp);
  //       return Promise.resolve({articles: redisResp});
  //     } else {
  //       return requestApi("articles");
  //     }
  //   }), redisCache.default.getCache("seriesHeaderDropdown", function(redisResp: any) {
  //     if (redisResp) {
  //       customMemcache.default.setCache("seriesHeaderDropdown", redisResp);
  //       return Promise.resolve({seriesHeaderDropdown: redisResp});
  //     } else {
  //       return requestApi("series-header-dropdown");
  //     }
  //   }), redisCache.default.getCache("trendingArticles", function(redisResp: any) {
  //     if (redisResp) {
  //       customMemcache.default.setCache("trendingArticles", redisResp);
  //       return Promise.resolve({trendingArticles: redisResp});
  //     } else {
  //       return requestApi("trending-articles");
  //     }
  //   }), redisCache.default.getCache("teamRankings", function(redisResp: any) {
  //     if (redisResp) {
  //       customMemcache.default.setCache("teamRankings", redisResp);
  //       return Promise.resolve({teamRankings: redisResp});
  //     } else {
  //       return requestApi("team-rankings");
  //     }
  //   }), redisCache.default.getCache("playerRankings", function(redisResp: any) {
  //     if (redisResp) {
  //       customMemcache.default.setCache("playerRankings", redisResp);
  //       return Promise.resolve({playerRankings: redisResp});
  //     } else {
  //       return requestApi("player-rankings");
  //     }
  //   })]).then(function(results) {
  //     console.log("RESPONSE RENDER ", new Date());
  //     res.render("home", {
  //       title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
  //       myCss: uglifycss.processString(myCss.style, {}),
  //       renderingContext: "Initialized with from Redis Cache or API fallback. No update yet.. !!",
  //       matchWidgetTemplate: results[0].scheduleWidget,
  //       articlesTemplate: results[1].articles,
  //       seriesHeaderDropdownTemplate: results[2].seriesHeaderDropdown,
  //       trendingArticlesTemplate: results[3].trendingArticles,
  //       teamRankingTemplate: results[4].teamRankings,
  //       playerRankingTemplate: results[5].playerRankings
  //     });
  //     console.log("RESPONSE RENDER END ", new Date());
  //   }, function(error) {
  //     console.log(error);
  //   });
  // }

  // async.parallel([
  //   function(next) {
  //     redisCache.default.getCache("scheduleWidget", function(redisResp: any) {
  //       console.log("RECIEVED schedule");
  //       if (redisResp) next(null, {scheduleWidget: redisResp});
  //       else requestApi("schedule-widget", next);
  //     });
  //   }, function(next) {
  //     redisCache.default.getCache("articles", function(redisResp: any) {
  //       console.log("RECIEVED Articles");
  //       if (redisResp) next(null, redisResp);
  //       else requestApi("articles", next);
  //     });
  //   }, function(next) {
  //     redisCache.default.getCache("featuredArticles", function(redisResp: any) {
  //       console.log("RECIEVED featuredArticles");
  //       if (redisResp) next(null, {featuredArticles: redisResp});
  //       else requestApi("featured-articles", next);
  //     });
  //   }], function(err, results) {
  //     console.log("RESPONSE END", new Date());
  //     const _articles = JSON.parse(results[1] as string);
  //     res.render("home", {
  //       title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
  //       myCss: uglifycss.processString(myCss.style, {}),
  //       matchWidgetTemplate: (results[0] as any).scheduleWidget,
  //       articles: _articles.arr,
  //       featuredArticlesTemplate: (results[2] as any).featuredArticles
  //     });
  //     console.log("RESPONSE RENDER END", new Date());
  //   });

  // Promise.all([customMemcache.default.cache("schedule-widget", 18000), customMemcache.default.cache("articles", 18000),
  //   customMemcache.default.cache("featured-articles", 18000)])
  //   .then(function(results) {
  //     console.log("RENDER START", new Date());
  //     res.render("home", {
  //       title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
  //       myCss: uglifycss.processString(myCss.style, {}),
  //       matchWidgetTemplate: (results[0] as any).scheduleWidget,
  //       articles: (results[1] as any).articles,
  //       featuredArticlesTemplate: (results[2] as any).featuredArticles
  //     });
  //     console.log("RENDER END", new Date());
  // });

    // Promise.all([redisCache.default.getCache("scheduleWidget", function(redisResp: any) {
  //   if (redisResp) return Promise.resolve({scheduleWidget: redisResp});
  //   else return requestApi("schedule-widget");
  // }), redisCache.default.getCache("homePage", function(redisResp: any) {
  //   if (redisResp) {
  //     return Promise.resolve(JSON.parse(redisResp));
  //   } else {
  //     return requestApi("homePage");
  //   }
  // })]).then(function(results) {
  //   console.log("RESPONSE RENDER ", new Date());
  //   res.render("home", {
  //     title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
  //     myCss: uglifycss.processString(myCss.style, {}),
  //     matchWidgetTemplate: results[0].scheduleWidget,
  //     articlesTemplate: results[1].seriesArticles,
  //     seriesHeaderDropdownTemplate: results[1].seriesHeaderDropdown,
  //     trendingArticlesTemplate: results[1].trendingArticles,
  //     playerRankingTemplate: results[1].playerRankingTemplate,
  //     teamRankingTemplate: results[1].teamRankingTemplate
  //   });
  //   console.log("RESPONSE RENDER END ", new Date());
  // }, function(error) {
  //   console.log(error);
  // });
};

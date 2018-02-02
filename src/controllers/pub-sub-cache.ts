import { Request, Response, NextFunction } from "express";
import * as pubSubCache from "../helpers/cache-pub-sub";
import * as memCache from "../helpers/memcache";
import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";
import * as async from "async";
import * as config from "../config/config";
import * as _ from "lodash";
import * as redisCache  from "../helpers/redis-cache";
import { Promise } from "bluebird";
import * as uglifycss from "uglifycss";
import * as request from "request";

/**
 * GET /
 * Home page.
 */
function htmlToString(partialName: string, response: any) {
    let _data: any; const _keyName = _.camelCase(partialName);
    if (partialName === "schedule-widget") {
      _data = [
          {title: "Live Cricket", matches: <any>[]},
          {title: "Upcoming Matches", matches: <any>[]},
          {title: "Recently Finished", matches: <any>[]}
      ];
      _.each(response, function(match) {
        if (match.mt === "1") _data[0].matches.push(match);
        else if (match.mt === "2") _data[1].matches.push(match);
        else if (match.mt === "3") _data[2].matches.push(match);
      });
      return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + partialName + ".ejs"), "utf8"), {[_keyName]: _data});
    } else if (partialName === "articles") {
      _data = { articles: _.chunk(response[0], 3), featuredArticles: response[1] };
      return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/articles.ejs"), "utf8"), _data);
    } else {
      if (partialName === "player-rankings" || partialName === "team-rankings") {
        return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + partialName + ".ejs"), "utf8"), response);
      }
      return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + partialName + ".ejs"), "utf8"), {[_keyName]: response});
    }
}

function requestApi(partialName: string) {
    return new Promise(function(resolve, reject) {
      const key = "__express__" + partialName;
      const _keyName = _.camelCase(partialName);
      if (partialName === "articles") {
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
          const _articles = htmlToString("articles", [results[0], results[1]]);
          redisCache.default.setCache("homePage", _articles, {exTime: 86400000});
          resolve(_articles);
        });
      } else {
        const api = _.get(config.index, partialName);
        return request.get({
          url: config.index.base.prod + api.url,
          json: true,
          headers: {
            "Authorization": "Token HHiQLYvZnkGqfD5xzxr/Sw",
            "content-type" : "application/json"
          }
        }, function(error: any, response: any, body: any) {
          let _response = _.get(response, "body");
          if (partialName === "team-rankings") {
            _response = _.extend({}, {
              playerRankings: _response,
              selected: { filterName: "Test Batsman" },
              options: [{name: "Test"}, {name: "Odi"}, {name: "T20"}, {name: "Women"}]
            });
          }

          if (partialName === "player-rankings") {
            _response = _.extend({}, {
              playerRankings: _response,
              selected: { fileterName: "Test Batsman" },
              options: [{name: "Test Batsman", value: 1}, {name: "Test Bowlers", value: 2}, {name: "Odi Batsman", value: 3}, {name: "Odi Bowlers", value: 4}, {name: "T20 Batsman", value: 5}, {name: "T20 Bowlers", value: 6}, {name: "Women Odi Batsman", value: 7}, {name: "Women Odi Bowlers", value: 8}, {name: "Women T20 Batsman", value: 9}, {name: "Women T20 Bowlers", value: 10}]
            });
          }
          const _htmlStr = htmlToString(partialName, _response);
          redisCache.default.setCache(_keyName, _htmlStr, {exTime: 86400000});
          resolve(_htmlStr);
        });
      }
    });
}
const j = 0;
export let index = (req: Request, res: Response) => {
  memCache.default.clearCache();
  res.send(200);
    // const keys = [
    //     {name: "renderingContext", value: j++, partialName: "schedule-widget"},
    //     {name: "scheduleWidget", value: "", partialName: "schedule-widget"},
    //     {name: "homePage", value: "", partialName: "articles"},
    //     {name: "seriesHeaderDropdown", value: "", partialName: "series-header-dropdown"},
    //     {name: "trendingArticles", value: "", partialName: "trending-articles"},
    //     {name: "teamRankings", value: "", partialName: "team-rankings"},
    //     {name: "playerRankings", value: "", partialName: "player-rankings"}
    // ], asyncPromises = [];
    // pubSubCache.default.publish("cig-template-cache", JSON.stringify(keys[0]));
    // res.send("Cache Set : " + JSON.stringify(keys[0]));
    // for (let i = 0; i < keys.length; i++) {
    //     asyncPromises.push(redisCache.default.getCache(keys[i].name, function(resp: any) {
    //         if (!resp) {
    //             return requestApi(keys[i].partialName).then(function(result) {
    //                 return Promise.resolve(result);
    //             });
    //         } else {
    //             return Promise.resolve(resp);
    //         }
    //     }));
    // }

    // Promise.all(asyncPromises).then(function(results) {
    //     const myCss = {
    //         style : fs.readFileSync(path.join(__dirname, "../public/css/main.css"), "utf8")
    //     };
    //     const _data = {
    //         title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
    //         myCss: uglifycss.processString(myCss.style, {}),
    //         matchWidgetTemplate: results[0],
    //         articlesTemplate: results[1],
    //         seriesHeaderDropdownTemplate: results[2],
    //         trendingArticlesTemplate: results[3],
    //         teamRankingTemplate: results[4],
    //         playerRankingTemplate: results[5]
    //     };

    //     memCache.default.clearCache();
    //     const homeHtml = ejs.render(fs.readFileSync(path.join(__dirname, "../../views/home-cache.ejs"), "utf8"), _data);
    //     memCache.default.setCache("__express__", homeHtml);
    //     console.log("CACHE SET");
    // });
};


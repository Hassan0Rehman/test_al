import { Request, Response } from "express";
import * as request from "request";
import  * as articleTextHelper  from "../helpers/article-text-helper";
import * as async from "async";
import * as config from "../config/config";
import * as _ from "lodash";
import * as redisCache  from "../helpers/redis-cache";
import * as ejs from "ejs";
import * as path from "path";
import * as fs from "fs";

function htmlToString(partialName: string, response: any) {
  let _data: any; const _keyName = _.camelCase(partialName);
  if (partialName === "schedule-widget") {
    const _matchTimings = response;
    _data = [
        {title: "Live Cricket", matches: <any>[]},
        {title: "Upcoming Matches", matches: <any>[]},
        {title: "Recently Finished", matches: <any>[]}
    ];
    _.each(_matchTimings, function(match) {
      if (match.mt === "1") _data[0].matches.push(match);
      else if (match.mt === "2") _data[1].matches.push(match);
      else if (match.mt === "3") _data[2].matches.push(match);
    });
    const _body = ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + partialName + ".ejs"), "utf8"), {[_keyName]: _data});
    console.log(partialName, new Date());
    redisCache.default.setCache("scheduleWidget-5", _body, {exTime: 10000});
    return {[_keyName]: _body};
  }
}

function requestApi(partialName: string, id: any) {
  const api = _.get(config.index, partialName);
  const url = id ? config.index.base.prod + api.url + "/" + id : config.index.base.prod + api.url;
  return new Promise(function(resolve, reject) {
    return request.get({
      url: url,
      json: true,
      headers: {
        "Authorization": "Token HHiQLYvZnkGqfD5xzxr/Sw",
        "content-type" : "application/json"
      }
    }, function(error: any, response: any, body: any) {
      if (partialName !== "schedule-widget") {
        const _articleResponse = response.body;
        const _srcString = _articleResponse.d.replace(/\n/g, " ");
        resolve({
          title: _articleResponse.t,
          seriesName: _articleResponse.ta.split(",")[0] ? _articleResponse.ta.split(",")[0] : _articleResponse.ta,
          srcString: _srcString,
          tagsStartIndices: articleTextHelper.default.getIndicesOf("{{", _srcString),
          tagsEndIndices: articleTextHelper.default.getIndicesOf("}}", _srcString),
          authorName: _articleResponse.bf + " " + _articleResponse.bl,
          authorPicId: _articleResponse.bi
        });
      } else {
        resolve(htmlToString(partialName, response.body));
      }
    });
  });
}
/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  const storyId = _.parseInt(_.get(req, "params.id"));

  Promise.all([redisCache.default.getCache("scheduleWidget", function(redisResp: any) {
    if (redisResp) return Promise.resolve({scheduleWidget: redisResp});
    else return requestApi("schedule-widget", null);
  }), redisCache.default.getCache("seriesHeaderDropdown", function(redisResp: any) {
    if (redisResp) return Promise.resolve({series: redisResp});
    else return requestApi("series-header-dropdown", null);
  }), redisCache.default.getCache("trendingArticles", function(redisResp: any) {
    if (redisResp) return Promise.resolve({trendingArticles: redisResp});
    else return requestApi("trending-articles", null);
  }), redisCache.default.getCache("stories", function(redisResp: any) {
    if (redisResp) return Promise.resolve({trendingArticles: redisResp});
    else return requestApi("stories", storyId);
  })]).then(function(results) {
    console.log("RESPONSE RENDER ", new Date());
    res.render("stories", {
      title: results[3].title,
      seriesName: results[3].seriesName,
      srcString: results[3].srcString,
      tagsStartIndices: results[3].tagsStartIndices,
      tagsEndIndices: results[3].tagsEndIndices,
      authorName: results[3].authorName,
      authorPicId: results[3].authorPicId,
      trendingArticlesTemplate: results[2].trendingArticles,
      seriesHeaderDropdownTemplate: results[1].series,
      matchWidgetTemplate: results[0].scheduleWidget
    });
    console.log("RESPONSE RENDER END ", new Date());
  }, function(error) {
    console.log(error);
  });
};

import { Request, Response } from "express";
import { Promise } from "bluebird";
import * as _ from "lodash";
import * as customMemcache from "../../helpers/memcache";
import * as redisCache  from "../../helpers/redis-cache";
import * as cachePubSub from "../../helpers/cache-pub-sub";
import * as serverPathHelper from "../../helpers/server-path-helper";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as supportedDevices from "../../config/supported-devices";
import * as userRegion from "../../helpers/region-middleware";
import * as api from "./match.api";
import * as parser from "./match.parser";

const matchParser = parser.default;
const matchApi = api.default;

function getTemplate(key: string, id: any) {
  const _key = id ? key + "-" + id : key;
  return new Promise(function(resolve, reject) {
    const _userAgent = useragentMiddleware.default.getDevice();
    const _devicePrefix = _userAgent === supportedDevices.index.desktop ? "-isDesktop" : "-isMobile";
    const _htmlStr = customMemcache.default.getCache(_key + _devicePrefix);
    if (_htmlStr) {
      const _isMemCached = key === "scorecard" ? JSON.parse(_htmlStr) : _htmlStr;
      resolve(_isMemCached);
    } else {
      redisCache.default.getCache(_key + _devicePrefix, function(redisResp: any) {
        if (redisResp) {
          const _isRedisCached = key === "scorecard" ? JSON.parse(redisResp) : redisResp;
          customMemcache.default.setCache(_key + _devicePrefix, _isRedisCached);
          resolve(_isRedisCached);
        } else {
          return matchApi.requestApi(key, id).then(function(response: any) {
            const _htmlStr = matchParser.htmlToString(key, response);
            const _isObj = key === "scorecard" ? JSON.stringify(_htmlStr) : _htmlStr;
            redisCache.default.setCache(_key + _devicePrefix, _isObj, {exTime: 86400000});
            customMemcache.default.setCache(_key + _devicePrefix, _isObj);
            resolve(_htmlStr);
          });
        }
      });
    }
  });
}

/**
 * GET /
 * Home page.
 */
export let index = (req: Request & { useragent: any }, res: Response) => {
  console.log("START", new Date());
  const matchId = _.parseInt(_.get(req, "params.id"));
  if (matchId) {
    Promise.all([getTemplate("matchOverview", matchId), getTemplate("scorecard", matchId)])
    .then(function(results: any) {
        const _userAgent = useragentMiddleware.default.getDevice();
        const _css = _userAgent === supportedDevices.index.desktop ? matchParser.getCss().style : matchParser.getMobileCss().style;
        const obj =  {
          title: "Live Match",
          myCss: _css,
          matchOverviewTemplate: results[0],
          scoreCard: results[1],
          videoStreamUrl: _.get(results[1].smallScorecard, "strh"),
          matchState: _.get(results[1].smallScorecard, "ms"),
          matchId: matchId,
          closingComment: _.get(results[1], "closingComment"),
          allInnings: JSON.stringify(results[1].allInns),
          jsChunk: serverPathHelper.default.getJsChunk(),
          allowVideo: userRegion.default.allowVideo(req.cookies, results[1].sst),
          allowGif: userRegion.default.allowVideo(req.cookies, results[1].sct),
          matchTime: _.get(results[1].smallScorecard, "mti"),
          matchLocation: _.get(results[1].smallScorecard, "ml")
        };
        if (_userAgent === supportedDevices.index.mobile) {
          // const renderedHtml = homeParser.getMobileHomePage(obj);
          // res.send(renderedHtml);
          res.render("match-mobile.ejs", obj);
          console.log("END", new Date());
          return;
        } else if (_userAgent === supportedDevices.index.desktop) {
          // const renderedHtml = homeParser.getHomePage(obj);
          // res.send(renderedHtml);
          res.render("match-desktop.ejs", obj);
          console.log("END", new Date());
          return;
        } else {
          // const renderedHtml = homeParser.getHomePage(obj);
          // res.send(renderedHtml);
          res.render("match-desktop.ejs", obj);
          console.log("END", new Date());
          return;
        }
    });
  }
};

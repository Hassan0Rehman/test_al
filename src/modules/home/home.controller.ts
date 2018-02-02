import { Request, Response } from "express";
import { Promise } from "bluebird";
import * as _ from "lodash";
import * as customMemcache from "../../helpers/memcache";
import * as redisCache  from "../../helpers/redis-cache";
import * as cachePubSub from "../../helpers/cache-pub-sub";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as serverPathHelper from "../../helpers/server-path-helper";
import * as supportedDevices from "../../config/supported-devices";
import * as api from "./home.api";
import * as parser from "./home.parser";

const homeParser = parser.default;
const homeApi = api.default;

function getTemplate(key: string) {
  return new Promise(function(resolve, reject) {
    const _userAgent = useragentMiddleware.default.getDevice();
    const _devicePrefix = _userAgent === supportedDevices.index.desktop ? "-isDesktop" : "-isMobile";
    const _htmlStr = customMemcache.default.getCache(key + _devicePrefix);
    if (_htmlStr) {
      resolve(_htmlStr);
    } else {
      redisCache.default.getCache(key + _devicePrefix, function(redisResp: any) {
        if (redisResp) {
          customMemcache.default.setCache(key + _devicePrefix, redisResp);
          resolve(redisResp);
        } else {
          return homeApi.requestApi(key).then(function(response: any) {
            if (response === "ERROR") {
              console.log("ERROR FETCHING API.. !!");
              resolve("ERROR");
            } else {
              const _htmlStr = homeParser.htmlToString(key, response);
              redisCache.default.setCache(key, _htmlStr, {exTime: 86400000});
              customMemcache.default.setCache(key, _htmlStr);
              resolve(_htmlStr);
            }
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
    Promise.all([getTemplate("scheduleWidget"), getTemplate("homePage"),
      getTemplate("trendingArticles"), getTemplate("playerRankings"), getTemplate("teamRankings")])
      .then(function(results) {
          const _userAgent = useragentMiddleware.default.getDevice();
          const _css = _userAgent === supportedDevices.index.desktop ? homeParser.getCss().style : homeParser.getMobileCss().style;
          // const _css = homeParser.getMobileCss().style;
          const obj =  {
            title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
            myCss: _css,
            matchWidgetTemplate: results[0],
            articlesTemplate: results[1],
            trendingArticlesTemplate: results[2],
            playerRankingTemplate: results[3],
            teamRankingTemplate: results[4],
            jsChunk: serverPathHelper.default.getJsChunk()
          };
          if (_userAgent === supportedDevices.index.desktop) {
            // const renderedHtml = homeParser.getHomePage(obj);
            // res.send(renderedHtml);
            res.render("home-desktop.ejs", obj);
            console.log("END", new Date());
            return;
          }
          if (_userAgent === supportedDevices.index.mobile) {
            // const renderedHtml = homeParser.getMobileHomePage(obj);
            // res.send(renderedHtml);
            res.render("home-mobile.ejs", obj);
            console.log("END", new Date());
            return;
          }
      });
};

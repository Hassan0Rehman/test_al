import { Request, Response } from "express";
import { Promise } from "bluebird";
import * as _ from "lodash";
import * as customMemcache from "../../helpers/memcache";
import * as redisCache from "../../helpers/redis-cache";
import * as cachePubSub from "../../helpers/cache-pub-sub";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as supportedDevices from "../../config/supported-devices";
import * as serverPathHelper from "../../helpers/server-path-helper";
import * as parser from "./series.parser";
import * as api from "./series.api";

const seriesParser = parser.default;
const seriesApi = api.default;

function getTemplate(key: string, id: any) {
  const _key = id ? key + "-" + id : key;
  return new Promise(function (resolve, reject) {
    const _userAgent = useragentMiddleware.default.getDevice();
    const _devicePrefix = _userAgent === supportedDevices.index.desktop ? "-isDesktop" : "-isMobile";
    const _htmlStr = customMemcache.default.getCache(_key + _devicePrefix);
    if (_htmlStr) {
      resolve(_htmlStr);
    } else {
      redisCache.default.getCache(_key + _devicePrefix, function (redisResp: any) {
        if (redisResp) {
          customMemcache.default.setCache(_key + _devicePrefix, redisResp);
          resolve(redisResp);
        } else {
          return seriesApi.requestApi(key, id).then(function (response: any) {
            if (response === "ERROR") {
              console.log("ERROR FETCHING API.. !!");
              resolve("ERROR");
            } else {
              const _htmlStr = seriesParser.htmlToString(key, response);
              redisCache.default.setCache(_key + _devicePrefix, _htmlStr, { exTime: 86400000 });
              customMemcache.default.setCache(_key + _devicePrefix, _htmlStr);
              resolve(_htmlStr);
            }
          });
        }
      });
    }
  });
}


export let index = (req: Request & { useragent: any }, res: Response) => {
  const seriesId = _.parseInt(_.get(req, "params.id"));
  const  url = _.get(req, "params.title");
  Promise.all([getTemplate("seriesWidget", seriesId), getTemplate("seriesPage-article", seriesId),
  getTemplate("trendingArticles", null), getTemplate("seriesSquad", seriesId)])
    .then(function (results) {
      // getTemplate("trendingArticles", null)
      const _userAgent = useragentMiddleware.default.getDevice();
      const _css = _userAgent === supportedDevices.index.desktop ? seriesParser.getCss().style : seriesParser.getMobileCss().style;
      const outerHtmlElement: any = results[0];
      const obj = {
        title: "Series | Cricingif",
        seriesCss: _css,
        seriesId: seriesId,
        seriesWidgetTemplate: outerHtmlElement.seriesWidgetTemplate,
        seriesArticleTemplate: results[1],
        trendingArticlesTemplate: results[2],
        seriesSquadTemplate: results[3],
        seriesMatchs: outerHtmlElement.seriesHeadings,
        seriesTitle: url,
        userRegion: req.cookies.region,
        jsChunk: serverPathHelper.default.getJsChunk()
      };
      if (_userAgent === supportedDevices.index.desktop) {
        res.render("series-desktop.ejs", obj);
        console.log("END", new Date());
        return;
      } else if (_userAgent === supportedDevices.index.mobile) {
        res.render("series-mobile.ejs", obj);
        console.log("END", new Date());
        return;
      } else {
        res.render("series-desktop.ejs", obj);
        console.log("END", new Date());
        return;
      }
    });
};
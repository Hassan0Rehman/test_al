import { Request, Response } from "express";
import { Promise } from "bluebird";
import * as customMemcache from "../../helpers/memcache";
import * as redisCache  from "../../helpers/redis-cache";
import * as cachePubSub from "../../helpers/cache-pub-sub";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as supportedDevices from "../../config/supported-devices";
import * as serverPathHelper from "../../helpers/server-path-helper";
import * as api from "./stories.api";
import * as parser from "./stories.parser";
import * as _ from "lodash";

const storiesParser = parser.default;
const storiesApi = api.default;

function getTemplate(key: string, id: any, req: Request) {
    const _key = id ? key + "-" + id : key;
    return new Promise(function(resolve, reject) {
      const _userAgent = useragentMiddleware.default.getDevice();
      const _devicePrefix = _userAgent === supportedDevices.index.desktop ? "-isDesktop" : "-isMobile";
      const _htmlStr = customMemcache.default.getCache(_key + _devicePrefix);
      if (_htmlStr) {
        const _isMemCached = key === "stories" ? JSON.parse(_htmlStr) : _htmlStr;
        resolve(_isMemCached);
      } else {
        redisCache.default.getCache(_key + _devicePrefix, function(redisResp: any) {
          if (redisResp) {
            const _isRedisCached = key === "stories" ? JSON.parse(redisResp) : redisResp;
            customMemcache.default.setCache(_key + _devicePrefix, _isRedisCached);
            resolve(_isRedisCached);
          } else {
            return storiesApi.requestApi(key, id).then(function(response: any) {
              const _htmlStr = storiesParser.htmlToString(key, response, req);
              const _isObj = key === "stories" ? JSON.stringify(_htmlStr) : _htmlStr;
              redisCache.default.setCache(_key + _devicePrefix, _isObj, {exTime: 86400000});
              customMemcache.default.setCache(_key + _devicePrefix, _isObj);
              resolve(_htmlStr);
            });
          }
        });
      }
    });
}
export let index = (req: Request, res: Response) => {
  console.log("START", new Date());
  const storyId = _.parseInt(_.get(req, "params.id"));
  if (storyId) {
    Promise.all([getTemplate("scheduleWidget", null, req), getTemplate("stories", storyId, req),
                getTemplate("trendingArticles", null, req)])
    .then(function(results: any) {
        const _userAgent = useragentMiddleware.default.getDevice();
        const _css = _userAgent === supportedDevices.index.desktop ? storiesParser.getCss().style : storiesParser.getMobileCss().style;
        // const _css = storiesParser.getMobileCss().style;
        const obj = {
          myCss: _css,
          matchWidgetTemplate: results[0],
          storyContentTemplate: results[1].storyContent,
          title: results[1].title,
          seriesName: results[1].tags.split(",")[0] ? results[1].tags.split(",")[0] : results[1].tags,
          authorName: results[1].bloggerFName + " " + results[1].bloggerLName,
          authorPicId: results[1].bloggerId,
          tags: results[1].tags.split(", "),
          id: results[1].id,
          url: results[1].url.split("?")[0],
          articletype: results[1].article_type,
          linkPostUrl: results[1].linkPostUrl,
          trendingArticlesTemplate: results[2],
          userRegion: req.cookies.region,
          jsChunk: serverPathHelper.default.getJsChunk()
        };
        if (_userAgent === supportedDevices.index.desktop) {
          // const renderedHtml = storiesParser.getStoriesPage(obj);
          // res.send(renderedHtml);
          if (obj.linkPostUrl === null || obj.linkPostUrl === "") {
            obj.linkPostUrl = "https://d7d7wuk1a7yus.cloudfront.net/static-assets/logo.png";
          }
          res.render("stories-desktop.ejs", obj);
          console.log("END", new Date());
        }
        if (_userAgent === supportedDevices.index.mobile) {
          // const renderedHtml = storiesParser.getMobileStoriesPage(obj);
          // res.send(renderedHtml);
          if (obj.linkPostUrl === null || obj.linkPostUrl === "") {
            obj.linkPostUrl = "https://d7d7wuk1a7yus.cloudfront.net/static-assets/logo.png";
          }
          res.render("stories-mobile.ejs", obj);
          console.log("END", new Date());
        }
    });
  }
};

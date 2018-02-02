import * as config from "../config/config";
import * as mcache from "memory-cache";
import * as request from "request";
import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";
import { Promise } from "bluebird";
import * as useragentMiddleware from "../helpers/useragent-middleware";
import * as supportedDevices from "../config/supported-devices";
import * as redisCache  from "./redis-cache";

function setCache(key: any, value: any) {
  mcache.put(key, value, 900000);
}

function getCache(key: any) {
  return mcache.get(key);
}

function clear() {
  mcache.clear();
}

function delKey(key: string) {
  mcache.del(key);
}

const cache = (key: string, duration: any) => {
  return (req: any, res: any, next: any) => {
    let _key = ""; const _userAgent = useragentMiddleware.default.getDevice();
    if (_userAgent === supportedDevices.index.desktop) {
      _key = key + "-isDesktop";
    }
    if (_userAgent === supportedDevices.index.mobile) {
      _key = key + "-isMobile";
    }
    const cachedBody = getCache(_key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body: any) => {
        setCache(_key, body);
        res.sendResponse(body);
      };
      next();
    }
  };
};

export default <any> {
  cache: cache,
  clearCache: clear,
  getCache: getCache,
  setCache: setCache,
  delKey: delKey
};

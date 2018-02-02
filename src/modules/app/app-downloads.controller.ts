import * as supportedDevices from "../../config/supported-devices";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import { Request, Response } from "express";
import * as customMemcache from "../../helpers/memcache";

import * as parser from "./app-downloads.parser";
const appParser = parser.default;



export let index = (req: Request & { useragent: any }, res: Response) => {
    const _css = appParser.getCss().style;
    const obj = {
        title: "Live cricket score, live streaming and ball by ball highlights| Cricingif",
        appCss: _css
      };
    const renderedHtml = appParser.getAppPage(obj);
    res.send(renderedHtml);
    return;
};
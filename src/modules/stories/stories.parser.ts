import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import * as uglifycss from "uglifycss";
import { Request } from "express";
import * as _ from "lodash";
import * as mapper from "../api-mapper/mapper";
import  * as articleTextHelper  from "../../helpers/article-text-helper";
import * as serverPathHelper from "../../helpers/server-path-helper";
const minify = require("html-minifier").minify;
import * as userRegion from "../../helpers/region-middleware";

function htmlToString(partialName: string, response: any, req: Request) {
    let _data: any = null, _formattedResponse = null; const _keyName = _.kebabCase(partialName);
    if (_keyName === "schedule-widget") {
      _formattedResponse = mapper.default.map(partialName, response);
      _data = [
        {title: "Recently Finished", matches: <any>[], val: 0},
        {title: "Live Cricket", matches: <any>[], val: 1},
        {title: "Upcoming Matches", matches: <any>[], val: 2}
      ];
      _.each(_formattedResponse, function(match) {
        if (match.matchState === 0) _data[0].matches.push(match);
        else if (match.matchState === 1) _data[1].matches.push(match);
        else if (match.matchState === 2) _data[2].matches.push(match);
      });
      const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/" + _keyName + ".ejs");
      console.log(_viewPath);
      return ejs.render(fs.readFileSync(_viewPath, "utf8"), {[partialName]: _data});
    } else if (_keyName === "stories") {
        _formattedResponse = mapper.default.map(partialName, response);
        const _srcString = _formattedResponse.description.replace(/\n/g, " ");
        const finalString = articleTextHelper.default.resolve_Iframe_Blockqoute(_srcString);
        const region = JSON.parse(_.get(req.cookies, "cig-location"));
        _data = {
            srcString: finalString,
            tagsStartIndices: articleTextHelper.default.getIndicesOf("{{", finalString),
            tagsEndIndices: articleTextHelper.default.getIndicesOf("}}", finalString),
            userRegion: _.get(region, "country_code")
        };
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/stories/story-content.ejs");
        console.log(_viewPath);
        let _obj = {
            "storyContent": ejs.render(fs.readFileSync(_viewPath, "utf8"), _data)
        };
        _obj = _.extend(_obj, _formattedResponse);
        return _obj;
    } else {
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/" + _keyName + ".ejs");
        console.log(_viewPath);
        return ejs.render(fs.readFileSync(_viewPath, "utf8"), {[partialName]: response});
    }
}

function getCss() {
    return  {
        style : uglifycss.processString(fs.readFileSync(serverPathHelper.default.get().serverPath + "/public/css/stories-desktop.css", "utf8"))
    };
}

function getMobileCss() {
    return  {
        style : uglifycss.processString(fs.readFileSync(serverPathHelper.default.get().serverPath + "/public/css/stories-mobile.css", "utf8"))
    };
}

function getMobileStoriesPage(pageData: any) {
    const minifyConfig = {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    };
    const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/stories-mobile.ejs");
    console.log(_viewPath);
    return minify(ejs.render(fs.readFileSync(_viewPath, "utf8"), pageData), minifyConfig);
}

function getStoriesPage(pageData: any) {
    const minifyConfig = {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    };
    const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/stories-desktop.ejs");
    console.log(_viewPath);
    return minify(ejs.render(fs.readFileSync(_viewPath, "utf8"), pageData), minifyConfig);
}

export default <any> {
    htmlToString: htmlToString,
    getCss: getCss,
    getMobileCss: getMobileCss,
    getStoriesPage: getStoriesPage,
    getMobileStoriesPage: getMobileStoriesPage
};

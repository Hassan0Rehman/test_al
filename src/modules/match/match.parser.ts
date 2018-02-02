import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import * as uglifycss from "uglifycss";
import * as _ from "lodash";
import * as matchMapper from "./match.mapper";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as serverPathHelper from "../../helpers/server-path-helper";
import * as supportedDevices from "../../config/supported-devices";
const minify = require("html-minifier").minify;

const imageUrls = [
    {env: "staging", url: "https://www.cricingif.com/Images/ArticleImages"},
    {env: "production", url: "http://d7d7wuk1a7yus.cloudfront.net/article-images"}
];

function htmlToString(partialName: string, response: any) {
    const _keyName = _.kebabCase(partialName),
        _userAgent = useragentMiddleware.default.getDevice(),
        _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/match/" + _keyName + ".ejs"),
        _formattedResponse = matchMapper.default.map(partialName, response);
    if (_keyName === "scorecard") {
        _.set(_formattedResponse, "userAgent", _userAgent);
        let _obj = {
            "scoreCardTemplate": ejs.render(fs.readFileSync(_viewPath, "utf8"), _formattedResponse)
        };
        _obj = _.extend(_obj, _formattedResponse);
        return _obj;
    } else if (_keyName === "match-overview") {
        return ejs.render(fs.readFileSync(_viewPath, "utf8"), {[partialName]: _formattedResponse});
    }
}

function getMobileCss() {
    return  {
        style : uglifycss.processString(fs.readFileSync(serverPathHelper.default.get().serverPath + "/public/css/match-mobile.css", "utf8"))
    };
}

function getCss() {
    return  {
        style : uglifycss.processString(fs.readFileSync(serverPathHelper.default.get().serverPath + "/public/css/match-desktop.css", "utf8"))
    };
}

function getMatchPage(pageData: any) {
    const minifyConfig = {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    };
    const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/home-desktop.ejs");
    return minify(ejs.render(fs.readFileSync(_viewPath, "utf8"), pageData), minifyConfig);
}

function getMobileMatchPage(pageData: any) {
    const minifyConfig = {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    };
    const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/home-mobile.ejs");
    return minify(ejs.render(fs.readFileSync(_viewPath, "utf8"), pageData), minifyConfig);
}

export default <any> {
    htmlToString: htmlToString,
    getCss: getCss,
    getMobileCss: getMobileCss,
    getMatchPage: getMatchPage,
    getMobileMatchPage: getMobileMatchPage
};

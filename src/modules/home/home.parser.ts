import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import * as uglifycss from "uglifycss";
import * as _ from "lodash";
import * as homeMapper from "../api-mapper/mapper";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as serverPathHelper from "../../helpers/server-path-helper";
import * as supportedDevices from "../../config/supported-devices";
const minify = require("html-minifier").minify;

const imageUrls = [
    {env: "staging", url: "https://www.cricingif.com/Images/ArticleImages"},
    {env: "production", url: "http://d7d7wuk1a7yus.cloudfront.net/article-images"}
];

function htmlToString(partialName: string, response: any) {
    let _data: any; const _keyName = _.kebabCase(partialName), _userAgent = useragentMiddleware.default.getDevice();
    if (_keyName === "schedule-widget") {
      response = homeMapper.default.map(partialName, response);
      _data = [
        {title: "Recently Finished", matches: <any>[], val: 0},
        {title: "Live Cricket", matches: <any>[], val: 1},
        {title: "Upcoming Matches", matches: <any>[], val: 2}
      ];
      _.each(response, function(match) {
        if (match.matchState === 0) _data[0].matches.push(match);
        else if (match.matchState === 1) _data[1].matches.push(match);
        else if (match.matchState === 2) _data[2].matches.push(match);
      });
      const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/" + _keyName + ".ejs");
      console.log(_viewPath);
      return ejs.render(fs.readFileSync(_viewPath, "utf8"), {[partialName]: _data});
    } else if (_keyName === "home-page") {
      _data = {
        articles: _.chunk(homeMapper.default.map("articles", response[0]), 3),
        featuredArticles: homeMapper.default.map("featuredArticles", response[1]),
        imageUrl: process.env.CIG_ENV === "production" ?  imageUrls[1].url : imageUrls[0].url
      };
      if (_userAgent === supportedDevices.index.desktop) {
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/articles.ejs");
        return ejs.render(fs.readFileSync(_viewPath, "utf8"), _data);
      }
      if (_userAgent === supportedDevices.index.mobile) {
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/articles-mobile.ejs");
        return ejs.render(fs.readFileSync(_viewPath, "utf8"), _data);
      }
    } else {
        if (_keyName === "team-rankings") {
            const obj = _.extend({}, {
                playerRankings: response,
                selected: { filterName: "Test Batsman" },
                options: [{name: "Test"}, {name: "Odi"}, {name: "T20"}, {name: "Women"}]
            });
            const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/" + _keyName + ".ejs");
            return ejs.render(fs.readFileSync(_viewPath, "utf8"), obj);
        }

        if (_keyName === "player-rankings") {
            const obj = _.extend({}, {
                playerRankings: response,
                selected: { fileterName: "Test Batsman" },
                options: [{name: "Test Batsman", value: 1}, {name: "Test Bowlers", value: 2}, {name: "Odi Batsman", value: 3}, {name: "Odi Bowlers", value: 4}, {name: "T20 Batsman", value: 5}, {name: "T20 Bowlers", value: 6}, {name: "Women Odi Batsman", value: 7}, {name: "Women Odi Bowlers", value: 8}, {name: "Women T20 Batsman", value: 9}, {name: "Women T20 Bowlers", value: 10}]
            });
            const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/" + _keyName + ".ejs");
            return ejs.render(fs.readFileSync(_viewPath, "utf8"), obj);
        }
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/" + _keyName + ".ejs");
        return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + _keyName + ".ejs"), "utf8"), {[partialName]: response});
    }
}

function getMobileCss() {
    return  {
        style : uglifycss.processString(fs.readFileSync(serverPathHelper.default.get().serverPath + "/public/css/main-mobile.css", "utf8"))
    };
}

function getCss() {
    return  {
        style : uglifycss.processString(fs.readFileSync(serverPathHelper.default.get().serverPath + "/public/css/main.css", "utf8"))
    };
}

function getHomePage(pageData: any) {
    const minifyConfig = {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    };
    const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/home-desktop.ejs");
    console.log(_viewPath);
    return minify(ejs.render(fs.readFileSync(_viewPath, "utf8"), pageData), minifyConfig);
}

function getMobileHomePage(pageData: any) {
    const minifyConfig = {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    };
    const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/home-mobile.ejs");
    console.log(_viewPath);
    return minify(ejs.render(fs.readFileSync(_viewPath, "utf8"), pageData), minifyConfig);
}

export default <any> {
    htmlToString: htmlToString,
    getCss: getCss,
    getMobileCss: getMobileCss,
    getHomePage: getHomePage,
    getMobileHomePage: getMobileHomePage
};

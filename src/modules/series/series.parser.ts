import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import * as uglifycss from "uglifycss";
import * as seriesMapper from "../api-mapper/mapper";
import * as _ from "lodash";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as serverPathHelper from "../../helpers/server-path-helper";
import * as supportedDevices from "../../config/supported-devices";
const minify = require("html-minifier").minify;


const imageUrls = [
    { env: "staging", url: "https://www.cricingif.com/Images/ArticleImages" },
    { env: "production", url: "http://d7d7wuk1a7yus.cloudfront.net/article-images" }
];


function htmlToString(partialName: string, response: any) {
    let _data: any; const _keyName = _.kebabCase(partialName), _userAgent = useragentMiddleware.default.getDevice();
    if (_keyName === "series-widget") {
        response = seriesMapper.default.map(partialName, response);
        let t20: number = 0, test: number = 0, oDI: number = 0, t10: number = 0;
        _data = [
            { title: "Recently Finished", matches: <any>[], val: 0 },
            { title: "Live Cricket", matches: <any>[], val: 1 },
            { title: "Upcoming Matches", matches: <any>[], val: 2 }
        ];
        _.each(response, function (match) {
            if (match.matchType === "1") {
                test++;
            } else if (match.matchType === "2") {
                oDI++;
            }
            else if (match.matchType === "3") {
                t20++;
            }
            else if (match.matchType === "4") {
                t10++;
            }
            if (match.matchState === 0) _data[0].matches.push(match);
            else if (match.matchState === 1) _data[1].matches.push(match);
            else if (match.matchState === 2) _data[2].matches.push(match);
        });
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/series/" + _keyName + ".ejs");
        console.log(_viewPath);
        return { seriesWidgetTemplate: ejs.render(fs.readFileSync(_viewPath, "utf8"), { [partialName]: _data }), seriesHeadings: [{ test: test, oDI: oDI, t20: t20, t10: t10 }] };
    }
    else if (_keyName === "series-page-article") {
        if (_userAgent === supportedDevices.index.desktop) {
            const topArticle = seriesMapper.default.map("seriesArticles", response.splice(0, 1));
            _data = {
                topArticle: topArticle,
                articles: _.chunk(seriesMapper.default.map("seriesArticles", response), 2),
                imageUrl: process.env.CIG_ENV === "production" ? imageUrls[1].url : imageUrls[0].url
            };

            const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/series/series-article.ejs");
            return ejs.render(fs.readFileSync(_viewPath, "utf8"), _data);
        }
        if (_userAgent === supportedDevices.index.mobile) {
            _data = {
                articles: _.chunk(seriesMapper.default.map("seriesArticles", response.ArticleList), 2),
                featureArticle: _.chunk(seriesMapper.default.map("featuredArticles", response.BlogList), 1),
                imageUrl: process.env.CIG_ENV === "production" ? imageUrls[1].url : imageUrls[0].url
            };
            const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/series/series-mobile-article.ejs");
            return ejs.render(fs.readFileSync(_viewPath, "utf8"), _data);
        }
    }
    else if (_keyName === "trending-articles") {
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/home/" + _keyName + ".ejs");
        return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/home/" + _keyName + ".ejs"), "utf8"), { [partialName]: response });
    }
    else if (_keyName === "series-squad") {
        const _viewPath = path.join(serverPathHelper.default.get().serverPath, serverPathHelper.default.get().viewsPath + "/partials/series/" + _keyName + ".ejs");
        return ejs.render(fs.readFileSync(path.join(__dirname, "../../views/partials/series/" + _keyName + ".ejs"), "utf8"), { [partialName]: response });
    }
}

function getMobileCss() {
    return {
        style: uglifycss.processString(fs.readFileSync(path.join(__dirname, "../../public/css/series-mobile.css"), "utf8"))
    };
}

function getCss() {
    return {
        style: uglifycss.processString(fs.readFileSync(path.join(__dirname, "../../public/css/series-desktop.css"), "utf8"))
    };
}

export default <any>{
    htmlToString: htmlToString,
    getCss: getCss,
    getMobileCss: getMobileCss
};
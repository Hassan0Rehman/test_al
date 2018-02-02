import * as request from "request";
import * as async from "async";
import * as config from "../../config/config";
import * as _ from "lodash";

function requestApi(partialName: string, ) {
    return new Promise(function(resolve, reject) {
        const _keyName = _.camelCase(partialName);
        if (partialName === "homePage") {
            async.parallel([function(next) {
                request.get({
                    url: config.index.base.prod + config.index["articles"].url,
                    json: true,
                    headers: {
                    "Authorization": config.index.token.prod,
                    "content-type" : "application/json"
                    }
                }, function(error: any, response: any, body: any) {
                    next(null, _.get(response, "body"));
                });
            }, function(next) {
                request.get({
                    url: config.index.base.prod + config.index["featured-articles"].url,
                    json: true,
                    headers: {
                    "Authorization": config.index.token.prod,
                    "content-type" : "application/json"
                    }
                }, function(error: any, response: any, body: any) {
                    next(null, _.get(response, "body"));
                });
            }], function(err: any, results: any) {
                if (results[0] && results[1]) {
                    resolve([results[0], results[1]]);
                } else {
                    resolve("ERROR");
                }
            });
        } else {
            const api = _.get(config.index, _.kebabCase(partialName));
            // check to be removed
            const urL = partialName === "trendingArticles" ? config.index.base.prod : config.index.base.prod;
            return request.get({
                url: urL + api.url,
                json: true,
                headers: {
                    "Authorization": partialName === "trendingArticles" ? config.index.token.prod : config.index.token.prod,
                    "content-type" : "application/json"
                }
            }, function(error: any, response: any, body: any) {
                const _body = _.get(response, "body");
                _body ? resolve(_.get(response, "body")) : resolve("ERROR");
            });
        }
    });
}

export default <any> {
    requestApi: requestApi
};

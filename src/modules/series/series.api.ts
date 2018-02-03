import * as request from "request";
import * as async from "async";
import * as config from "../../config/config";
import * as _ from "lodash";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as supportedDevices from "../../config/supported-devices";

function requestApi(partialName: string, id: any) {
    return new Promise(function (resolve, reject) {
        if (partialName === "seriesWidget") {
            let api = null;
            if (id) api = "/tours/" + id + "/matches";
            else api = _.get(config.index, _.kebabCase(partialName)).url;
            return request.get({
                url: config.index.base.prod + api,
                json: true,
                headers: {
                    "Authorization": config.index.token.prod,
                    "content-type": "application/json"
                }
            }, function (error: any, response: any, body: any) {
                resolve(_.get(response, "body"));
            });
        } else if (partialName === "seriesSquad") {
            let api = null;
            if (id) api = "/tours/" + id + "/series";
            else api = _.get(config.index, _.kebabCase(partialName)).url;
            return request.get({
                url: config.index.base.prod + api,
                json: true,
                headers: {
                    "Authorization": config.index.token.prod,
                    "content-type": "application/json"
                }
            }, function (error: any, response: any, body: any) {
                resolve(_.get(response, "body"));
            });
        }
        else if (partialName === "trendingArticles") {
            let api = null;
            if (id) api = "/tours/" + id + "/series";
            else api = _.get(config.index, _.kebabCase(partialName)).url;
            return request.get({
                url: config.index.base.prod + api,
                json: true,
                headers: {
                    "Authorization": config.index.token.prod,
                    "content-type": "application/json"
                }
            }, function (error: any, response: any, body: any) {
                resolve(_.get(response, "body"));
            });
        }
        else {
            const _userAgent = useragentMiddleware.default.getDevice();
            if (_userAgent === supportedDevices.index.desktop) {
                let api = null;
                const s = _.kebabCase(partialName);
                if (id) api = _.get(config.index, s).url + id + "/page/0";
                else api = _.get(config.index, s).url;
                return request.get({
                    url: config.index.base.prod + api,
                    json: true,
                    headers: {
                        "Authorization": config.index.token.prod,
                        "content-type": "application/json"
                    }
                }, function (error: any, response: any, body: any) {
                    resolve(_.get(response, "body"));
                });
            } else {
                let api = null;
                const s = _.kebabCase(partialName);
                if (id) api = "https://cig-staging-api.azurewebsites.net/api/tours/" + id + "/page/0/articles";
                else api = _.get(config.index, s).url;
                return request.get({
                    url: api,
                    json: true,
                    headers: {
                        "Authorization": config.index.token.staging,
                        "content-type": "application/json"
                    }
                }, function (error: any, response: any, body: any) {
                    resolve(_.get(response, "body"));
                });
            }
        }
    });
}

export default <any>{
    requestApi: requestApi
};

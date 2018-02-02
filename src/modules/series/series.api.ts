import * as request from "request";
import * as async from "async";
import * as config from "../../config/config";
import * as _ from "lodash";

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
        else {
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
        }
    });
}

export default <any>{
    requestApi: requestApi
};

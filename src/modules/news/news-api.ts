import * as request from "request";
import * as async from "async";
import * as config from "../../config/config";
import * as _ from "lodash";

function requestApi(partialName: string, id: any) {
    return new Promise(function(resolve, reject) {
        let api = null;
        if (id) api = _.get(config.index, _.kebabCase(partialName)).url + id;
        else api = _.get(config.index, _.kebabCase(partialName)).url;

        return request.get({
            url: config.index.base.prod + api,
            json: true,
            headers: {
                "Authorization": config.index.token.prod,
                "content-type" : "application/json"
            }
        }, function(error: any, response: any, body: any) {
            resolve(_.get(response, "body"));
        });
    });
}

export default <any> {
    requestApi: requestApi
};

import * as _ from "lodash";
const requestIp = require("request-ip");
const geoip = require("geoip-country");

function setRegion() {
    return function(req: any, res: any, next: any) {
        if (!_.get(req, "cookies.region")) {
            const clientIp = requestIp.getClientIp(req);
            if (clientIp === "::1") {
                // res.clearCookie("cig-location");
                // _.set(req.cookies, "region", "PK");
                // res.cookie("cig-location", "PK");
                next();
            } else {
                // _.set(req.cookies, "region", _.get(geoip.lookup(clientIp), "country"));
                // res.cookie("cig-location", _.get(geoip.lookup(clientIp), "country"));
                next();
            }
        } else {
            next();
        }
    };
}

function allowVideo(cookie: any, allowedRegions: any) {
    const userLocation = JSON.parse(_.get(cookie, "cig-location"));
    return _.find(allowedRegions, _.get(userLocation, "country")) ? true : false;
}

export default {
    setRegion: setRegion,
    allowVideo: allowVideo
};

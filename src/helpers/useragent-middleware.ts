import { Request, Response } from "express";
import * as supportedDevices from "../config/supported-devices";
import * as _ from "lodash";

let device: string = "";
function getDevice() {
    return device;
}

function setDevice() {
    return function(req: any, res: any, next: any) {
        if (_.get(req, "useragent.isDesktop")) {
            device = supportedDevices.index.desktop;
            next();
        }
        if (_.get(req, "useragent.isAndroid") || _.get(req, "useragent.isiPhone")) {
            device = supportedDevices.index.mobile;
            next();
        }
        // res.send("We dont support this device yet !!");
    };
}

export default {
    setDevice: setDevice,
    getDevice: getDevice
};

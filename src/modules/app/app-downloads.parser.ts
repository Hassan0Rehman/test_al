import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import * as uglifycss from "uglifycss";
import * as _ from "lodash";
import * as useragentMiddleware from "../../helpers/useragent-middleware";
import * as supportedDevices from "../../config/supported-devices";
const minify = require("html-minifier").minify;


function getCss() {
    return  {
        style : uglifycss.processString(fs.readFileSync(path.join(__dirname, "../../public/css/app-downloads.css"), "utf8"))
    };
}


function getAppPage(pageData: any) {
    const minifyConfig = {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    };
    return minify(ejs.render(fs.readFileSync(path.join(__dirname, "../../views/app-downloads.ejs"), "utf8"), pageData), minifyConfig);
}



export default <any> {
    getAppPage: getAppPage,
    getCss: getCss
};
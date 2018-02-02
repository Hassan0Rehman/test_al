const fs = require("fs");

let viewsPath: string = "";
let serverPath: string = "";
const chunkName: string = "";

function getPath() {
    return { viewsPath: viewsPath, serverPath: serverPath };
}

function setPath(_viewsPath: string, _serverPath: string) {
    if (_viewsPath) {
        viewsPath = _viewsPath;
    }
    if (_serverPath) {
        serverPath = _serverPath;
    }
}

function getJsChunkName() {
    const jsFolder = serverPath + "/public/webpack";
    let version = "version";
    fs.readdirSync(jsFolder).forEach((file: any) => {
        if (file.split(".")[0] === "homePage" && file.split(".")[1] === "bundle") {
             version = file.split(".")[2];
        }
    });
    return version + ".js";
}

export default {
    set: setPath,
    get: getPath,
    getJsChunk: getJsChunkName
};

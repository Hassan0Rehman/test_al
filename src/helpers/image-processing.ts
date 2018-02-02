import * as jimp from "jimp";
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";
import * as Promise from "bluebird";
import * as fileType from "file-type";

function convertImages() {
    const startPath = path.join(__dirname, "../public/uploaded");
    const files = fs.readdirSync(startPath);

    _.each(files, function(file, i) {
        const ext = file.split(".")[1], fileName = file.split(".")[0];
        jimp.read(startPath + "/" + file, (err, lenna) => {
            if (err) throw err;
                lenna.quality(1)  // set JPEG quality
                    .write(path.join(__dirname, "../public/optimized/" + fileName + ".jpg")); // save
        });
    });
}

export default <any>{
    convertImages: convertImages
};

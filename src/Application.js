const FileReaderJson = require("./modules/file-reader/FileReaderJson");
const LabelGenPdf = require("./modules/label-generator/LabelGenPdf");

class Application {
    constructor() {
        this._fsJson = new FileReaderJson();
        this._labelGenPdf = new LabelGenPdf();
    }

    process(path) {
        this._fsJson.read(path).then((data) => {
            this._labelGenPdf.process(data);
        }).catch((err) => {
            console.log(err);
        });
    }
}

module.exports = Application;

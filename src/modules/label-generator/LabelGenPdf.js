const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const LabelGenPdfElement = require('./LabelGenPdfElement');

class LabelGenPdf {
    constructor() {
        this._doc = null;
        this._dataJson = null;
        this._genElement = new LabelGenPdfElement();
        this._docBytes = null;
    }

    /**
     * Main public function to generate pdf file from data
     * 
     * @param {string} data unparsed JSON
     */
    async process(data) {
        try {
            this._dataJson = this._parseDataToJson(data);
            this._validateParameters();
            await this._initPdf();
            await this._processElements();
            await this._save();
            this._write();
        } catch (err) {
            console.log(err);
        }
    }

    async _initPdf() {
        this._doc = await PDFDocument.create();
        this._doc.addPage();
        this._doc.getPage(0).setSize(this._dataJson.width, this._dataJson.height);
    }

    async _processElements() {
        const length = this._dataJson.elements.length;

        if (length > 0) {
            for (let i = 0; i < length; ++i) {
                const data = this._dataJson.elements[i];

                if (data) {
                    await this._genElement.process(data, this._doc);
                }
            }
        }
    }

    _validateParameters() {
        if (!this._dataJson.width ||
            !this._dataJson.height) {
            throw new Error("Json data missing 'width' or 'height' parameters or they are zero value.");
        }

        if (this._dataJson.width > 10000 ||
            this._dataJson.height > 10000) {
            throw new Error("Label width or height over exceeded max size 10000.");
        }

        if (this._dataJson.elements === undefined) {
            throw new Error("Json data missing elements parameters.");
        }
    }

    _write() {
        fs.writeFileSync('label.pdf', Buffer.from(this._docBytes));
    }

    async _save() {
        this._docBytes = await this._doc.save();
    }

    /**
     * Parses string to json
     * 
     * @param {string} data 
     * @returns {JSON} data 
     */
    _parseDataToJson(data) {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }

        return data;
    }
}

module.exports = LabelGenPdf;

const ELEMENT_TYPES = require('./ELEMENT_TYPES');
const Path = require("path");
const fs = require('fs');
const { rgb, StandardFonts } = require('pdf-lib');

class LabelGenPdfElement {
    constructor() {
        this._pHeight = 0;
    }

    /**
     * Main public function to generate pdf elements
     * 
     * @param {object} data JSON
     * @param {object} doc pdf document
     */
    async process(data, doc) {
        this._validateParams(data);
        await this._createElement(data, doc);
    }

    async _createElement(data, doc) {
        switch(data.type) {
            case ELEMENT_TYPES.IMAGE:
                await this._createImage(data, doc);
                break;
            case ELEMENT_TYPES.TEXT:
                await this._createText(data, doc);
                break;
            case ELEMENT_TYPES.RECTANGLE:
                this._createRectangle(data, doc);
                break;
        }
    }

    async _createImage(data, doc) {
        if (!data.src) {
            throw new Error("Element with type IMAGE missing 'src' parameter or it is empty");
        }

        const page = doc.getPage(0);
        const imageBytes = this._getImage(data.src);
        const image = await doc.embedPng(imageBytes);
        const imageDim = data.scale === undefined ? image : image.scale(data.scale);
        const x = data.x === undefined ? 0 : data.x;
        const y = data.y === undefined ? 0 : data.y;
        
        page.drawImage(image, {
            x: x,
            y: page.getHeight() - imageDim.width - y,
            width: imageDim.width,
            height: imageDim.height,
        });
    }

    async _createText(data, doc) {
        if (!data.text && !color) {
            throw new Error("Element with type TEXT missing 'text' parameter or it is empty");
        }

        const color = data.color === undefined ? this._hexToRgb("#000000") : this._hexToRgb(data.color);

        if (data.color != undefined && !color) {
            throw new Error("Only HEX color type allowed");
        }

        const page = doc.getPage(0);
        const x = data.x === undefined ? 0 : data.x;
        const y = data.y === undefined ? 0 : data.y;
        const size = data.fontSize === undefined ? 16 : data.fontSize;
        const height = data.height === undefined ? 0 : data.height;
        const width = data.width === undefined ? 0 : data.width;
        const helveticaFont = await doc.embedFont(StandardFonts.Helvetica);
        const text = data.width || data.height ? this._resizeText(data.text, helveticaFont, size, width, height) : data.text; 

        page.drawText(text, {
            x: x,
            y: page.getHeight() - size - y,
            size: size,
            font: helveticaFont,
            color: rgb(color.r, color.g, color.b),
            lineHeight: size,
        });
    }

    _createRectangle(data, doc) {
        if (!data.width || !data.height) {
            throw new Error("Element with type RECTANGLE missing dimension parameter or they are zero value");
        }

        const color = data.color === undefined ? this._hexToRgb("#000000") : this._hexToRgb(data.color);

        if (data.color != undefined && !color) {
            throw new Error("Only HEX color type allowed");
        }

        const page = doc.getPage(0);
        const x = data.x === undefined ? 0 : data.x;
        const y = data.y === undefined ? 0 : data.y;
        const strokeSize = data.strokeSize === undefined ? 1 : data.strokeSize;

        page.drawRectangle({
            x: x,
            y: page.getHeight() - data.height - y,
            width: data.width,
            height: data.height,
            borderWidth: strokeSize,
            borderColor: rgb(color.r, color.g, color.b),
        });
    }

    /**
     * Resize text by first spliting it by \n paragraphs
     * 
     * @param {string} text 
     * @param {object} font 
     * @param {number} fontSize 
     * @param {number} width 
     * @param {number} height 
     * @returns {string}
     */
    _resizeText(text, font, fontSize, width, height) {
        const ps = text.split('\n'); // Paragraphs
        const psLength = ps.length;
        const pHeight = font.heightAtSize(fontSize);
        let content = '';

        this._pHeight = 0;

        for (let i = 0; i < psLength; ++i) {
            if (this._pHeight + pHeight >= height) {
                break;
            }

            const p = ps[i];
            const pWidth = font.widthOfTextAtSize(p, fontSize);

            if (content) {
                content += '\n';
            }

            if (pWidth > width) {
                content += this._resizeParagraph(p, font, fontSize, width, height);
            } else {
                console.log(pWidth);
                content += p;
                this._pHeight = pHeight;
            }
        }

        return content;
    }
    
    /**
     * Main string resizing function
     * resizes string by width and height into paragraphs
     * 
     * @param {string} paragraph 
     * @param {object} font 
     * @param {number} fontSize 
     * @param {number} width 
     * @param {number} height 
     * @returns {string}
     */
    _resizeParagraph(paragraph, font, fontSize, width, height) {
        let p = paragraph;
        let pLength = p.length;
        let i = pLength;
        let index = i;
        let content = '';
        const lineHeight = font.heightAtSize(fontSize);

        if (this._pHeight + lineHeight > height) {
            return content;
        }

        while (pLength) {
            const pCheck = p.substr(0, index);
            const pWidth = font.widthOfTextAtSize(pCheck, fontSize);
            const diff = width - pWidth;
            i = Math.floor(i / 2);

            // Check if success
            if (!i || index > pLength || pWidth == width || diff < fontSize && diff > 0) {
                if (content) {
                    content += '\n';
                }

                this._pHeight += lineHeight;
                content += pCheck;

                // Check if height limit reached
                if (this._pHeight + lineHeight > height) {
                    break;
                }

                p = p.substr(index, pLength);
                pLength = p.length;

                if (pLength) {
                    i = Math.floor(pLength / 2);
                } else {
                    return content;
                }
            } else {
                if (pWidth > width) { 
                    index = index - i;
                } else {
                    index = index + i;
                }
            }
        }

        return content;
    }

    _hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        } : null;
    }

    _getImage(src) {
        return fs.readFileSync(Path.resolve(__dirname, `../../../images/${src}`));
    }

    _validateParams(data) {
        if (data.type === undefined) {
            throw new Error("Element missing 'type' parameter");
        }
    } 
}

module.exports = LabelGenPdfElement;

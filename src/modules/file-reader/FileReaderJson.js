const fs = require('fs').promises;
const Path = require("path");

class FileReaderJson {
    /**
     * Main public function to read file
     * 
     * @param {string} path 
     * @returns {string} file content
     */
    async read(path) {
        if (!this._validatePath(path)) {
            return Promise.reject("Invalid JSON file path");
        }

        const resolvedPath = this._resolvePath(path);

        return await fs.readFile(resolvedPath, 'utf8');
    }

    _resolvePath(path) {
        return Path.resolve(__dirname, `../../../${path}`);
    }

    /**
     * Check if path leads to json file
     * 
     * @param {string} path 
     * @returns {boolean}
     */
    _validatePath(path) {
        if (!path.includes('.json')) {
            return false;
        }

        return true;
    }
}

module.exports = FileReaderJson;

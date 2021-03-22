const Application = require('./src/Application');
const app = new Application();

if (process.argv.length > 2) {
    const path = process.argv[2];
    console.log("JSON_FILE_PATH", path, typeof path);

    app.process(path);
} else {
    console.log("Invalid argument");
}

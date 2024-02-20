const path = require("path");

module.exports = {
    entry: "./src/main.js",
    output: {
        filename: "index.bundle.js",
        path: path.join(__dirname, "media")
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
}
const webpack = require('webpack')
const path = require("path");

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.REACT_APP_CLIENT_ID': JSON.stringify(process.env.REACT_APP_CLIENT_ID),
            'process.env.REACT_APP_LOGIN_AUTHORITY': JSON.stringify(process.env.REACT_APP_LOGIN_AUTHORITY),
            'process.env.REACT_APP_REDIRECT_URI': JSON.stringify(process.env.REACT_APP_REDIRECT_URI)
        })
    ]
};
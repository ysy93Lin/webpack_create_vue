const common = require("./webpack.common")
const { merge } = require("webpack-merge")
const CompressionWebpackPlugin = require("compression-webpack-plugin")

module.exports = merge(common, {
    mode: "production",
    plugins: [
        new CompressionWebpackPlugin({
            algorithm: "gzip",
            test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
            threshold: 5120,
            minRatio: 0.8,
            cache: true,
            deleteOriginalAssets: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.(png|jp(e?)g|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192
                        }
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            bypassOnDebug: true
                        }
                    } 
                ]
            }
        ]
    },
    devtool: "cheap-module-source-map"
})
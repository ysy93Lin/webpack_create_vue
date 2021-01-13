const path = require("path")
// const os = require("os")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const webpack = require("webpack")
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
const isProd = process.env.NODE_ENV === "production"

module.exports = {
    entry: path.join(__dirname, "../src/main.js"),
    output: {
        filename: 'js/[name].[hash:4].js',
        path: path.join(__dirname, "../dist"),
        publicPath: '/',
        // 指定 chunkFilename
        chunkFilename: 'js/[name].[hash:4].js',
    },
    plugins: [
        // 指定的html模板，会自动引用到output出口设置的文件
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../public/index.html")
        }),
        new VueLoaderPlugin(),
    ],
    // 管理资源
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    extractCSS: true
                }
            },
            {
                test: /\.(png|jp(e?)g|gif|svg|eot|ttf|otf|woff)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: 'images/[name].[hash:8].[ext]',
                            // publicPath: "/",
                            esModule: false  // 显示图片的关键
                        }
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            bypassOnDebug: true,
                            pngquant: {
                                enabled: false,
                                quality: '65-90',
                                speed: 4
                            }
                        }
                    }
                ]
            }
        ]
    },
    // 解析模块请求的选项
    resolve: {
        // // 使用的扩展名
        extensions: [".js", ".vue", ".json",],
        // 模块别名列表
        alias: {
            "@": path.resolve(__dirname, "../src")
        }

    }
}
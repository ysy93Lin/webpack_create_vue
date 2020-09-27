const path = require("path")
// const os = require("os")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
/* const HappyPack = require("happypack")
// 手动创建进程池
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length}) */
const isProd = process.env.NODE_ENV === "production"

module.exports = {
    entry: path.join(__dirname, "../src/main.js"),
    output: {
        filename: '[name].[hash:4].js',
        path: path.join(__dirname, "../dist")
    },
    // http服务的设置
    devServer: {  // 使用到 webpack-dev-server插件
        port: 3000, // default: 8000
        open: true,
        hot: true,
        contentBase: path.join(__dirname, "../dist")
    },
    plugins: [
        new CleanWebpackPlugin({}),
        // 指定的html模板，会自动引用到output出口设置的文件
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../public/index.html")
        }),
        new VueLoaderPlugin(),
        // 提取组件的css
        // new ExtractTextPlugin("style.scss")
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
                test: /\.js$/,
                use: "babel-loader?cacheDirectory=true",
                exclude: /node_modules/,
                include: [path.resolve(__dirname, "src")]
            },
            {
                test: /\.(s?)css$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|jp(e?)g|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    // 解析模块请求的选项
    resolve: {
        // // 使用的扩展名
        extensions: [".js", ".json", ".vue"],
        // 模块别名列表
        alias: {
            "@": path.resolve(__dirname, "../src")
        }

    }
}
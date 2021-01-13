const common = require("./webpack.common")
const { merge } = require("webpack-merge")
const path = require("path")

module.exports = merge(common, {
    mode: "development",
    // http服务的设置
    devServer: {  // 使用到 webpack-dev-server插件
        port: 3000, // default: 8000
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
        inline: true  // 实时刷新
        // contentBase: path.join(__dirname, "../dist")
    },
    module: {
        rules: [
            {
                test: /\.(s?)css$/,
                use: ["style-loader", "css-loader", "sass-loader"]

            },
            {
                test: /\.js$/,
                // 开启缓存将转译结果缓存至文件系统，至少可以将Babel-loader的工作效率提升两倍
                use: "babel-loader?cacheDirectory=true",
                // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
                // loader: "happypack/loader?id=babel",
                exclude: /node_modules/,
                include: [path.resolve(__dirname, "../src")]
            },
        ]
    },
    devtool: "cheap-module-eval-source-map"
})
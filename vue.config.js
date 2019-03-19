var proxies = {}
var proxy = (text) => {
    var r = {
        //target: 'http://dust.gz-studio.com.cn',  // 接口域名
        target: 'http://test.dedusting.cn:8080/',  // 接口域名
        changeOrigin: true,  // 是否跨域
        pathRewrite: {}// 需要rewrite重写的,
    }
    r.pathRewrite['^' + text] = text
    return r
};

[
    '/bmUser',
    '/permission',
    '/bmCompany',
    '/bmProduct',
    '/bmData'
].forEach((_) => {
    proxies[_] = proxy(_)
})

module.exports = {
    devServer: {
        proxy: proxies
    },
    assetsDir: './static/'
}
module.exports = {
    lintOnSave: false,
    devServer: {
        // proxy: {
        //    '/MyWeb': {
        //       target: 'http://localhost:8000',
        //       ws: true,
        //       changeOrigin: true
        //    }
        // }
        proxy: 'http://124.71.71.18:8000'

    }

}
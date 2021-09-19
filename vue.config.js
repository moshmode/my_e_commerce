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
        proxy: 'http://localhost:8000'

    }

}
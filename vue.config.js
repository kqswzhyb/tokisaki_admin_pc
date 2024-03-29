'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
    // proxy: {
    // change xxx-api/login => mock/login
    // detail: https://cli.vuejs.org/config/#devserver-proxy
    // [process.env.VUE_APP_BASE_API]: {
    //   target: `http://127.0.0.1:${port}/mock`,
    //   changeOrigin: true,
    //   pathRewrite: {
    //     ['^' + process.env.VUE_APP_BASE_API]: ''
    //   }
    // }
    // }
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: {
      vue: 'Vue',
      'vuex': 'Vuex',
      'element-ui': 'ELEMENT',
      vant: 'vant',
      'axios': 'axios'
    },
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
        threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      })
    ]
  },
  chainWebpack(config) {
    const cdn = {
      css: [
        'https://unpkg.com/element-ui@2.12.0/lib/theme-chalk/index.css',
        'https://cdn.jsdelivr.net/npm/vant@2.2/lib/index.css'
      ],
      js: [
        'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.0/vuex.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.12.0/index.js',
        'https://cdn.jsdelivr.net/npm/vant@2.2/lib/vant.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.1/axios.min.js'
      ]
    }
    config.plugin('html')
      .tap(args => {
        args[0].cdn = cdn
        return args
      })
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ bypassOnDebug: true })
      .end()
    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    // if (process.env.NODE_ENV === 'production') {
    //   return {
    //     plugins: [
    //       new CompressionPlugin({
    //         test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
    //         threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
    //         deleteOriginalAssets: false // 是否删除原文件
    //       })
    //     ]
    //   }
    // }
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                // elementUI: {
                //   name: 'chunk-elementUI', // split elementUI into a single package
                //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                // },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 2, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}

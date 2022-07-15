module.exports = {
  outputDir: 'docs',
  productionSourceMap: false,
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js')
  },
  devServer: {
    proxy: {},
    host: '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback: true
  },
}
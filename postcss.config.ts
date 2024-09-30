const path = require('path')
const webpack = require('webpack')
const postcssComment = require('postcss-comment')

const config = {
  parser: postcssComment,
  plugins: [
    require('postcss-import')({
      resolve (id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR || '', id.substr(3))
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR || '', id.substr(2))
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR || '', id.substr(1))
        }
        return id
      }
    }),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5'
    }),
    require('postcss-nested'), // 如果你需要嵌套选择器
    require('postcss-apply'),   // 启用 @apply 功能
    require('postcss-simple-vars'), // 启用变量功能
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss')
  ]
}
if (parseInt(webpack.version[0]) > 4) {
  if (config.parser) {
    delete config.parser;
  }
}
module.exports = config

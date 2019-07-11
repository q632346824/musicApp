const path = require('path')
var express = require('express')
var axios = require('axios')
var app = express()
var apiRoutes = express.Router()
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      'patterns': [
        path.resolve(__dirname, 'src/assets/styles/index.styl'),
      ]
    }
  },
  devServer: {
    proxy: {
        '/recommendSlider': {
            target: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                '^/recommendSlider': ''
            }
        },
        '/getSingerList': {
          target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
              '^/getSingerList': ''
          }
      },
    },
    before:(apiRoutes)=>{
      apiRoutes.get('/recommendSongList',function(req,res){
        url='https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url,{
          headers:{
            referer:'https://y.qq.com/portal/',
            host:'c.y.qq.com'
          },
          params:req.query
        }).then(response=>{
          res.json(response.data)
        }).catch(e=>{
          console.log(e)
        })
      })
      app.use(apiRoutes)
    } // end before
  }
}
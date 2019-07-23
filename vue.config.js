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
      '/getSongList': {
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
            '^/getSongList': ''
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
      }),
      apiRoutes.get('/api/music',function(req,res){
        var url="https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg"

        axios.get(url, {
          headers: {  
            referer: 'https://y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query 
          }).then((response) => { 
               res.json(response.data)
          }).catch((e) => {
            //   console.log(e)
        })
      }),
      apiRoutes.get('/lyric',function(req,res){
        var url="https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"

        axios.get(url, {
          headers: {  
            referer: 'https://y.qq.com/',
            host: 'c.y.qq.com',
          },
          params: req.query 
          }).then((response) => { 
              //  var ret=response.data
              //  if(typeof ret==="string"){
              //    var reg=/^\w+\(({[^()]+})\)$/
              //    var mathes=ret.match(reg)
              //    if(matches){
              //      ret=JSON.parse(matches[1])
              //    }
              //  }
               res.json(response.data)
          }).catch((e) => {
              // console.log(e)
        })
      }),
      apiRoutes.get('/getDiscSongList',function(req,res){
        var url="https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg"

        axios.get(url, {
          headers: {  
            referer: `https://y.qq.com/n/yqq/playsquare/${req.query.disstid}.html`,
            host: 'c.y.qq.com',
          },
          params: req.query 
          }).then((response) => { 
               res.json(response.data)
          }).catch((e) => {
              // console.log(e)
        })
      }),

      app.use(apiRoutes)
    }, // end before
  }
}
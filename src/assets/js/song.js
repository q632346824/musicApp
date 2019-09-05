// import {getLyric} from 'api/song'
// import {ERR_OK} from 'api/config'
// import {Base64} from 'js-base64'

import {songListParam, commonParams} from '@/api/config'
import {getLyric} from '@/api/song'
import axios from 'axios'
import {Base64} from 'js-base64'
export class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric(){
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve,reject)=>{
      getLyric(this.mid).then((res)=>{
        if(res.retcode===0){
          this.lyric=Base64.decode(res.lyric) 
          resolve(this.lyric)
        }else{
         reject('no lyric') 
        }
      })
    })

  }

}
//   getLyric() {
//     if (this.lyric) {
//       return Promise.resolve(this.lyric)
//     }

//     return new Promise((resolve, reject) => {
//       getLyric(this.mid).then((res) => {
//         if (res.retcode === ERR_OK) {
//           this.lyric = Base64.decode(res.lyric)
//           resolve(this.lyric)
//         } else {
//           reject('no lyric')
//         }
//       })
//     })
//   }
// }

export function createSong(musicData,songVkey) {
  var album=musicData.album?musicData.album.name:musicData.albumname
  var mid=musicData.mid||musicData.songmid
  var id=musicData.id||musicData.songid
  var name=musicData.name||musicData.songname
  var albummid=musicData.album?musicData.album.mid:musicData.albummid
  return new Song({
    id: id,
    mid: mid,
    singer: rewrite(musicData.singer),
    name: name,
    album: album,
    duration: musicData.interval,
   // https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/C400${mid}.m4a?vkey=${songVkey}&guid=7244685629&uin=0&fromtag=66`
  })
}

// function filterSinger(singer) {
//   let ret = []
//   if (!singer) {
//     return ''
//   }
//   singer.forEach((s) => {
//     ret.push(s.name)
//   })
//   return ret.join('/')
// }

export function getSongParam(mid){
   songListParam.data['singer']['param']['singermid']=mid
  return songListParam
}


export function rewrite(arr1){
  let str=''
  arr1.forEach((item,index)=>{
    if(index===0){
      str+=item.name
    }else{
      str+='/'+item.name
    }
  })
  return str
}


export function getMusicVkey(songmid) {
  const url = '/api/music'
  const data = Object.assign({}, commonParams, {
    songmid: songmid,
    filename: 'C400' + songmid + '.m4a',
    guid: 7244685629, //会变，以实时抓取的数据为准
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    cid:205361747,
    uin: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}




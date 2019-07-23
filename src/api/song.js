import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid){
  const url='/lyric'

  const data={
    '-': 'MusicJsonCallback_lrc',
    pcachetime: 1563678327277,
    songmid: mid,
    g_tk: 1534503727,
    loginUin: 632346824,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }

  return axios.get(url,{params:data}).then(res=>{
    return Promise.resolve(res.data)
  })
}

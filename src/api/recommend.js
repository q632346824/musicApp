import {commonParams,options} from './config'
import {getDicsParam} from '@/api/config'
import axios from 'axios'

export function getSongList(id){

var getDicsParam={
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: id,
    g_tk: 591425070,
    loginUin: 632346824,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }


  axios.get('/getDiscSongList', {params:getDicsParam}).then(response=>{
    console.log('getDicsParam')
    console.log(response)
  })
}
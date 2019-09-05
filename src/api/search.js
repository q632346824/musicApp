import jsonp from '@/assets/js/jsonp'
import {commonParams, options} from "@/api/config"
import axios from 'axios'

export function getHotKey(){
  const url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data=Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode:1
  })

  return jsonp(url,data,options)
}

var getSuggestParams={
  '_': 1564304188345,
  g_tk: 5381,
  uin: 0,
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'h5',
  needNewCode: 1,
  w: 'Alan walker',
  zhidaqu: 1,
  catZhida: 1,
  t: 0,
  flag: 1,
  ie: 'utf-8',
  sem: 1,
  aggr: 0,
  perpage: 20,
  n: 20,
  p: 1,
  remoteplace: 'txt.mqq.all'
}

export function search(query,page,zhida, perpage=20){
  getSuggestParams.w=query
  getSuggestParams.p=page
  getSuggestParams.catZhida=zhida?1:0
  getSuggestParams.perpgae=perpage
  return axios.get('/getSuggestList', {params: getSuggestParams}).then(response=>{
    if(response.data.code==0){
      return Promise.resolve(response.data.data)
    }
  })
}
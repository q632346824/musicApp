import jsonp from '@/assets/js/jsonp'
import {commonParams} from "@/api/config"

export function getRankList() {
  const url = "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg"

  const data = {
      platform: 'h5',
      needNewcode: 1
  }
  var options={ param: 'jsonpCallback' }
  return jsonp(url, data, options)
}

export function getMusicList(topid) {
  const url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg"

  const data = Object.assign({}, commonParams, {
      topid,
      page: 'detail',
      type: 'top',
      tpl: 3,
      platform: 'h5',
      needNewcode: 1
  })
  var options={ param: 'jsonpCallback' }
  return jsonp(url, data, options)
}
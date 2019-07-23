import Vue from 'vue'
import Router from 'vue-router'

import Rank from "@/views/rank"
import Recommend from "@/views/recommend"
import Search from "@/views/search"
import Singer from "@/views/singer"
import SingerDetail from "@/views/singer-detail"
import Disc from '@/components/disc'

Vue.use(Router)

export default new Router({
  routes:[
    { path:'/',redirect:'/recommend'},
    { path:'/recommend',
    name:'Recommend',
    component:Recommend, 
    children:[
      {
        path:':id',
        component:Disc
      }
  ]
    },
    { path:'/singer',
      name:'Singer',
      component:Singer, 
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },

    { path:'/rank',name:'Rank',component:Rank },
    { path:'/search',name:'Search',component:Search }
  ]
})
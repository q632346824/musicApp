<template>
  <div>
    <div class="singer">
      <list-view :data="sortedSingerList"></list-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { singerListParams1,singerListParams2 } from '@/api/config'
import ListView from '@/components/listview'

export default {
  data(){
    return {
      singerList:[],
      sortedSingerList:{}
    }
  },
  computed:{
    hotSingerList(){
      return this.singerList.slice(0,15)
    },
  },
  components:{
    ListView
  },
  created(){
    this.getSingerList()
  },
  methods:{
    getSingerList(){
      var self=this
      axios.all([ this.getFirstPage(), this.getSecondPage()]).then(axios.spread(function (...resList) {
        resList.forEach(item=>{
          var res=item.data
          if(res.code==0){
            self.singerList=[...self.singerList,...res.singerList.data.singerlist]
          }
        })

        // sort by dictionary order
        self.singerList.slice().sort(self.sortSinger).forEach(item=>{
          if(!self.sortedSingerList[item.singer_name[0]]){
            self.sortedSingerList[item.singer_name[0]]=[]
           }
          self.sortedSingerList[item.singer_name[0]].push(item)
        })
      }));
      

    },
    sortSinger(a,b){
      return a.singer_name.charCodeAt(0)-b.singer_name.charCodeAt(0)
    },
    getFirstPage(){
      return axios.get('/getSingerList',{ params: singerListParams1})
    },
    getSecondPage(){
     return axios.get('/getSingerList',{ params: singerListParams2})
    },
    
  },
  watch:{
    sortedSingerList(){
      
          console.log(this.sortedSingerList.length)
      }
    }
  


}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

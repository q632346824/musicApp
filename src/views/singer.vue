<template>
  <div>
    <div class="singer" ref="singer">
      <list-view @select="selectSinger" :dataObject="sortedSingerList" ref="list"></list-view>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { singerListParams1,singerListParams2 } from '@/api/config'
import ListView from '@/components/listview'
import { mapActions } from 'vuex'
import Vue from 'vue'
import {playlistMixin} from '@/assets/js/mixin'

export default {
  mixins:[playlistMixin],
  data(){
    return {
      singerList:[],
      sortedSingerList:{},
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
    handlePlaylist(playlist){
      const bottom=playlist.length>0 ? "60px":""
      this.$refs.singer.style.bottom=bottom
      this.$refs.list.refresh()
    },
    selectSinger(item){
      this.$router.push({
        path:`/singer/${item.singer_mid}`
      })
      this.setSinger(item)
    },
    getSingerList(){
      var self=this

      axios.all([ this.getFirstPage(), this.getSecondPage()]).then(axios.spread(function (...resList) {
        resList.forEach(item=>{
          var res=item.data
          if(res.code==0){
            self.singerList=[...self.singerList,...res.singerList.data.singerlist]
          }
        })

        Vue.set(self.sortedSingerList,'hot',self.singerList.slice(0,10))

        self.singerList.slice().sort(self.sortSinger).forEach(item=>{
          
          if(!self.sortedSingerList[item.singer_name[0]]){
            Vue.set(self.sortedSingerList,item.singer_name[0],[])
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
    ...mapActions([
      'setSinger'
    ])
  },
  watch:{
    sortedSingerList(){
    
      },

    }
  


}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

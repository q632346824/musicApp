<template>
  <transition name="slide">
    <music-list
    :songList="songList"
    :title="title"
    :bigImage="bigImage"
    >
    </music-list>
  </transition>
</template>

<script>
import {mapGetters} from "vuex"
import { createSong, getSongParam,getMusicVkey } from '@/assets/js/song'
import MusicList from './music-list'
import axios from 'axios'
export default {
  data(){
    return {
      songList:[]
    }
  },
  computed:{
    title(){
      return this.singer.singer_name
    },
    bigImage(){
      return this.singer.singer_pic
    },
    ...mapGetters([
      'singer'
    ])
  },
  components:{
    MusicList 
  },
  created(){
    this.getDetail()
  },
  methods:{
    getDetail(){
      let mid=this.$route.params.id
      let param=getSongParam(mid)
      axios.get('/getSongList',{params:param}).then(response=>{
        let res=response.data
        if(res.code===0){
          res.singer.data.songlist.forEach(item => {
            getMusicVkey(item.mid).then(response=>{
              var vkey=response.data.items[0].vkey||''
              this.songList.push(createSong(item,vkey))
            })
            
          });
        }
      })
    },
  },

  // watch:{

  // }

}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/variable"

  .singer-detail
    position:fixed
    z-index:100
    top:0
    left:0
    right:0
    bottom:0
    background:$color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>


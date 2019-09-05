<template>
  <transition name="slide">
    <music-list :title="title" :bigImage="bgImage" :songList="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '@/views//music-list'
  import {getSongList} from '@/api/recommend'
  import {mapGetters} from 'vuex'
  import { createSong, getSongParam,getMusicVkey } from '@/assets/js/song'
  // import {createSong} from '@/assets/js/song'

  export default {
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if(!this.disc.dissid){
          this.$router.push('/recommend')
        }
        getSongList(this.disc.dissid).then(response=>{
          this.songs=this. _normalizeSongs(response[0].songlist)
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          getMusicVkey(item.mid).then(response=>{
              var vkey=response.data.items[0].vkey||''
              ret.push(createSong(item,vkey))
            })
        })
        return ret
      }
    },
    components: {
      MusicList
    },
    created(){
      this._getSongList()
      // console.log(this.disc)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
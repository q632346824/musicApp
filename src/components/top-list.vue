<template>
  <transition name="slide">
    <music-list :title="title" :bigImage="bgImage" :songList="songs" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/views//music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from '@/api/rank'
import {createSong,getMusicVkey} from '@/assets/js/song'
  export default {
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        return this.topList.picUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {

          if (res.code === 0) {
            this.songs = this._normalizeSongs(res.songlist)
            
            //  console.log("songs", this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          var musicData = item.data
            getMusicVkey(musicData.songmid).then(response=>{
              var vkey=response.data.items[0].vkey||''

              ret.push(createSong(musicData,vkey))
            })
          
        })
      //  console.log(ret)
        return ret
      },
    },
      components: {
        MusicList
      },
    }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
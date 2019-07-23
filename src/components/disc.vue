<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '@/views//music-list'
  import {getSongList} from '@/api/recommend'

  import {mapGetters} from 'vuex'
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
        // if (!this.disc.dissid) {
        //   this.$router.push('/recommend')
        //   return
        // }
        // getSongList(this.disc.dissid).then((res) => {
        //   if (res.code === ERR_OK) {
        //     this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        //   }
        // })
        getSongList(this.disc.dissid)
      },
      // _normalizeSongs(list) {
      //   let ret = []
      //   list.forEach((musicData) => {
      //     if (musicData.songid && musicData.albummid) {
      //       ret.push(createSong(musicData))
      //     }
      //   })
      //   return ret
      // }
    },
    components: {
      MusicList
    },
    mounted(){
      console.log("list",this.disc)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
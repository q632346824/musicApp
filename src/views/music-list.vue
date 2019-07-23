<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bigImage">

      <div class="play-wrapper">
        <div class="play" v-show="songList.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">randomly play</span>
        </div>
      </div>

      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :probe-type="3" :listen-scroll="listenScroll" :data="songList" class="list" ref="list" @scroll="scroll">
      <div class="song-list-wrapper">
      <song-list @select="selectItem" :songs="songList"></song-list>
      </div>
      <div class="loading-container" v-show="songList.length==0">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/scroll"
import SongList from "@/components/song-list/song-list"
import Loading from "@/components/loading/loading"
import {mapActions, mapState} from 'vuex'
import {playlistMixin} from '@/assets/js/mixin'
export default {
  mixins:[playlistMixin],
  props:{
    bigImage:{
      type:String,
      default:''
    },
    songList:{
      type: Array,
      default:()=>[]
    },
    title:{
      type:String,
      default:''
    }
  },
  computed:{
    bgStyle(){
      return `background-image:url(${this.bigImage})`
    }
  },
  data(){
    return {
      scrollY:0
    }
  },
  components:{
    Scroll,
    SongList,
    Loading
  },
  created(){
    // 实时监听scroll位置
    this.probeType=3
    this.listenScroll=true
  },
  mounted(){
    this.imageHeight=this.$refs.bigImage.clientHeight
    this.minTranslateY=-this.imageHeight-40
    this.$refs.list.$el.style.top=`${this.$refs.bigImage.clientHeight}px`
  },
  watch:{
    scrollY(newVal){
      let translateY=Math.max(this.minTranslateY,newVal)
      let zIndex=0
      this.$refs.layer.style['transform']=`translate3d(0,${translateY}px,0)`  //往上偏移盖住Bigimage
      this.$refs.layer.style['webkitTransform']=`translate3d(0,${translateY}px,0)`

      //往上拉图片放大
      let scale=1
      const percent=Math.abs(newVal/this.imageHeight)
      if(newVal>0){
        scale=1+percent
        zIndex=10
      }

      if(newVal<this.minTranslateY+80){
        zIndex=10
        this.$refs.bigImage.style.paddingTop=0
        this.$refs.bigImage.style.height='40px'
        this.$refs.playBtn.style.display="none"
      }else{
        this.$refs.bigImage.style.paddingTop='70%'
        this.$refs.bigImage.style.height=0
        this.$refs.playBtn.style.display=""
      }
      this.$refs.bigImage.style.zIndex=zIndex
      this.$refs.bigImage.style['transform']=`scale(${scale})`  //往上偏移盖住Bigimage
      this.$refs.bigImage.style['webkitTransform']=`scale(${scale})`


    }
  },
  methods:{
    handlePlaylist(playlist){
      const bottom=playlist.length>0 ? "60px":""
      this.$refs.list.$el.style.bottom=bottom
      this.$refs.list.refresh()
    },
    scroll(pos){
      
      this.scrollY=pos.y
    },
    back(){
      this.$router.back()
    },
    selectItem(item,index){
      // set playlist in vuex
      this.selectPlay({list:this.songList,index})
    },
    random(){
      this.randomPlay({list:this.songList})
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

@import "../assets/stylus/variable";
@import "../assets/stylus/mixin";


  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

</style>
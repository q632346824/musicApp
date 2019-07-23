<template>
  <div class="recommend" ref="recommends">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
      <!-- 等待recomend有数据时才渲染 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img @onload="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">Recommend</h1>
          <ul>
            <li v-for="item in discList" :key="item.dissid" class="item" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
import { recommendSliderParams, recommendSongParams } from '@/api/config'
import Slider from '@/components/slider'
import Scroll from '@/components/scroll'
import Loading from '@/components/loading/loading'
import {playlistMixin} from '@/assets/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins:[playlistMixin],
  data(){
    return {
      recommends:[],
      discList:[]
    }
  },
  components:{
    Slider,
    Scroll,
    Loading
  },
  created(){
    // 先渲染slide的高度，scroll刷新后包含了slide的高度才能正常用，否侧slide后刷新会缺slide的高度

    this.getSlider()
    this.getSongList()
  },
  methods:{
    handlePlaylist(playlist){
      const bottom=playlist.length>0 ? "60px":""
      this.$refs.recommends.style.bottom=bottom
      this.$refs.scroll.refresh()
    },
    getSlider(){
      axios.get('/recommendSlider',{ params: recommendSliderParams }).then(response=>{
        var res=response.data
        if(res.code==0){
          this.recommends=res.data.slider
        }
      })
    },
    getSongList(){
      axios.get('/recommendSongList',{ params: recommendSongParams }).then(response=>{
        var res=response.data
        if(res.code==0){
          this.discList=res.data.list
        }
      })
    },
    loadImage(){
      //当slideshow的图形得到，此时slideshow高已经撑开来,调用refresh确保滑动组件把slideshow高度包括进去
      if(!this.checkLoaded){
        this.$refs.scroll.refresh()
        this.checkLoaded=true
      }
    },
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc:'SET_DISC'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
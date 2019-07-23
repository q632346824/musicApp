<template>

  <scroll 
    :dataObject="dataObject"
    class="listview"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    >
    <ul>
      <li v-for="(value,key) in dataObject" class="list-group" :key="key" ref="listGroup">
        <h2 class="list-group-title">{{key}}</h2>
        <ul>
          <li v-for="item in value" :key="item.singer_id" class="list-group-item" @click="selectItem(item)">
            <img :src="item.singer_pic" class="avatar">
            <span class="name">{{item.singer_name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(value,key) in dataObject" :key="key" class="item" :class="{'current':indexToKey(currentIndex)===key}" :data-index="key">
          {{key}}
        </li>
      </ul>
      </div>
      <div class="list-fixed">
        <h1 class="fixed-title">{{indexToKey(currentIndex)}}</h1>
      </div>
      <div v-show="Object.keys(dataObject).length===0" class="loading-container">
        <loading></loading>
      </div>
  </scroll>



</template>

<script type="text/ecmascript-6">
  import Scroll from './scroll'
  import Loading from './loading/loading'
  import { getData } from '@/assets/js/dom'

  const ANCHOR_HEIGHT=18


  export default {
    props:{
      dataObject:{
        type:Object,
        default:null
      }
    },
    data(){
      return {
        scrollY:-1,
        currentIndex:0
      }
    },
    components:{
      Scroll,
      Loading
    },
    // 不需要被观测
    created(){
      this.touch={}
      this.listenScroll=true,
      this.listHeight=[],
      this.probeType=3
    },
    mounted(){
       window.addEventListener('scroll', this.topOffset)
    },
    methods:{
      selectItem(item){
        this.$emit('select',item)
      },
      onShortcutTouchStart(e){
        let shortcutIndex=getData(e.target,'index')
        let firstTouch=e.touches[0]    // 第一次手指位置
        this.touch.y1=firstTouch.screenY
        let letterIndex=0
        for( var i in this.dataObject){
          if(i==shortcutIndex) break
          letterIndex++
        }
        this.touch.anchorIndex=letterIndex
       
        this._scrollTo(letterIndex)
      },
       onShortcutTouchMove(e){
        let firstTouch=e.touches[0]
        this.touch.y2=firstTouch.screenY

        let delta=Math.floor((this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT) // math floor
        let anchorIndex=this.touch.anchorIndex+delta
        this._scrollTo(anchorIndex)
       },
       _calculateHeight(){
         this.listHeight=[]
         const list=this.$refs.listGroup
         let height=0
         this.listHeight.push(height)
         for(let i=0; i<list.length; i++){
           let item=list[i]
           height+=item.clientHeight
           this.listHeight.push(height)
         }
       },
      //  scroll(pos){
      //     console.log(document.documentElement.scrollTop,document.documentElement.clientHeight,document.documentElement.offsetHeight)
      //  },
       _scrollTo(index){
         if(index===Object.keys(this.dataObject).length) return
         this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
       },
      topOffset:function(){
        let height=document.documentElement.scrollTop
        const listHeight=this.listHeight
        for(let i=0;i<listHeight.length-1;i++){
          let h1=listHeight[i]
          let h2=listHeight[i+1]
          if(height>h1&&height<h2){
            this.currentIndex=i
            return
          }
        }
        this.currentIndex=0
      },
      indexToKey(index){
        let count=0
        for(var i in this.dataObject){
          if(count==index) return i
          count++
        }
      },
      refresh(){
        this.$refs.listview.refresh()
      }
    },
    watch:{
      dataObject(){
        setTimeout(()=>{
          this._calculateHeight()
        },20)
      },
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../assets/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: fixed
      z-index: 30
      right: 0
      top: 55%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

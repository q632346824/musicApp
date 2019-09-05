<template>
  <scroll class="suggest" :data="result" 
  :pullup="pullup"
  @scrollToEnd="searchMore"
  ref="suggest"
  :beforeScroll="beforeScroll"
  @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li  class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="Sorry, No Result"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">

import {search} from '@/api/search'

import { createSong, getSongParam,getMusicVkey } from '@/assets/js/song'
import Scroll from '@/components/scroll'
import Loading from '@/components/loading/loading'
import Singer from '@/assets/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from '@/components/no-result/no-result'
  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props:{
      query:{
        type:String,
        default:''
      },
      showSinger:{
        type:Boolean,
        default:true
      }

    },
    data(){
      return {
        page:1,
        result:[],
        pullup:true,
        beforeScroll:true,
        hasMore:true,
      }
    },
    methods:{
      search(){
        this.page=1
        this.hasMore=true
        this.$refs.suggest.scrollTo(0,0)
        search(this.query, this.page, this.showSinger).then(res=>{
          
          this._genResult(res)
          this.checkMore(res)
        })
      },
      _genResult(data){
        if(data.zhida&&data.zhida.singerid){
          this.result.push({...data.zhida, ...{type:TYPE_SINGER}})
        }
        if(data.song){         
          data.song.list.forEach((item)=>{
            
            getMusicVkey(item.songmid).then(response=>{
              var vkey=response.data.items[0].vkey||''
              this.result.push(createSong(item,vkey))
                })
            })
          }
      },
      getIconCls(item){
        if(item.type===TYPE_SINGER){
          return 'icon-mine'
        }else{
          return 'icon-music'
        }
      },
      getDisplayName(item){
        if(item.type===TYPE_SINGER){
          return item.singername
        }else{
          return `${item.name}-${item.singer}`
        }
      },
      checkMore(data){
        const song=data.song
        if(!song.list.length||(song.curnum+song.curpage*20)>song.totalnum){
          this.hasMore=false
        }
      },
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.page++
        search(this.query,this.page,this.showSinger).then((res)=>{
          this._genResult(res)
          this.checkMore(res)
        })
        
      },
      selectItem(item){
        console.log(item)
        if(item.type===TYPE_SINGER){
          const singer=new Singer({
            id:item.singermid,
            name:item.singername,
          })
          this.$router.push({
            path:`/search/${singer.id}`
          })
          this.setSinger(singer)
        }else{
          this.insertSong(item)
        }
        this.$emit('select')
      },
      refresh(){
        this.$refs.suggest.refresh()
      },
      listScroll(){
        this.$emit('listScroll')
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])

    },
    components: {
      Scroll,
      Loading,
      NoResult
      
    },
    watch:{
      query(){
        this.result=[]
        this.search()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "../assets/stylus/variable"
   @import "../assets/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
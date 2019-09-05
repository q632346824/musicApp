<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">hot search</h1>
            <ul>
              <li class="item" v-for="item in hotKey" :key="item.n" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">History</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="Are you sure to remvoe all history" confirmBtnText="clear" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from '@/components/search-box'
  import Suggest from '@/components/suggest'
  import {getHotKey} from '@/api/search'
  import {mapActions,mapGetters} from 'vuex'
  import SearchList from '@/components/search-list'
  import {playlistMixin} from '@/assets/js/mixin'
  import Confirm from '@/components/confirm'
  import Scroll from '@/components/scroll'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        hotKey: [],
        query:''
      }
    },
    computed:{
      shortcut(){
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    created() {
      this._getHotKey()
    },
    methods: {
      handlePlaylist(){
        const bottom=playlist.length>0 ? '60px':''
        this.$refs.shortcutWrapper.style.bottom=bottom
        this.$refs.shortcut.refresh()
        this.$refs.searchResult.style.bottom=bottom
        this.$refs.suggest.refresh()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === 0) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
        console.log('hotkey',this.hotKey)
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query){
        this.query=query
      },
      blurInput(){
        this.$refs.searchBox.blur()
      },
      saveSearch(){
        this.saveSearchHistory(this.query)

      },
      deleteOne(item){
        this.deleteSearchHistory(item)
      },
      showConfirm(){
        this.$refs.confirm.show()
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory',
      ])
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
      // Scroll,
      // Confirm,
      // Suggest
    },
    watch:{
      query(newQuery){
        if(!newQuery){          //没有搜索 手动刷新
          setTimeout(()=>{
            this.$refs.shortcut.refresh() 
          },20)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import "../assets/stylus/mixin"
  @import "../assets/stylus/variable"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
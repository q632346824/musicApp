<template>

  <scroll 
          :data="data"
          class="listview"
          ref="listview">
    <ul>
      <li v-for="(value,key) in data" class="list-group" :key="key">
        <h2 class="list-group-title">{{key}}</h2>
        <ul>
          <li v-for="item in value" :key="item.singer_id" class="list-group-item">
            <img :src="item.singer_pic" class="avatar">
            <span class="name">{{item.singer_name}}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>



</template>

<script type="text/ecmascript-6">
  import Scroll from './scroll'
  import Loading from './loading/loading'

  export default {
    props:{
      data:{
        type:Object,
        default:null
      }
    },
    components:{
      Scroll
    },
    mounted(){
      console.log("mounted",this.$refs.listview)
      this.$refs.listview.refresh()
    },
    watch:{
      // dataObject: {
      //   handler (newVal,oldVal){
      //     console.log("new",this.$refs.listview)
      //    // this.$refs.refresh()
      //     console.log(this.$refs)
      //   },
      //   immediate: true
      // }

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
      position: absolute
      z-index: 30
      right: 0
      top: 50%
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

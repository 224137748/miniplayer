<template>
  <div class="music-list">
    <h1 class="title" >{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 背景遮罩层 -->
    <!-- <div class="bg-layer" ref="layer"></div> -->
    <scroll-view  class="list" scroll-y @scroll="scroll($event)" :style="bindStyle" upper-threshold="1000" >
      <div class="song-list-wrapper" >
        <song-list  :rank="rank" @selectSongs="selectSongs"></song-list>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import SongList from 'base/song-list/song-list'
import { mapGetters, mapActions } from 'vuex'
const RESERVED_HEIGHT = 40
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      bindStyle: `top: 0px`,
      scrollY: 0,
      probeType: 3,
      listenScroll: true
    }
  },
  components: {
    SongList
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    },
    ...mapGetters(['songs'])
  },
  mounted () {
    let that = this
    wx.createSelectorQuery().select('.bg-image').boundingClientRect(res => {
      that.imageHeight = res.height
      that.minTranslateY = that.imageHeight - RESERVED_HEIGHT
      that.bindStyle = `top:${that.imageHeight}px`
    }).exec()
  },
  methods: {
    scroll (evt) {
    },
    selectSongs (item, index) {
      this.selectPlay({
        list: this.songs,
        index,
        autoPlay: true
      })
      wx.switchTab({
        url: '/pages/player/main'
      })
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  watch: {
    scrollY (newY) {
      // let translateY = Math.min(newY, this.minTranslateY)
      // this.bglayerStyle = `transform: translate3d(0, ${-translateY}px, 0)`
      // let zIndex = 0
      // let scale = 1
      // let blur = 0
    }
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.music-list {
  position relative
  width 100%
  height 100%
  background $color-background
  .title {
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color $color-text
  }
  .bg-image {
    position relative
    width 100%
    height 0
    padding-top 70%
    transform-origin top
    background-size cover
    .play-wrapper {
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play {
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play {
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        }
        .text {
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
        }
      }
    }
    .filter {
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
    }
  }
  .bg-layer {
    position: relative
    height: 100%
    background: $color-background
  }
  .list {
    position fixed
    top 0
    bottom 0
    background $color-background
    width 100%
    .song-list-wrapper {
      padding 20px 30px
    }
  }
}
</style>



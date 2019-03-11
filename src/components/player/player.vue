<template>
  <div class="player" v-show="playList.length" @touchmove.prevent.stop @click.stop>
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img class="background-iamge" :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper">
              <div class="cd">
                <img :src="currentSong.image" class="image" alt="" :animation="Animation">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <scroll-view duration="500" class="middle-r" :scroll-into-view="scrollId" scroll-y :style="lyricListStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p :id="'id' + index" class="text" :class="{current: currentLineNum === index}" v-for="(line, index) of currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
              <div class="text" v-else>抱歉，暂未搜索到歌词~！</div>
            </div>
          </scroll-view>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd'}"></span>
            <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l"></span>
            <div class="progress-bar">

            </div>
            <span class="time"></span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
// import { prefixStyle } from 'common/js/dom'
import Lyric from 'lyric-parser'
const BASEURL = 'https://aixbx.xyz'
// const transform = prefixStyle('transform')
// const transitionDuration = prefixStyle('transitionDuration')
export default {
  data () {
    return {
      songReady: false,
      currentLyric: null,
      // 旋转角度
      rotateAngle: 0,
      playingLyric: '',
      currentLineNum: 0,
      scrollTop: 0,
      currentShow: 'cd',
      lyricListStyle: '',
      middleLStyle: ''
    }
  },
  onReady () {
    this.animation = wx.createAnimation({duration: 20000 * 100})
  },
  components: {},
  computed: {
    Animation () {
      if (this.playing) {
        this.animation.rotate(360 * 100).step()
        this.rotateTimer = setInterval(() => {
          this.rotateAngle++
          this.rotateAngle %= 360
        }, 1000 / 18)
      } else {
        clearInterval(this.rotateTimer)
        this.animation.rotate(this.rotateAngle, 0).scale(1).translate(0, 0).skew(0, 0).step({duration: 0})
      }
      return this.animation.export()
    },
    cdCls () {
      return this.playing ? 'play' : 'paly pause'
    },
    // lyricList scroll Id
    scrollId () {
      return this.currentLineNum > 5 ? `id${this.currentLineNum - 5}` : 'id0'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    // 如果song准备好了 按钮高亮
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentIndex',
      'sequenceList',
      'playing',
      'currentSong',
      'mode'
    ])
  },
  created () {
    this.touch = {}
    this.initAuido()
    console.log('created')
    this.getSyctemInfo()
  },
  mounted () {
  },
  methods: {
    // 获取屏幕信息
    getSyctemInfo () {
      let that = this
      wx.getSystemInfo({
        success (res) {
          that.windowWidth = res.windowWidth
        }
      })
    },
    initAuido () {
      let audioCtx = wx.createInnerAudioContext()
      audioCtx.onPlay(this.ready)
      audioCtx.onCanplay(() => {
        console.log('music is ready')
        this.setPlayingState(true)
      })
      audioCtx.onEnded(this.end)
      audioCtx.onTimeUpdate(this.updateTime)
      audioCtx.onError(this.error)
      this.audioCtx = audioCtx
    },
    // 获取歌词
    async getLyric () {
      let lyric = await this.currentSong.getLyric()
      if (lyric) {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        this.playing && this.currentLyric.play()
        console.log('lyric ready ok', this.playing)
      } else {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      }
    },
    // handle歌词插件回调方法
    handleLyric (lyric) {
      let lineNum = lyric.lineNum
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        this.scrollID = lineNum - 5 + 'id'
      } else {
        this.scrollTop = 0
      }
      this.playingLyric = lyric.txt
    },
    // 歌曲准备
    ready () {
      this.songReady = true
      if (this.currentSong.name) {
        console.log('存入播放历史， save-history')
      }
    },
    error (code) {
      console.log('音频audio错误', code)
      this.songReady = false
    },
    updateTime (evt) {
      // console.log('timeevt', evt)
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      console.log('loop')
      this.audioCtx.seek(0)
      this.audioCtx.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.currentIndex.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
      console.log('next')
    },
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlayState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 改变播放模式
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 重新设置当前歌曲的索引
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // touch动画
    middleTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.pageX
      this.touch.startY = e.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.pageX - this.touch.startX
      const deltaY = e.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      let innerWidth = this.windowWidth
      const left = this.currentShow === 'cd' ? 0 : -innerWidth
      const offsetWidth = Math.min(0, Math.max(-innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / innerWidth)
      this.lyricListStyle = `transform: translate3d(${offsetWidth}px, 0, 0);transform-duration: 0`
      this.middleLStyle = `opacity: ${1 - this.touch.percent};transform-duration: 0`
    },
    middleTouchEnd (e) {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -this.windowWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          opacity = 0
          offsetWidth = -this.windowWidth
        }
      }
      this.lyricListStyle = `transform: translate3d(${offsetWidth}px, 0, 0);transform-duration: 0.5s`
      this.middleLStyle = `opacity: ${opacity};transform-duration: 0.5s`
    },
    ...mapMutations({
      setPlayState: 'SET_PLAYING_STATE',
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    async currentSong (newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      let url = '/song/url'
      let res = await this.$http.get(BASEURL + url, {id: newSong.id})
      console.log('get song url', res.data)
      if (res.code === 200) {
        if (res.data[0].url) {
          this.audioCtx.src = res.data[0].url
        } else {
          this.setFullScreen(false)
          wx.showToast({
            title: '没有版权',
            duration: 2000
          })
        }
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.getLyric()
    },
    playing (newVal) {
      if (this.audioCtx.src) {
        newVal ? this.audioCtx.play() : this.audioCtx.pause()
        if (this.currentLyric) {
          this.currentLyric.play()
        }
      }
    },
    currentLineNum (newVal) {
      console.log('currentlineNum', newVal, this.scrollId)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.player {
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  .normal-player {
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    z-index 150
    background $color-background
    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s
      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      }
    }
    &.normal-enter, &.normal-leave-to {
      opacity: 0
      .top {
        transform: translate3d(0, -100px, 0)
      }
      .bottom {
        transform: translate3d(0, 100px, 0)
      }
    }
    .background {
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.6
      filter blur(20px)
      .background-iamge {
        width 100%
        height 100%
      }
    }
    .top {
      position relative
      margin-bottom 25px
      .back {
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back {
          display inline-block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
        }
      }
      .title {
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        no-wrap()
        font-size $font-size-large
        color $color-text
      }
      .subtitle {
        line-height 20px
        text-align center
        font-size $font-size-medium
        color $color-text
      }
    }
    .middle {
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l {
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper {
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd {
            width 100%
            height 100%
            box-sizing border-box
            border-radius 50%
            border-radius 10 solid rgba(255, 255, 255, .1)
            &.paly {
              animation: rotate 20s linear infinite
            }
            &.pause {
              animation-play-state paused
            }
            .image {
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 50%
            }
          }
        }
      }
      .middle-r {
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper {
          width 80%
          margin 0 auto
          over-flow hidden
          text-align center
          .text {
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
            &.current {
              color $color-text
            }
          }
        }
      }
    }
    .bottom {
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper {
        text-align center
        font-size 0
        .dot {
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background $color-text-l
          &.active {
            width 20px
            border-radius 5px
            background $color-text-ll
          }
        }
      }
      .progress-wrapper {
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
        .time {
          color $color-text
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-l {
            text-align left
          }
          &.time-r {
            text-align right
          }
        }
        .progress-bar-wrapper {
          flex 1
        }
      }
      .operators {
        display flex
        align-items center
        .icon {
          flex 1
          color $color-theme
          &.disable {
            color: $color-theme-d
          }
          i {
            font-size 30px
          }
        }
        .i-left {
          text-align right
        }
        .i-center {
          padding 0 20px
          text-align center
          i {
            font-size 40px
          }
        }
        .i-right {
          text-align left
        }
        .icon-favorite {
          color $color-sub-theme
        }
      }
    }
  }
}
</style>


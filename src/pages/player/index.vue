<template>
  <div class="player" v-show="playList.length" @touchmove.prevent.stop @click.stop>
    <div class="normal-player" >
      <div class="background">
        <img class="background-iamge" :src="currentSong.image" alt="">
      </div>
      <div class="top">
        <!-- <div class="back" @click="back">
          <i class="icon-back"></i>
        </div> -->
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
            <div class="playing-lyric">{{playingLyric}}</div>
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
          <span class="time time-l">{{format}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @percentChange="onPercentChange"></progress-bar>
          </div>
          <span class="time time-r">{{duration}}</span>
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
          <div class="icon i-right" @click="toggleFavorite">
            <i class="icon" :class="favoriteIcon"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mini-player" v-show="fullScreen">
      <div class="icon">
        <img :src="currentSong.image" :class="cdCls" class="icon-image" alt="">
      </div>
      <div class="text">
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="desc">{{currentSong.singer}}</p>
      </div>
      <div class="control">
        <playgress-circle>
          <i class="icon-mini"></i>
        </playgress-circle>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div> -->
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PlaygressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import ProgressBar from 'base/progress-bar/progress-bar'
import Lyric from 'lyric-parser'
import { createSong } from 'common/js/song'
const BASEURL = 'https://aixbx.xyz'
export default {
  data () {
    return {
      songReady: false,
      currentLyric: null,
      // 旋转角度
      rotateAngle: 0,
      playingLyric: '',
      currentLineNum: 0,
      currentShow: 'cd',
      lyricListStyle: '',
      middleLStyle: '',
      Animation: {},
      currentTime: 0,
      duration: 0,
      favoriteIcon: 'icon-not-favorite'
    }
  },
  components: {
    ProgressBar,
    PlaygressCircle
  },
  created () {
    this.animation = wx.createAnimation({duration: 20000 * 100})
    setTimeout(() => {
      this.initData()
    }, 200)
    this.touch = {}
    this.initAuido()
    this.getSyctemInfo()
  },
  computed: {
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
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    format () {
      let interval = this.currentTime | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 确定是否全屏
    isfullscreen () {
      return this.fullScreen ? 'full' : 'unfull'
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentIndex',
      'sequenceList',
      'playing',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  mounted () {
  },
  methods: {
    async initData () {
      if (this.playList.length) {
        console.log('playlist 有数据')
      } else {
        let res = await this.$http.get(BASEURL + '/top/playlist?limit=10&order=hot')
        if (res.code === 200) {
          let index = Math.random() * 10 | 0
          let id = res.playlists[index].id
          if (id) {
            let songList = await this.$http.get(BASEURL + '/playlist/detail?id=' + id)
            if (songList.code === 200) {
              let songs = songList.playlist.tracks.map(el => {
                if (el.id) {
                  return createSong(el)
                }
              })
              this.selectPlay({
                list: songs,
                index: 0,
                autoPlay: false
              })
            }
          }
        }
      }
    },
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
        this.songReady = true
        console.log('music is ready')
        this.playing && audioCtx.play()
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
      this.playingLyric = lyric.txt
    },
    // 播放监听
    ready () {
      if (this.currentSong.name) {
        // console.log('存入播放历史， save-history')
        this.savePlayHistory({
          song: this.currentSong,
          wx
        })
      }
    },
    error (code) {
      console.log('音频audio错误', code)
      this.songReady = false
    },
    updateTime () {
      this.currentTime = this.audioCtx.currentTime
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.audioCtx.seek(0)
      // this.audioCtx.currentTime = 0
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
    },
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlayState(!this.playing)
      if (this.currentLyric) {
        // 微信不兼容toggle
        // this.currentLyric.togglePlay()
      }
    },
    formatFunction (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      this.duration = `${minute}:${second}`
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
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
    // 设置个人喜爱
    toggleFavorite () {
      let index = this.favoriteList.findIndex(el => {
        return el.name === this.currentSong.name
      })
      let obj = {
        song: this.currentSong,
        wx
      }
      if (index > -1) {
        this.deleteFavoriteList(obj)
      } else {
        this.saveFavoriteList(obj)
      }
      setTimeout(() => {
        this.isFavoriteSong(this.currentSong)
      }, 200)
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
      this.lyricListStyle = `transform: translate3d(${offsetWidth}px, 0, 0);transition-duration: 0;transi`
      this.middleLStyle = `opacity: ${1 - this.touch.percent};transition-duration: 0`
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
      this.lyricListStyle = `transform: translate3d(${offsetWidth}px, 0, 0);transition-duration: 0.3s`
      this.middleLStyle = `opacity: ${opacity};transition-duration: 0.3s`
    },
    initAnimate (newVal) {
      setTimeout(() => {
        if (newVal) {
          this.firstIn = false
          this.animation.rotate(360 * 100).step()
          this.rotateTimer = setInterval(() => {
            this.rotateAngle++
            this.rotateAngle %= 360
          }, 1000 / 18)
        } else {
          clearInterval(this.rotateTimer)
          this.animation.rotate(this.rotateAngle, 0).scale(1).translate(0, 0).skew(0, 0).step({duration: 0})
        }
        this.Animation = this.animation.export()
      }, 300)
    },
    // 检查是否是喜欢的歌曲
    isFavoriteSong (song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.name === song.name
      })
      if (index > -1) {
        this.favoriteIcon = 'icon-favorite'
      } else {
        this.favoriteIcon = 'icon-not-favorite'
      }
    },
    onPercentChange (percent) {
      let currentTime = percent * this.currentSong.duration
      this.audioCtx.seek(currentTime)
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 关闭往前页面
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setPlayState: 'SET_PLAYING_STATE',
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList',
      'savePlayHistory',
      'selectPlay'
    ])
  },
  watch: {
    async currentSong (newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      // 格式化歌曲时长
      this.formatFunction(newSong.duration)
      wx.showLoading({
        title: '加载中'
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 1000)
      let url = '/song/url'
      let res = await this.$http.get(BASEURL + url, {id: newSong.id})
      // console.log('get song url', res.data)
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
      // 检查是否是喜欢的歌曲
      this.isFavoriteSong(newSong)
    },
    playing (newVal) {
      if (this.audioCtx.src) {
        newVal ? this.audioCtx.play() : this.audioCtx.pause()
        if (this.currentLyric) {
          this.currentLyric.play()
        }
      }
      this.initAnimate(newVal)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.player {
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
        .playing-lyric-wrapper {
          width 80%
          margin 30px auto 0 auto
          overflow hidden
          text-align center
          .playing-lyric {
            height 20px
            line-height 20px
            font-size $font-size-medium
            color $color-text-l
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
      bottom 15px
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
  .mini-player {
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background $color-highlight-background
    .icon {
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px
      img {
        width 40px
        height 40px
        border-radius 50%
      }
    }
    .text {
      display flex
      flex-direction colum
      justify-content center
      flex 1
      line-height 20px
      over-flow hidden
      .name {
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      }
      .desc {
        no-wrap()
        font-size $font-size-small
        color $color-text-d
      }
    }
    .control {
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size 30px
        color $color-theme-d
      }
      .icon-mini {
        font-size 32px
        position absolute
        left 0
        top 0
      }
    }
  }
}
</style>


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
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd">
                <img :src="currentSong.image" class="image" alt="" :animation="Animation">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <scroll-view class="middle-r" :scroll-into-view="scrollID" scroll-y>
            <div class="lyric-wrpper">
              <div v-if="currentLyric">
                <p :id="'id' + index" class="text" :class="{current: currentLineNum === index}" v-for="(line, index) of currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
              <div class="text" v-else>抱歉，暂未搜索到歌词~！</div>
            </div>
          </scroll-view>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import Lyric from 'lyric-parser'
const BASEURL = 'https://aixbx.xyz'
export default {
  data () {
    return {
      musrcUrl: 'http://mat1.gtimg.com/cq/bruceliu/cqzj/bgm.mp3',
      currentLyric: null,
      // 旋转角度
      rotateAngle: 0,
      playingLyric: '',
      currentLineNum: 0,
      scrollID: 'id0',
      scrollTop: 0
    }
  },
  onReady () {
    this.animation = wx.createAnimation({duration: 20000 * 100})
  },
  components: {},
  computed: {
    Animation () {
      if (!this.playing) {
        this.animation.rotate(360 * 100).step()
        this.rotateTimer = setInterval(() => {
          this.rotateAngle++
          this.rotateAngle %= 360
        }, 55)
      } else {
        clearInterval(this.rotateTimer)
        this.animation.rotate(this.rotateAngle, 0).scale(1).translate(0, 0).skew(0, 0).step({duration: 0})
      }
      return this.animation.export()
    },
    cdCls () {
      return this.playing ? 'play' : 'paly pause'
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
  },
  mounted () {
    this.readyAudio()
    setTimeout(() => {
      this.setPlayState(true)
    }, 5000)
  },
  methods: {
    readyAudio () {
      if (!this.audioCtx) {
        this.audioCtx = wx.createAudioContext('myAudio')
      } else {
        setTimeout(() => {
          this.readyAudio()
        }, 1000 / 18)
      }
    },
    async getLyric () {
      console.log(222)
      let lyric = await this.currentSong.getLyric()
      console.log('get lyric', lyric)
      if (lyric) {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        this.playing && this.currentLyric.play()
      } else {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      }
    },
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
    ...mapMutations({
      setPlayState: 'SET_PLAYING_STATE',
      setFullScreen: 'SET_FULL_SCREEN'
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
          this.musrcUrl = res.data[0].url
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
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        console.log(11)
        this.getLyric()
        // this.$refs.audio.play()
      }, 50)
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
  }
}
</style>


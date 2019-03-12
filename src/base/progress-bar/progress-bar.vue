<template>
  <div class="progress-bar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrapper" :style="progressBtnStyle" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
const PROGRESSBTNWIDTH = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      progressBarWidth: 0,
      progressStyle: '',
      progressBtnStyle: '',
      progressBarLeft: 0,
      offsetWidth: 0
    }
  },
  created () {
    this.touch = {}
  },
  mounted () {
  },
  methods: {
    progressClick (e) {
      this.offsetWidth = e.pageX - this.progressBarLeft
      this._offset()
      this._triggerPercent()
    },
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startx = e.pageX
      this.touch.left = this.offsetWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.pageX - this.touch.startx
      this.offsetWidth = Math.min(this.progressBarWidth - PROGRESSBTNWIDTH, Math.max(0, this.touch.left + deltaX))
      this._offset()
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _triggerPercent () {
      const barWidth = this.progressBarWidth - PROGRESSBTNWIDTH
      const percent = this.offsetWidth / barWidth
      console.log('emit==', percent)
      this.$emit('percentChange', percent)
    },
    _offset () {
      this.progressStyle = `width: ${this.offsetWidth}px`
      this.progressBtnStyle = `transform: translate3d(${this.offsetWidth}px, 0, 0)`
    },
    getWidth () {
      let that = this
      try {
        wx.createSelectorQuery().select('.progress-bar').boundingClientRect(res => {
          that.progressBarWidth = res.width
          that.progressBarLeft = res.left
        }).exec()
      } catch (err) {
        console.log('get progress-bar-width error')
      }
    }
  },
  watch: {
    percent (newVal) {
      if (!this.progressBarWidth) {
        this.getWidth()
      }
      if (newVal >= 0 && !this.touch.initiated) {
        const barWidth = this.progressBarWidth - PROGRESSBTNWIDTH
        this.offsetWidth = newVal * barWidth
        this._offset()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.progress-bar {
  height 30px
  .bar-inner {
    position relative
    top 13px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress {
      position absolute
      height 100%
      background $color-theme
    }
    .progress-btn-wrapper {
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      .progress-btn {
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border-radius 50%
        border 3px solid $color-text
        background $color-theme
      }
    }
  }
}
</style>



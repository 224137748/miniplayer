<template>
  <div class="recommend">
    <scroll-view class="recommend-content" scroll-y>
      <div>
        <swiper class="slider-wrapper" v-if="recommends.length > 0" circular="true" interval="4000" autoplay indicator-dots="true" indicator-active-color="rgba(0,0,0,.8)">
          <swiper-item v-for="(item, index) of recommends" :key="index">
            <img :src="item.imageUrl" alt="" class="needsclick">
          </swiper-item>
        </swiper>
      </div>
    </scroll-view>
    <div class="recommend-list">
      <h1>热门歌单推荐</h1>
      <ul v-if="discList.length > 0">
        <li v-for="(item, index) in discList" class="item" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img :src="smallImage(item.picUrl)" alt="" width="60" height="60" @load="loadImage">
          </div>
          <div class="text">
            <h2 class="name" v-html="item.name"></h2>
            <p class="desc">🎧：{{parseInt(item.playCount/1000)}}万</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
const BASEURL = 'https://aixbx.xyz'
export default {
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  computed: {
    smallImage (url) {
      return url + '?imageView&thumbnail=246x0&quality=75&tostatic=0&type=jpg'
    }
  },
  methods: {
    // 获取banner图
    _getRecommend () {
      let that = this
      wx.request({
        url: BASEURL + '/banner',
        success (res) {
          let result = res.data
          if (result.code === 200) {
            that.recommends = result.banners || []
          }
        }
      })
    },

    // 获取歌单列表
    _getDiscList () {
      let that = this
      wx.request({
        url: BASEURL + '/personalized',
        success (res) {
          let result = res.data
          console.log(result)
          if (result.code === 200) {
            that.discList = result.result || []
          }
        }
      })
    },
    selectItem () {
      console.log('selected')
    }
  }
}
</script>
<style lang="stylus" scoped>
.recommend {
  width 100%
  height 100%
  .recommend-content {
    height: 100%
    overflow: hidden
    .slider-wrapper {
      .needsclick {
        width 100%
        height 100%
        display block
      }
    }

  }
}
</style>

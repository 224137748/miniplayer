<template>
  <div class="recommend">
    <scroll-view class="recommend-content" scroll-y>
      <div>
        <swiper class="slider-wrapper"  circular="true" interval="4000" autoplay indicator-dots="true" indicator-active-color="rgba(0,0,0,.8)">
          <swiper-item v-for="(item, index) of recommends" :key="index">
            <img :src="item.imageUrl" alt="" class="needsclick">
          </swiper-item>
        </swiper>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul v-if="discList.length > 0">
          <li v-for="(item, index) in discList" class="item" :key="index" @click="selectItem(item)">
            <div class="icon">
              <img :src="item.picUrl + '?imageView&thumbnail=246x0&quality=75&tostatic=0&type=jpg'" alt="" width="60" height="60" @load="loadImage">
            </div>
            <div class="text">
              <h2 class="name" v-html="item.name"></h2>
              <p class="desc">🎧：{{item.playCount / 1000 | 0}}万</p>
            </div>
          </li>
        </ul>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import { BASEURL } from 'api/config'
import { mapMutations } from 'vuex'
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
          if (result.code === 200) {
            that.discList = result.result || []
          }
        }
      })
    },
    selectItem (item) {
      wx.navigateTo({
        url: `../disc/main?id=${item.id}`
      })
      this.setDisc(item)
    }
  },
  ...mapMutations({
    setDisc: 'SET_DISC'
  })
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
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
    .recommend-list {
      .list-title{
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      }
      .item {
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .icon {
          flex: 0 0 60px
          width: 60px
          height 60px
          padding-right: 20px
          img {
            width 100%
            height 100%
          }
        }
        .text {
            display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
        }
        .name {
          margin-bottom: 10px
          color: $color-text
        }
        .desc {
          color: $color-text-d
        }
      }
    }
  }
}
</style>

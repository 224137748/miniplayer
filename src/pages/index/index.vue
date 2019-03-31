<template>
  <div class="index-wrap">
    <scroll-view  class="tab" scroll-x :scroll-into-view="currentTab" :scroll-with-animation="true">
      <div :id="'id'+ index" class="tab-item" v-for="(item, index) of tabList" :key="index" @click="selectItem(index)">
        <span :class="{active: tabIndex===index}" class="tab-link">{{item}}</span>
      </div>
    </scroll-view>
    <div class="main-container" >
      <swiper @change="swiperChange($event)" class="swiper-wrap" :indicator-dots="false" :autoplay="false" :current="tabIndex">
        <swiper-item class="swiper-item">
          <recommend :tabIndex="tabIndex"></recommend>
        </swiper-item>
        <swiper-item class="swiper-item">
          <singer></singer>
        </swiper-item>
        <swiper-item class="swiper-item">
          <rank></rank>
        </swiper-item>
        <swiper-item class="swiper-item">
          <search></search>
        </swiper-item>
        <swiper-item class="swiper-item">
          <div>5</div>
        </swiper-item>
        <swiper-item class="swiper-item">
          <div>6</div>
        </swiper-item>
        <swiper-item class="swiper-item">
          <div>7</div>
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>

<script>
// import card from '@/components/card'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import { SEARCH_KEY, PLAY_KEY, FAVORITE_KEY } from 'common/js/config'
import { mapGetters, mapMutations } from 'vuex'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
export default {
  data () {
    return {
      tabIndex: 3,
      tabList: ['推荐', '歌手', '排行', '搜索', '热门', '电台', '嘻哈'],
      motto: 'Hello miniprograme',
      userInfo: {
        nickName: 'mpvue',
        avatarUrl: 'http://mpvue.com/assets/logo.png'
      }
    }
  },
  components: {
    Recommend,
    Singer,
    Rank,
    Search
  },
  computed: {
    currentTab () {
      let index = this.tabIndex - 2
      return index >= 0 ? `id${index}` : 'id0'
    },
    ...mapGetters([
      'playHistory',
      'searchHistory',
      'favoriteList',
      'playList'
    ])
  },
  created () {
    this._getUserData()
  },
  methods: {
    _getUserData () {
      let that = this
      wx.getStorage({
        key: SEARCH_KEY,
        success (res) {
          that.setSearchHistory(res.data || [])
        },
        fail () {
          console.log('get searchHistory fail')
        }
      })
      wx.getStorage({
        key: PLAY_KEY,
        success (res) {
          that.setPlayHistory(res.data || [])
        },
        fail () {
          console.log('get playHistory fail')
        }
      })
      wx.getStorage({
        key: FAVORITE_KEY,
        success (res) {
          that.setFavoriteList(res.data || [])
        },
        fail () {
          console.log('get favoriteList fail')
        }
      })
    },
    selectItem (index) {
      this.tabIndex = index
    },
    swiperChange (evt) {
      this.selectItem(evt.target.current)
    },
    ...mapMutations({
      setPlayHistory: 'SET_PLAY_HISTTORY',
      setSearchHistory: 'SET_SEARCH_HISTTORY',
      setFavoriteList: 'SET_FAVORITE_LIST'
    })
  },
  watch: {
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~common/stylus/variable"
.index-wrap {
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  .tab {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;
    white-space: nowrap;
  }
  .tab-item {
    display: inline-block;
    text-align: center;
    width: 20%;
    .tab-link {
      padding-bottom :5px;
      color:$color-text-l;
      &.active {
        color:$color-theme;
        border-bottom:2px solid $color-theme;
      }
    }
  }
  .main-container {
    position fixed
    left 0
    right 0
    bottom 0
    top 44px
    .swiper-wrap {
      width 100%
      height 100%
    }
  }
}
</style>


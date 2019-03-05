<template>
  <div class="index-wrap">
    <scroll-view  class="tab" scroll-x :scroll-into-view="currentTab" scroll-with-animation="true">
      <div :id="'id'+ index" class="tab-item" v-for="(item, index) of tabList" :key="index" @click="selectItem(index)">
        <span :class="{active: tabIndex===index}" class="tab-link">{{item}}</span>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      tabIndex: 0,
      tabList: ['推荐', '歌手', '排行', '搜索', '热门', '电台', '嘻哈'],
      motto: 'Hello miniprograme',
      userInfo: {
        nickName: 'mpvue',
        avatarUrl: 'http://mpvue.com/assets/logo.png'
      }
    }
  },
  components: {
    card
  },
  computed: {
    currentTab () {
      let index = this.tabIndex - 2
      return index >= 0 ? `id${index}` : 'id0'
    }
  },
  methods: {
    selectItem (index) {
      this.tabIndex = index
    }
  },

  created () {
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~common/stylus/variable"
.index-wrap {
  position: relative;
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
}
</style>


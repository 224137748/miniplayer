<template>
  <scroll-view class="
  suggest" scroll-y>
  <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) of resultList" :key="index">
        <div class="icon">
          <i :class="item.type === 'singer' ? 'icon-mine': 'icon-music'"></i>
        </div>
        <div class="name">
          <p class="text">{{item.name + '=' + item.singer}}</p>
        </div>
      </li>
    </ul>
    <loading :title="'搜索中...'"  v-if="loadingType"></loading>
    <div v-show="empty" class="no-result-wrapper">
      <no-result title="'抱歉，暂无搜索结果'"></no-result>
    </div>
  </scroll-view>
</template>
<script>
import NoResult from 'base/no-result/no-result'
import Loading from 'base/loading/loading'
import { createSong3 } from 'common/js/song'
const BASEURL = 'https://aixbx.xyz'
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      resultList: [],
      empty: false,
      loadingType: false
    }
  },
  components: {
    NoResult,
    Loading
  },
  methods: {
    async search () {
      this.loadingType = true
      let data = {
        keywords: this.query
      }
      let res = await this.$http.get(BASEURL + '/search', data)
      this.loadingType = false
      if (res.code === 200) {
        if (res.result.songCount > 0) {
          this.empty = false
          this.resultList = this._normalizeList(res.result.songs)
        } else {
          this.resultList = []
          this.empty = true
        }
      }
    },
    _normalizeList (list) {
      let ret = []
      list.forEach(item => {
        ret.push(createSong3(item))
      })
      // console.log(ret)
      return ret
    }
  },
  watch: {
    query (newVal) {
      if (newVal) {
        this.resultList = []
        this.search()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest {
    overflow hidden
    height: 100%
    overflow: hidden
    .suggest-list {
      padding: 0 30px
      .suggest-item {
        display: flex
        align-items: center
        padding-bottom: 20px
      }
      .icon {
        flex: 0 0 30px
        width: 30px
        [class^="icon-"] {
          font-size: 14px
          color: $color-text-d
        }
      }
      .name {
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text {
          no-wrap()
        }
      }
    }
    .no-result-wrapper {
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    }
  }
</style>

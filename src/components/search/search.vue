<template>
  <div class="search">
    <div class="search-box-wrapper" >
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- 当没有输入搜索关键词的时候显示的内容 -->
    <div class="shortcut-wrapper" v-show="!query">
      <scroll-view class="shortcut" scroll-y="true">
        <div>
          <div class="hot-key" v-if="hotKey.length">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.first)" class="item" v-for="(item, index) of hotKey" :key="index">
                <span>{{item.first}}</span>
              </li>
            </ul>
          </div>
        </div>
      </scroll-view>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
  </div>
</template>
<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'base/suggest/suggest'
import { mapActions } from 'vuex'

const BASEURL = 'https://aixbx.xyz'
export default {
  data () {
    return {
      query: '',
      hotKey: []
    }
  },
  components: {
    SearchBox,
    Suggest
  },
  created () {
    this._getHotKey()
  },
  methods: {
    async _getHotKey () {
      let res = await this.$http.get(BASEURL + '/search/hot')
      if (res.code === 200) {
        this.hotKey = res.result.hots || []
      }
    },
    addQuery (query) {
      // this.query = query
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
      console.log('query has changed')
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  },
  watch: {
    query (newVal) {
      if (!newVal) {
        setTimeout(() => {
          console.log('scroll-view refresh')
        }, 20)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.search {
  width 100%
  height 100%
  .search-box-wrapper {
    margin 20px
  }
  .shortcut-wrapper {
    position: fixed
    top: 80px
    bottom: 0
    width: 100%
    .shortcut {
        height: 100%
        overflow: hidden
        .hot-key {
          margin: 0 20px 20px 20px
          .title {
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          }
          .item {
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
          }
        }
        .search-history {
          position: relative
          margin: 0 20px
          .title {
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text {
              flex: 1
            }
            .clear {
              extend-click()
              .icon-clear {
                font-size: $font-size-medium
                color: $color-text-d
              }
            }
          }
        }
    }
  }
  .search-result {
    position: fixed
    width: 100%
    top: 80px
    bottom: 0
  }
}
</style>


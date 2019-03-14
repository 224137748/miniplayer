<template>
  <div class="rank">
    <scroll-view class="toplist" scroll-y>
      <ul v-if="topList.length">
        <li class="item" v-for="(item, index) of topList" :key="index" @click="selectItem(item, index)">
          <div class="icon">
            <img  width="100" height="100" :src="item.picUrl" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index2) of item.songList" :key="index2">
              <span>{{index + 1}}.</span>
              <span>{{song.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-wrap" v-else>
        <loading ></loading>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import Loading from 'base/loading/loading'
import { createSong } from 'common/js/song'
const BASEURL = 'https://aixbx.xyz'
export default {
  data () {
    return {
      topList: []
    }
  },
  components: {
    Loading
  },
  created () {
    setTimeout(() => {
      this.getTopList()
    }, 500)
  },
  mounted () {
  },
  methods: {
    async getTopList () {
      let rankList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(el => {
        return this.$http.get(BASEURL + '/top/list?idx=' + el)
      })
      Promise.all(rankList).then((arg) => {
        let topList = arg.map(el => {
          return el.playlist
        })
        this.topList = this._normolizeList(topList)
      }).catch((err) => {
        wx.hideLoading()
        console.log(err)
      })
    },
    _normolizeList (list) {
      let ret = []
      let obj = {}
      list.forEach(item => {
        let curSong = []
        let songs = []
        curSong = item.tracks.slice(0, 50)
        curSong.forEach(musicData => {
          songs.push(createSong(musicData))
        })
        obj = Object.assign({}, {
          picUrl: item.coverImgUrl,
          songList: item.tracks.slice(0, 3) || [],
          description: item.description,
          songs: songs,
          id: item.id
        })
        ret.push(obj)
      })
      return ret
    },
    selectItem (item, index) {
      console.log(item, index)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.rank, .toplist {
  width 100%
  height 100%
}
.toplist {
  overflow: hidden
  .item {
    display: flex
    margin: 0 20px
    padding-top: 20px
    height: 100px
    &:last-child {
      padding-bottom: 20px
    }
    .icon {
      flex: 0 0 100px
      width: 100px
      height: 100px
      img {
        width 100%
        height 100%
      }
    }
    .songlist {
      flex: 1
      display: flex
      flex-direction: column
      justify-content: center
      padding: 0 20px
      height: 100px
      overflow: hidden
      background: $color-highlight-background
      color: $color-text-d
      font-size: $font-size-small
      .song {
        no-wrap()
        line-height: 26px
      }
    }
  }
  .loading-container {
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
  }
}
.loading-wrap {
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center
}
</style>


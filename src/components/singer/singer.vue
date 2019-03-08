<template>
  <div class="singer" ref="singer">
    <scroll-view class="listview" scroll-y v-if="singer.length > 0" @scrolltolower="_getSingerList">
      <ul>
        <li class="list-group-item" v-for="(item, index) of singer" :key="index" @click="selectSinger(item)">
          <img class="avatar" :src="item.img1v1Url + '?imageView&thumbnail=246x0&quality=75&tostatic=0&type=jpg'" alt="">
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
   </scroll-view>
  </div>
</template>
<script>
import { BASEURL } from 'api/config'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      singer: [],
      offset: 0
    }
  },
  components: {
  },
  mounted () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      wx.showLoading({
        title: '加载中'
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 1000)
      let that = this
      wx.request({
        url: BASEURL + '/top/artists',
        method: 'GET',
        data: {
          offset: that.offset,
          limit: 30
        },
        success (res) {
          let result = res.data
          if (result.code === 200) {
            that.offset++
            that.singer = that.singer.concat(result.artists)
            // console.log(that.singer)
          }
        }
      })
    },
    selectSinger (item) {
      let obj = {
        name: item.name,
        picUrl: item.img1v1Url
      }
      this.setDisc(obj)
      wx.navigateTo({
        url: '/pages/singer-detail/main?id=' + item.id
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.singer {
  height 100%
  .listview {
    position: relative
    height 100%
    overflow: hidden
    background: $color-background
    .list-group-item {
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar {
        width: 50px
        height: 50px
        border-radius: 50%
      }
      .name {
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
      }
    }
  }

}
</style>


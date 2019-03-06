<template>
  <div class="disc-wrap">
    <h1>disc-wrap</h1>
  </div>
</template>
<script>
import { BASEURL } from 'api/config'
export default {
  data () {
    return {
      id: '',
      songs: [],
      description: ''
    }
  },
  onLoad (option) {
    console.log(option)
    this.id = option.id || ''
  },
  mounted () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (this.id) {
        let that = this
        wx.showLoading({
          title: '加载中'
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 1000)
        wx.request({
          url: BASEURL + '/playlist/detail',
          data: {
            id: that.id
          },
          success (res) {
            let result = res.data
            console.log(result)
            if (result.code === 200) {
              that.songs = result.playlist.tracks || []
              that.description = result.name || ''
            }
          }
        })
      } else {
        setTimeout(() => {
          this._getSongList()
        }, 300)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>



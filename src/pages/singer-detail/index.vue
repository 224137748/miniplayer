<template>
  <div class="singer-detail-wrapper">
    <music-list :title="title" :bgImage="bgImage"></music-list>
  </div>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import { BASEURL } from 'api/config'
import { mapGetters, mapMutations } from 'vuex'
import { createSong } from 'common/js/song'

export default {
  data () {
    return {
      id: ''
    }
  },
  components: {
    MusicList
  },
  onLoad (option) {
    this.id = option.id
  },
  computed: {
    title () {
      return this.disc.name
    },
    bgImage () {
      return this.disc.picUrl
    },
    ...mapGetters(['disc'])
  },
  mounted () {
    this._getSingerDetail()
  },
  methods: {
    async _getSingerDetail () {
      let that = this
      if (this.id) {
        wx.showLoading({
          title: '加载中'
        })
        let url = BASEURL + '/artists'
        let res = await this.$http.get(url, {id: that.id})
        this.formate(res.hotSongs)
        wx.hideLoading()
      } else {
        setTimeout(() => {
          this._getSingerDetail()
        }, 300)
      }
    },
    formate (data) {
      let newArr = data.map((el) => {
        if (el.id) {
          return createSong(el)
        }
      })
      this.setSongs(newArr)
    },
    ...mapMutations({
      setSongs: 'SET_SONGS'
    })
  },
  onUnload () {
    this.setSongs([])
  }
}
</script>
<style lang="stylus" scoped>
.singer-detail-wrapper {
  height 100vh
}
</style>

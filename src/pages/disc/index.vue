<template>
  <div class="disc-wrap">
    <music-list  :title="this.title" :bgImage="this.bgImage" :rank="rank"></music-list>
  </div>
</template>
<script>
import { BASEURL } from 'api/config'
import { mapGetters, mapMutations } from 'vuex'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
      id: '',
      rank: false,
      description: ''
    }
  },
  onLoad (option) {
    this.id = option.id
    this.rank = option.rankType === '1'
  },
  components: {
    MusicList
  },
  mounted () {
    this._getSongList()
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
  methods: {
    async _getSongList () {
      if (this.id) {
        let that = this
        wx.showLoading({
          title: '加载中'
        })
        let url = BASEURL + '/playlist/detail'
        let result = await that.$http.get(url, {id: that.id})
        that.formate(result.playlist.tracks)
        wx.hideLoading()
      } else {
        setTimeout(() => {
          this._getSongList()
        }, 30)
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
.disc-wrap {
  height 100vh
}
</style>



<template>
  <div class="disc-wrap">
    <music-list  :title="this.title" :bgImage="this.bgImage" :rank="false"></music-list>
  </div>
</template>
<script>
import { BASEURL } from 'api/config'
import { mapGetters, mapMutations } from 'vuex'
import MusicList from 'components/music-list/music-list'

export default {
  data () {
    return {
      id: '',
      description: ''
    }
  },
  onLoad (option) {
    this.id = option.id
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
        setTimeout(() => {
          wx.hideLoading()
        }, 1000)
        let url = BASEURL + '/playlist/detail'
        let result = await that.$http.get(url, {id: that.id})
        that.formate(result.playlist.tracks)
      } else {
        setTimeout(() => {
          this._getSongList()
        }, 30)
      }
    },
    formate (data) {
      let newArr = data.map((el) => {
        let obj = {
          name: el.name || '',
          desc: el.ar[0].name + ' 。 ' + el.al.name,
          id: el.id
        }
        return obj
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



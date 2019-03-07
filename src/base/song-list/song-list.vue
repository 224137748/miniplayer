<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) of songs" :key="index" @click="selectItem(song, index)">
        <div class="rank" v-show="rank"></div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.desc}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'songs'
    ])
  },
  mounted () {
  },
  methods: {
    selectItem (item, index) {
      console.log(item, index)
      this.$emit('selectSongs', item, index)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.song-list {
  .item {
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    color white
    .content {
      flex 1
      line-height 20px
      overflow hidden
      .name {
        no-wrap()
        color: $color-text
      }
      .desc {
        no-wrap()
        margin-top 4px
        color $color-text-d
      }

    }
  }
}
</style>


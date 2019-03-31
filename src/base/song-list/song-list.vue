<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) of songs" :key="index" @click="selectItem(song, index)">
        <div class="rank" v-show="rank">
          <span class="text icon" :class="'icon' + index">{{index > 2 ? index + 1 : ''}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer + '-' + song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
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
    .rank {
      flex 0 0 25px
      width 25px
      margin-right: 30px
      text-align: center
      .icon {
        display inline-block
        width 25px
        height 24px
        background-size 25px 24px
        &.icon0 {
          bg-image('first')
        }
        &.icon1 {
          bg-image('second')
        }
        &.icon2 {
          bg-image('third')
        }
      }
      .text {
        color $color-theme
        font-size $font-size-large
      }
    }
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


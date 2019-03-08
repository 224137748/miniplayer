<template>
  <div class="player" v-show="playList.length" @touchmove.prevent.stop @click.stop>
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" src="" alt="">
        </div>
        <div class="top">

        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  components: {},
  computed: {
    ...mapGetters(['playList', 'fullScreen'])
  },
  mounted () {
    console.log('player')
  },
  methods: {}
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.player {
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  background rgba(255, 255, 255, .3)
}
</style>


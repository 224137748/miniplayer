<template>
  <div class="loading">
    <img class="img" src="./loading.gif" width="24" height="24" alt="">
    <p class="desc">{{title || '正在载入...'}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="stylus">
@import "~common/stylus/variable"
.loading {
  width:100%
  text-align :center
  .img {
    width 40px
    height 40px
  }
  .desc {
    line-height :20px
    font-size:$font-size-small
    color: #fff
  }
}
</style>

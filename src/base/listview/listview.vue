<template>
  <scroll-view class="listview">
    <ul>
      <li class="list-group-item" v-for="(item, index) of data" :key="index" @click="selectItem(item)">
        <img class="avator" :src="item.img1v1Url + '?imageView&thumbnail=246x0&quality=75&tostatic=0&type=jpg'" alt="">
        <span class="name">{{item.name}}</span>
      </li>
    </ul>
  </scroll-view>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    }
  }
}
</script>


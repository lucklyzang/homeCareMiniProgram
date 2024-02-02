<template>
  <view class="container">
    <web-view :src="externalUrl"></web-view>
  </view>
</template>
 
<script>
export default {
  data() {
    return {
      externalUrl: ''
    };
  },
  onLoad() {
    this.externalUrl = this.$route.query.url;
  }
};
</script>
 
<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
</style>

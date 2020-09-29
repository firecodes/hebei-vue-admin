<template>
  <div class="app-wrapper">
    <navbar />
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <router-view :key="key" />
    <!-- </transition> -->
  </div>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'ScreenLayout',
  components: { Navbar },
  props: {},
  data() {
    return {}
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.app-wrapper {
  width: 1920px;
  height: 1080px;
  background-image: linear-gradient(#05549b, #001f4d);
  color: #fff;
  padding: 15px;
}
</style>

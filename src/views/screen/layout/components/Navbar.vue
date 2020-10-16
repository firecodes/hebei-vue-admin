<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="nav-item" :class="{ active: path === '/screen/home' }" @click="$router.push('/screen/home')"><i class="el-icon-s-home" /> 首页</div>
    </div>
    <div class="navbar-mid">
      <div class="navbar-mid-wrap">
        <div class="nav-item" :class="{ active: path.startsWith('/screen/wholesale') }" @click="$router.push('/screen/wholesale')">
          <span>批发业务</span>
        </div>
        <div class="nav-item" :class="{ active: path.startsWith('/screen/retail') }" @click="$router.push('/screen/retail')">
          <span>零售业务</span>
        </div>
        <h1>河北分公司销售管理系统</h1>
        <div class="nav-item" :class="{ active: path === '/screen/customer' }" @click="$router.push('/screen/customer')">
          <span>客户情况</span>
        </div>
        <div class="nav-item" :class="{ active: path === '/screen/price' }" @click="$router.push('/screen/price')">
          <span>价格分析</span>
        </div>
      </div>
    </div>
    <div class="navbar-right">
      <span class="time">{{ time }}</span>
      <img src="@/assets/img/screen/exit.png" alt @click="$router.push('/pc/home')" />
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  components: {},
  props: {},
  data() {
    return {
      time: parseTime(new Date())
    }
  },
  computed: {
    path() {
      return this.$route.path
    }
  },
  watch: {},
  created() {
    setInterval(() => {
      this.time = parseTime(new Date())
    }, 1000)
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.navbar {
  height: 60px;
  margin-bottom: 15px;
  display: flex;
  font-size: 18px;
  .navbar-left {
    text-align: left;
    width: 280px;
    padding-top: 30px;
  }
  .navbar-right {
    text-align: right;
    width: 280px;
    line-height: 60px;
    .time {
      color: #01fafe;
      margin-right: 15px;
    }
    // .exit
    img {
      position: relative;
      top: 6px;
      cursor: pointer;
    }
  }
  .navbar-mid {
    flex-grow: 1;
    background: url(~@/assets/img/screen/nav-item-bg-line.png) no-repeat left 13px;
    .navbar-mid-wrap {
      display: flex;
      justify-content: space-between;
      background: url(~@/assets/img/screen/nav-item-bg-line.png) no-repeat right 13px;
    }
    h1 {
      font-size: 40px;
      line-height: 60px;
      text-shadow: 0 0 5px #ffffff;
      margin: 0;
      font-weight: 400;
    }
    .nav-item {
      width: 157px;
      height: 57px;
      padding-top: 5px;
      text-align: center;
      background: url(~@/assets/img/screen/nav-item-bg.png) no-repeat;
      span {
        display: inline-block;
        background: url(~@/assets/img/screen/nav-item-dot-b.png) no-repeat center top;
        background-size: 18px 18px;
        padding-top: 25px;
      }
      &.active,
      &:hover {
        span {
          background-image: url(~@/assets/img/screen/nav-item-dot-y.png);
        }
      }
    }
  }
  .nav-item {
    cursor: pointer;

    &.active,
    &:hover {
      color: #f4e925;
    }
  }
}
</style>

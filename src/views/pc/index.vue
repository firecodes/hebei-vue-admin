<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header height="50px">
      <PcHeader />
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <PcNav :is-collapse.sync="isCollapse" />
      </el-aside>
      <!-- 右边页面主体区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import PcHeader from '@/components/PcHeader'
import PcNav from '@/components/PcNav'

export default {
  name: 'Pc',
  data () {
    return {
      isCollapse: false
    }
  },
  components: {
    PcHeader,
    PcNav
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    line-height: 50px;
    background-color: #28374d;
    color: #fff;
  }
  .el-aside {
    background-color: #344762;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

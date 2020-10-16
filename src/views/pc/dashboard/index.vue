<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <panel-group :cards="cards" />

        <div class="chart-wrapper">
          <h4>批发业务销售统计</h4>
          <sales-chart :chart-data="wholesalesStat" height="350px" main-color="#333" />
        </div>
        <div class="chart-wrapper">
          <h4>零售业务销售统计</h4>
          <sales-chart :chart-data="resalesStat" :color="['#5d62b5', '#29c3be']" height="350px" main-color="#333" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-wrapper">
          <h4>销售占比</h4>
          <proportion-chart :chart-data="cards" />
        </div>
        <div class="chart-wrapper">
          <h4>管道天然气门站价格</h4>
          <basic-chart :chart-data="gatePrice" unit="元/立方米" main-color="#333" />
        </div>
        <div class="chart-wrapper">
          <h4>管道天然气零售价格</h4>
          <basic-chart :chart-data="retailprice" unit="元/立方米" main-color="#333" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'

import dashboard from '@/mixins/dashboard'

export default {
  mixins: [dashboard],
  name: 'PcDashboard',
  components: {
    PanelGroup
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 20px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="管道天然气门站价格" name="1">
        <gate-price />
      </el-tab-pane>
      <el-tab-pane label="管道天然气零售价格" name="2" lazy>
        <retail-price />
      </el-tab-pane>
      <el-tab-pane label="LNG 接收站销售价格" name="3" lazy>
        <lng-receive />
      </el-tab-pane>
      <el-tab-pane label="LNG 工厂销售价格" name="4" lazy>
        <lng-plant />
      </el-tab-pane>
      <el-tab-pane label="LNG 加气站零售价格" name="5" lazy>
        <lng-retail />
      </el-tab-pane>
      <el-tab-pane label="CNG 车用价格" name="6" lazy>
        <cng-price />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import GatePrice from './sub/GatePrice'
import RetailPrice from './sub/RetailPrice'
import LngReceive from './sub/LngReceive'
import LngPlant from './sub/LngPlant'
import LngRetail from './sub/LngRetail'
import CngPrice from './sub/CngPrice'

export default {
  components: {
    GatePrice,
    RetailPrice,
    LngReceive,
    LngPlant,
    LngRetail,
    CngPrice
  },
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {}
}
</script>

<style scoped>
</style>

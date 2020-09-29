<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="管道天然气门站价格" name="1">
        <NaturalValveStation />
      </el-tab-pane>
      <el-tab-pane label="管道天然气零售价格" name="2" lazy>
        <NaturalRetailPrice />
      </el-tab-pane>
      <el-tab-pane label="LNG 接收站销售价格" name="3" lazy>
        <LngReceive />
      </el-tab-pane>
      <el-tab-pane label="LNG 工厂销售价格" name="4" lazy>
        <LngPlant />
      </el-tab-pane>
      <el-tab-pane label="LNG 加气站零售价格" name="5" lazy>
        <LngRetailPrice />
      </el-tab-pane>
      <el-tab-pane label="CNG 车用价格" name="6" lazy>
        <CngCar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import NaturalValveStation from './sub/NaturalValveStation'
import NaturalRetailPrice from './sub/NaturalRetailPrice'
import LngReceive from './sub/LngReceive'
import LngPlant from './sub/LngPlant'
import LngRetailPrice from './sub/LngRetailPrice'
import CngCar from './sub/CngCar'

export default {
  components: {
    NaturalValveStation,
    NaturalRetailPrice,
    LngReceive,
    LngPlant,
    LngRetailPrice,
    CngCar
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

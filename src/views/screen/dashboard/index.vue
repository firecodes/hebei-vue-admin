<template>
  <div class="container screen">
    <!-- 左边 -->
    <div class="container-left chart-wrapper map-wrapper">
      <!-- 3个card -->
      <panel-group :cards="cards" />
      <div class="map">
        <!-- 显示地图 -->
        <china-map v-show="!showGuangxian" :cards="cards" :click-fn="handleClick" />
        <!-- 显示管线 -->
        <div v-show="showGuangxian" class="mapOp">
          <div class="mapOp-btn">
            <span class="skipBtn" @click="showGuangxian = false">返回首页</span>
            <span class="skipBtn" @click="handleEnlarge">放大</span>
          </div>
          <div class="guanxiantu-img">
            <img src="~@/assets/img/screen/guanxiantu-index.png" />
          </div>
        </div>
      </div>

      <!-- 四个角的三角形 -->
      <div class="angel">
        <img class="img1" src="~@/assets/img/screen/angle.png" alt />
        <img class="img2" src="~@/assets/img/screen/angle.png" alt />
        <img class="img3" src="~@/assets/img/screen/angle.png" alt />
        <img class="img4" src="~@/assets/img/screen/angle.png" alt />
      </div>
    </div>
    <div class="container-right">
      <!-- 销售统计 -->
      <div class="chart-wrapper mb-1">
        <div class="chart-wrapper-title">
          <h4>销售统计</h4>
          <div class="op">
            <span :class="{ active: salesType === 'wholesales' }" @click="salesType = 'wholesales'">批发业务</span> |
            <span :class="{ active: salesType === 'resales' }" @click="salesType = 'resales'">零售业务</span>
          </div>
        </div>
        <sales-chart v-if="salesType === 'wholesales'" :chart-data="wholesalesStat" :color="['#d9b03c', '#29c2bf']" />
        <basic-chart v-else type="bar" :chart-data="resalesStat" :color="['#d9b03c']" width="100%" />
      </div>
      <!-- 销售占比 -->
      <div class="chart-wrapper mb-1">
        <div class="chart-wrapper-title">
          <h4>销售占比</h4>
        </div>
        <proportion-chart :chart-data="cards" :rich="true" />
      </div>
      <!-- 管道天然气价格 -->
      <div class="chart-wrapper">
        <div class="chart-wrapper-title">
          <h4>管道天然气价格</h4>
          <div class="op">
            <span :class="{ active: priceType === 'gate' }" @click="priceType = 'gate'">门站</span> |
            <span :class="{ active: priceType === 'retail' }" @click="priceType = 'retail'">零售</span>
          </div>
        </div>
        <basic-chart :chart-data="priceType === 'gate' ? gatePrice : retailprice" :height="'267px'" :color="['#29c3be', '#5d62b5', '#fdc931']" unit="元/立方米" :connectNulls="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import ChinaMap from './components/ChinaMap'

import dashboard from '@/mixins/dashboard'

export default {
  mixins: [dashboard],
  name: 'ScreenDashboard',
  components: {
    PanelGroup,
    ChinaMap
  },
  data() {
    return {
      cards: {},
      showGuangxian: false, // 管线图/地图
      salesType: 'wholesales', // 批发业务/零售业务
      priceType: 'gate' // 门站/零售
    }
  },
  mounted() {},
  methods: {
    // 地图点击
    handleClick(params) {
      if (params.name === '河北') {
        this.showGuangxian = true
      }
    },
    handleEnlarge() {
      const routeUrl = this.$router.resolve({
        path: '/guanxian'
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
}
.container-left {
  position: relative;
  width: 1160px;
  padding: 22px 44px;
  .map {
    height: 800px;
  }
}
.container-right {
  width: 715px;
}
</style>

<template>
  <div class="container screen">
    <!-- 左边 -->
    <div class="container-left chart-wrapper map-wrapper">
      <!-- 3个card -->
      <panel-group :cards="cards" />
      <div class="map">
        <!-- 显示地图 -->
        <china-map v-show="!showGuangxian" :cards="cards" :height="'800px'" :cb="handleMapClick" />
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
      <!-- 批发业务销售统计 -->
      <div class="chart-wrapper mb-1">
        <div class="chart-wrapper-title">
          <h4>批发业务销售统计</h4>
          <div class="op">
            <span :class="{ active: salesType === 'wholesales' }" @click="salesType = 'wholesales'">批发业务</span> |
            <span :class="{ active: salesType === 'resales' }" @click="salesType = 'resales'">零售业务</span>
          </div>
        </div>
        <sales-chart :chart-data="salesType === 'wholesales' ? wholesalesStat : resalesStat" :height="'260px'" :color="['#d9b03c', '#29c2bf']" />
      </div>
      <!-- 销售占比 -->
      <div class="chart-wrapper mb-1">
        <div class="chart-wrapper-title">
          <h4>销售占比</h4>
        </div>
        <proportion-chart :chart-data="cards" :height="'260px'" :rich="true" />
      </div>
      <!-- 管道天然气门站价格 -->
      <div class="chart-wrapper">
        <div class="chart-wrapper-title">
          <h4>管道天然气门站价格</h4>
          <div class="op">
            <span :class="{ active: priceType === 'gate' }" @click="priceType = 'gate'">门站</span> |
            <span :class="{ active: priceType === 'retail' }" @click="priceType = 'retail'">零售</span>
          </div>
        </div>
        <basic-chart :chart-data="priceType === 'gate' ? gatePrice : retailprice" :height="'267px'" :color="['#29c3be', '#5d62b5', '#fdc931']" unit="元/立方米" />
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import BasicChart from '@/components/Charts/BasicChart'
import SalesChart from '@/components/Charts/SalesChart'
import ProportionChart from '@/components/Charts/ProportionChart'
import ChinaMap from './components/ChinaMap'

import { daterange1month, daterange6month, parseDate, getSalesChartSource, getPriceSource } from '@/utils'
import { getCards, getWholesalesStat, getResalesStat } from '@/api/screen'
import { getCards as getWholesalesCards } from '@/api/screen/wholesales'
import { getGatePrice, getRetailPrice } from '@/api/screen/price'

export default {
  name: 'ScreenHome',
  components: {
    PanelGroup,
    SalesChart,
    ProportionChart,
    BasicChart,
    ChinaMap
  },
  props: {},
  data() {
    return {
      cards: {
        wholeSale: 0,
        wholeSaleTongBi: 0,
        wholeSaleHuanbBi: 0,
        wholeSaleDate: '',
        retail: 0,
        retailDate: '',
        temperatureToday: 0,
        guandaoqi: 0,
        lng: 0,
        weatherTodayMid: 0,
        weatherTodayHigh: 0,
        weatherTodayLow: 0,
        weatherYesterMid: 0,
        weatherYesterHigh: 0,
        weatherYesterLow: 0
      },
      daterange1month: daterange1month(),
      daterange6month: daterange6month(),
      showGuangxian: false, // 管线图/地图
      salesType: 'wholesales', // 批发业务/零售业务
      wholesalesStat: [], // 批发业务销售统计
      resalesStat: [], // 零售业务销售统计
      priceType: 'gate', // 门站/零售
      gatePrice: [], // 管道天然气门站价格
      retailprice: [] // 管道天然气零售价格
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 卡片数据
    this.getCards()
    // 批发业务销售统计
    this.getWholesalesStat()
    // 零售业务销售统计
    this.getResalesStat()
    // 得到批发卡片数据
    this.getWholesalesCards()

    // 管道天然气门站价格
    this.getGatePrice()

    // 管道天然气零售价格
    this.getRetailPrice('河北-石家庄')
  },
  methods: {
    // 得到卡片数据
    async getCards() {
      const res = await getCards()
      if (res.status === 0) {
        this.cards.wholeSale = Math.round(res.data[0].quantity)
        this.cards.wholeSaleTongBi = Math.round(res.data[0].tongBi)
        this.cards.wholeSaleHuanBi = Math.round(res.data[0].huanBi)
        this.cards.wholeSaleDate = res.data[0].dataDate
        this.cards.retail = Math.round(res.data[1].quantity)
        this.cards.retailDate = res.data[1].dataDate
      }
    },
    // 批发业务销售统计
    async getWholesalesStat() {
      const res = await getWholesalesStat({
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1])
      })
      if (res.status === 0) {
        this.wholesalesStat = getSalesChartSource(res.data, this.daterange1month)
      }
      console.log(this.wholesalesStat)
    },
    // 零售业务销售统计
    async getResalesStat() {
      const res = await getResalesStat({
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1])
      })
      if (res.status === 0) {
        this.resalesStat = getSalesChartSource(res.data, this.daterange1month)
      }
    },
    // 得到批发卡片数据
    async getWholesalesCards() {
      // 得到今日的批发量和零售量
      const res = await getWholesalesCards()
      if (res.status === 0) {
        this.cards.guandaoqi = Math.round(res.data[1].quantity)
        this.cards.lng = Math.round(res.data[2].quantity)
      }
    },

    // 管道天然气门站价格
    async getGatePrice() {
      const res = await getGatePrice({
        start: parseDate(this.daterange6month[0]),
        end: parseDate(this.daterange6month[1]),
        pageNum: 1,
        pageSize: 10000
      })
      if (res.status === 0) {
        this.gatePrice = getPriceSource(res.data, this.daterange6month, 'priceItemName')
      }
    },
    // 管道天然气零售价格
    async getRetailPrice(location) {
      const res = await getRetailPrice({
        location,
        start: parseDate(this.daterange6month[0]),
        end: parseDate(this.daterange6month[1]),
        pageNum: 1,
        pageSize: 10000
      })
      if (res.status === 0) {
        this.retailprice = getPriceSource(res.data, this.daterange6month, 'threeColumn')
        const obj = {
          工商业: '工业用(河北-石家庄)',
          民用: '民用(河北-石家庄)'
        }
        this.retailprice[0].forEach((item, index) => {
          if (obj[item]) this.retailprice[0][index] = obj[item]
        })
      }
    },
    handleMapClick(params) {
      this.showGuangxian = true
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

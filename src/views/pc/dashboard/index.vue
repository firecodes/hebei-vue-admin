<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <panel-group :cards="cards" />

        <div class="chart-wrapper">
          <h4>批发业务销售统计</h4>
          <sales-chart :chart-data="wholesalesStat" />
        </div>
        <div class="chart-wrapper">
          <h4>零售业务销售统计</h4>
          <sales-chart :chart-data="resalesStat" :color="['#5d62b5', '#29c3be']" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-wrapper">
          <h4>销售占比</h4>
          <proportion-chart :chart-data="cards" :height="'260px'" />
        </div>
        <div class="chart-wrapper">
          <h4>管道天然气门站价格</h4>
          <price-chart :chart-data="gatePrice" :height="'260px'" />
        </div>
        <div class="chart-wrapper">
          <h4>管道天然气零售价格</h4>
          <price-chart :chart-data="retailprice" :height="'260px'" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PriceChart from '@/components/Charts/PriceChart'
import SalesChart from '@/components/Charts/SalesChart'
import ProportionChart from '@/components/Charts/ProportionChart'

import { daterange1month, parseDate, getSalesChartSource } from '@/utils'
import { getCards, getWholesalesStat, getResalesStat } from '@/api/screen'
import { getCards as getWholesalesCards } from '@/api/screen/wholesales'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    SalesChart,
    ProportionChart,
    PriceChart
  },
  data() {
    return {
      cards: {
        wholeSale: 0,
        wholeSaleDate: '',
        retail: 0,
        retailDate: '',
        temperatureToday: 0,
        guandaoqi: 0,
        lng: 0
      },
      daterange1month: daterange1month(),
      wholesalesStat: [],
      resalesStat: [],
      gatePrice: [
        ['时间', '河北', '北京', '天津'],
        ['08-23', 1.82, 1.84, 1.86],
        ['08-24', 1.82, 1.84, 1.86],
        ['08-25', 1.82, 1.84, 1.86],
        ['08-26', 1.82, 1.84, 1.86],
        ['08-27', 1.82, 1.84, 1.86],
        ['08-28', 1.82, 1.84, 1.86],
        ['08-29', 1.82, 1.84, 1.86],
        ['08-30', 1.82, 1.84, 1.86],
        ['08-31', 1.82, 1.84, 1.86],
        ['09-01', 1.82, 1.84, 1.86],
        ['09-02', 1.82, 1.84, 1.86],
        ['09-03', 1.82, 1.84, 1.86],
        ['09-04', 1.82, 1.84, 1.86],
        ['09-05', 1.82, 1.84, 1.86],
        ['09-06', 1.82, 1.84, 1.86],
        ['09-07', 1.82, 1.84, 1.86],
        ['09-08', 1.82, 1.84, 1.86],
        ['09-09', 1.82, 1.84, 1.86],
        ['09-10', 1.82, 1.84, 1.86],
        ['09-11', 1.82, 1.84, 1.86],
        ['09-12', 1.82, 1.84, 1.86],
        ['09-13', 1.82, 1.84, 1.86],
        ['09-14', 1.82, 1.84, 1.86],
        ['09-15', 1.82, 1.84, 1.86],
        ['09-16', 1.82, 1.84, 1.86],
        ['09-17', 1.82, 1.84, 1.86],
        ['09-18', 1.82, 1.84, 1.86],
        ['09-19', 1.82, 1.84, 1.86],
        ['09-20', 1.82, 1.84, 1.86],
        ['09-21', 1.82, 1.84, 1.86],
        ['09-22', 1.82, 1.84, 1.86]
      ], // 管道天然气门站价格
      retailprice: [
        ['时间', '民用', '工业用'],
        ['08-23', 2.68, 3.18],
        ['08-24', 2.68, 3.18],
        ['08-25', 2.68, 3.18],
        ['08-26', 2.68, 3.18],
        ['08-27', 2.68, 3.18],
        ['08-28', 2.68, 3.18],
        ['08-29', 2.68, 3.18],
        ['08-30', 2.68, 3.18],
        ['08-31', 2.68, 3.18],
        ['09-01', 2.68, 3.18],
        ['09-02', 2.68, 3.18],
        ['09-03', 2.68, 3.18],
        ['09-04', 2.68, 3.18],
        ['09-05', 2.68, 3.18],
        ['09-06', 2.68, 3.18],
        ['09-07', 2.68, 3.18],
        ['09-08', 2.68, 3.18],
        ['09-09', 2.68, 3.18],
        ['09-10', 2.68, 3.18],
        ['09-11', 2.68, 3.18],
        ['09-12', 2.68, 3.18],
        ['09-13', 2.68, 3.18],
        ['09-14', 2.68, 3.18],
        ['09-15', 2.68, 3.18],
        ['09-16', 2.68, 3.18],
        ['09-17', 2.68, 3.18],
        ['09-18', 2.68, 3.18],
        ['09-19', 2.68, 3.18],
        ['09-20', 2.68, 3.18],
        ['09-21', 2.68, 3.18],
        ['09-22', 2.68, 3.18]
      ] // 管道天然气零售价格
    }
  },
  mounted() {
    this.getCards()
    this.getWholesalesStat()
    this.getResalesStat()
    this.getWholesalesCards()
  },
  methods: {
    // 得到卡片数据
    async getCards() {
      const res = await getCards()
      if (res.status === 0) {
        this.cards.wholeSale = Math.round(res.data[0].quantity)
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
    }
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

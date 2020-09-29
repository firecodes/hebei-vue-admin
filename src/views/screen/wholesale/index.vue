<template>
  <div class="container screen">
    <!-- 左边 -->
    <div class="container-left chart-wrapper map-wrapper">
      <!-- 3个card -->
      <panel-group :cards="cards" />
      <div class="map">
        <!-- 显示地图 -->
        <hebei-map :chart-data="mapData" :height="'820px'" />
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
      <!-- 计划完成率 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>计划完成率</h4>
          <div class="op">单位：万方</div>
        </div>
        <div class="chart-container">
          <div class="w-33">
            <plan-chart :height="'130px'" :chart-data="planCompletePercent[0].completePercent" :color="'#ffd52b'" />
            <p><strong>销售量(含LNG)</strong></p>
            <p>计划日均：<span class="num" v-text="planCompletePercent[0].planQuantity" /></p>
            <p>日均计划超欠：<span class="num" v-text="planCompletePercent[0].diffQuantity" /></p>
          </div>
          <div class="w-33">
            <plan-chart :height="'130px'" :chart-data="planCompletePercent[1].completePercent" :color="'#00ffff'" />
            <p><strong>管道气</strong></p>
            <p>计划日均：<span class="num" v-text="planCompletePercent[1].planQuantity" /></p>
            <p>日均计划超欠：<span class="num" v-text="planCompletePercent[1].diffQuantity" /></p>
          </div>

          <div class="w-33">
            <plan-chart :height="'130px'" :chart-data="planCompletePercent[2].completePercent" :color="'#ff6a00'" />
            <p><strong>冀东LNG</strong></p>
            <p>日均计划超欠：<span class="num" v-text="planCompletePercent[2].planQuantity" /></p>
            <p>日均计划超欠：<span class="num" v-text="planCompletePercent[2].diffQuantity" /></p>
          </div>
        </div>
        <!-- <sales-chart :chart-data="changshuStat" :height="'260px'" :main-color="'#fff'" :color="['#d9b03c', '#29c2bf']" /> -->
      </div>
      <!-- 地区销售排名 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>地区销售排名</h4>
          <div class="op">单位：万方</div>
        </div>
        <table>
          <tr v-for="(item, i) in areaSorted" :key="i">
            <template v-if="i < 6">
              <td class="index" v-text="i + 1" />
              <td class="name" v-text="item.name" />
              <td v-cloak class="num">{{ Math.round(item.quantity) }}</td>
              <td v-if="i < 5" class="index" v-text="i + 1 + 6" />
              <td v-if="i < 5" class="name" v-text="areaSorted[i + 6].name" />
              <td v-cloak v-if="i < 5" class="num">{{ Math.round(areaSorted[i + 6].quantity) }}</td>
            </template>
          </tr>
        </table>
      </div>
      <!-- 管道气销售 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>管道气销售</h4>
          <div class="op">
            <span :class="{ active: guandaoqiType === 'changshu' }" @click="guandaoqiType = 'changshu'">长输气</span> |
            <span :class="{ active: guandaoqiType === 'zichan' }" @click="guandaoqiType = 'zichan'">自产气</span>
          </div>
        </div>
        <sales-chart :chart-data="guandaoqiType === 'changshu' ? changshuStat : zichanStat" :height="'260px'" :main-color="'#fff'" :color="['#d9b03c', '#29c2bf']" />
      </div>
      <!-- 销售占比 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>销售占比</h4>
        </div>
        <div class="chart-container">
          <pie-chart :chart-data="wholesalePortion" :height="'260px'" :width="'50%'" title="批发业务销售占比" :showlabel="true" label-position="inside" />
          <pie-chart :chart-data="areaSortedPortion" :height="'260px'" :width="'50%'" title="地区销售占比" label-position="center" />
        </div>
      </div>
      <!-- 销售统计 -->
      <div class="chart-wrapper w-100">
        <div class="chart-wrapper-title">
          <h4>销售统计</h4>
          <div class="op">
            <span :class="{ active: salesType === 'guandaoqi' }" @click="salesType = 'guandaoqi'">管道气</span> |
            <span :class="{ active: salesType === 'lng' }" @click="salesType = 'lng'">冀东LNG</span>
          </div>
        </div>
        <sales-chart :chart-data="salesType === 'guandaoqi' ? guandaoStat : lngStat" :height="'260px'" :main-color="'#fff'" :color="['#d9b03c', '#29c2bf']" />
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import SalesChart from '@/components/Charts/SalesChart'
import PieChart from '@/components/Charts/PieChart'
import PlanChart from '@/components/Charts/PlanChart'
import HebeiMap from './components/HebeiMap'

import { daterange1month, parseDate, getSalesChartSource } from '@/utils'
import { getWholesalesStat, getResalesStat } from '@/api/screen'
import { getCards, getPlanCompletePercent, getSalesAreaSorted, getSalesPipelineGas, getSalesStat } from '@/api/screen/wholesales'
import { planCompletePercent } from '@/api/screen/retail'

export default {
  name: 'Wholesale',
  components: {
    PanelGroup,
    SalesChart,
    PieChart,
    PlanChart,
    HebeiMap
  },
  props: {},
  data() {
    return {
      // 卡片的几个数据
      cards: {
        wholeSale: 0,
        wholeSaleTongBi: 0,
        wholeSaleHuanbBi: 0,
        wholeSaleDate: '',
        guandaoqi: 0,
        guandaoqiTongBi: 0,
        guandaoqiHuanbBi: 0,
        guandaoqiDate: '',
        lng: 0,
        lngTongBi: 0,
        lngHuanbBi: 0,
        lngDate: ''
      },
      // 地区销售排名
      areaSorted: [],
      daterange1month: daterange1month(),
      guandaoqiType: 'changshu',
      changshuStat: [],
      zichanStat: [],
      salesType: 'guandaoqi',
      guandaoStat: [],
      lngStat: [],
      // 计划
      planCompletePercent: [
        {
          index: 1,
          name: '销售量(含LNG)',
          planQuantity: 0,
          diffQuantity: 0,
          completePercent: 0
        },
        {
          index: 2,
          name: '管道气',
          planQuantity: 0,
          diffQuantity: 0,
          completePercent: 0
        },
        {
          index: 3,
          name: '冀东LNG',
          planQuantity: 0,
          diffQuantity: 0,
          completePercent: 0
        }
      ],
      areaLocation: {
        石家庄地区: { lng: 114.48, lat: 38.03 },
        邯郸地区: { lng: 114.47, lat: 36.62 },
        邢台地区: { lng: 114.48, lat: 37.05 },
        雄安地区: { lng: 116.113523, lat: 38.99955 },
        衡水地区: { lng: 115.72, lat: 37.72 },
        保定地区: { lng: 115.48, lat: 38.85 },
        廊坊地区: { lng: 116.7, lat: 39.53 },
        沧州地区: { lng: 116.83, lat: 38.33 },
        张家口地区: { lng: 114.87, lat: 40.82 },
        秦皇岛地区: { lng: 119.57, lat: 39.95 },
        唐山地区: { lng: 118.02, lat: 39.63 }
      }
    }
  },
  computed: {
    wholesalePortion() {
      return [
        { name: '管道气', value: this.cards.guandaoqi },
        { name: '冀东LNG', value: this.cards.lng }
      ]
    },
    areaSortedPortion() {
      const arr = []
      this.areaSorted.forEach(item => {
        arr.push({ name: item.name, value: item.quantity })
      })
      return arr
    },
    mapData() {
      const arr = []
      this.areaSorted.forEach(item => {
        arr.push({ name: item.name, value: [this.areaLocation[item.name].lng, this.areaLocation[item.name].lat, item.quantity] })
      })
      return arr
    }
  },
  watch: {},
  created() {},
  mounted() {
    // 得到卡片数据
    this.getCards()
    // 计划完成率
    this.getPlanCompletePercent()
    // 地区销售排名
    this.getSalesAreaSorted()
    // 管道气销售
    this.getSalesPipelineGas(1) // 长输气
    this.getSalesPipelineGas(2) // 子站器

    // 销售统计
    this.getSalesStat(1) // 管道气
    this.getSalesStat(21) // lng
  },
  methods: {
    // 得到卡片数据
    async getCards() {
      const res = await getCards()
      if (res.status === 0) {
        // 批发
        this.cards.wholeSale = Math.round(res.data[0].quantity)
        this.cards.wholeSaleTongBi = Math.round(res.data[0].tongBi)
        this.cards.wholeSaleHuanBi = Math.round(res.data[0].huanBi)
        this.cards.wholeSaleDate = res.data[0].dataDate
        // 批发-管道气
        this.cards.guandaoqi = Math.round(res.data[1].quantity)
        this.cards.guandaoqiTongBi = Math.round(res.data[1].tongBi)
        this.cards.guandaoqiHuanBi = Math.round(res.data[1].huanBi)
        this.cards.guandaoqiDate = res.data[1].dataDate
        // 批发-lng
        this.cards.lng = Math.round(res.data[2].quantity)
        this.cards.lngTongBi = Math.round(res.data[2].tongBi)
        this.cards.lngHuanBi = Math.round(res.data[2].huanBi)
        this.cards.lngDate = res.data[2].dataDate
      }
    },
    // 地区销售排名
    async getSalesAreaSorted() {
      const res = await getSalesAreaSorted()
      if (res.status === 0) {
        this.areaSorted = res.data
      }
    },

    // 管道气销售
    async getSalesPipelineGas(type) {
      const res = await getSalesPipelineGas({
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1]),
        timeType: 1,
        type
      })
      if (res.status === 0) {
        if (type === 1) {
          this.changshuStat = getSalesChartSource(res.data, this.daterange1month)
        } else {
          this.zichanStat = getSalesChartSource(res.data, this.daterange1month)
        }
      }
    },

    // 销售统计
    async getSalesStat(gasType) {
      const res = await getSalesStat({
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1]),
        timeType: 1,
        gasType
      })
      if (res.status === 0) {
        if (gasType === 1) {
          this.guandaoStat = getSalesChartSource(res.data, this.daterange1month)
        } else {
          this.lngStat = getSalesChartSource(res.data, this.daterange1month)
        }
      }
    },
    // 计划完成率
    async getPlanCompletePercent() {
      const res = await getPlanCompletePercent()
      if (res.status == 0) {
        this.planCompletePercent = res.data
        this.planCompletePercent.forEach(item => {
          for (const key in item) {
            if (!isNaN(item[key])) {
              item[key] = parseInt(item[key])
            }
          }
        })
      }
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
  width: 780px;
  padding: 22px 44px;
  .map {
    height: 800px;
  }
}
.container-right {
  width: 1095px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.chart-container {
  display: flex;
  p {
    text-align: center;
  }
}
</style>

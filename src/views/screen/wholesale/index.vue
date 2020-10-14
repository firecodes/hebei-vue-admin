<template>
  <div class="container screen">
    <!-- 左边 -->
    <div class="container-left chart-wrapper map-wrapper">
      <!-- 3个card -->
      <panel-group :cards="cards" />
      <div class="map">
        <!-- 显示地图 -->
        <hebei-map :chart-data="mapData" :tooltip-fn="mapTooltip" :hover-fn="handleHover" :click-fn="handleClick" height="840px"  />
      </div>

      <!-- 四个角的三角形 -->
      <div class="angel">
        <img class="img1" src="~@/assets/img/screen/angle.png" alt>
        <img class="img2" src="~@/assets/img/screen/angle.png" alt>
        <img class="img3" src="~@/assets/img/screen/angle.png" alt>
        <img class="img4" src="~@/assets/img/screen/angle.png" alt>
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
        <!-- <sales-chart :chart-data="changshuStat" :color="['#d9b03c', '#29c2bf']" /> -->
      </div>
      <!-- 地区销售排名 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>地区销售排名</h4>
          <div class="op">单位：万方</div>
        </div>
        <table>
          <template v-for="(item, i) in areaSorted">
            <tr v-if="i < 6" :key="i">
              <td class="index" v-text="i + 1" />
              <td class="name" v-text="item.name" />
              <td v-cloak class="num">{{ Math.round(item.quantity) }}</td>
              <td v-if="i < 5" class="index" v-text="i + 1 + 6" />
              <td v-if="i < 5" class="name" v-text="areaSorted[i + 6].name" />
              <td v-cloak v-if="i < 5" class="num">{{ Math.round(areaSorted[i + 6].quantity) }}</td>
            </tr>
          </template>
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
        <sales-chart :chart-data="guandaoqiType === 'changshu' ? changshuStat : zichanStat" :color="['#d9b03c', '#29c2bf']" />
      </div>
      <!-- 销售占比 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>销售占比</h4>
        </div>
        <div class="chart-container">
          <pie-chart :chart-data="wholesalePortion" width="50%" title="批发业务销售占比" :show-label="true" label-position="inside" />
          <pie-chart :chart-data="areaSortedPortion" width="50%" title="地区销售占比" label-position="center" />
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
        <sales-chart :chart-data="salesType === 'guandaoqi' ? guandaoStat : lngStat" :height="'291px'" :color="['#d9b03c', '#29c2bf']" />
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import SalesChart from '@/components/Charts/SalesChart'
import PieChart from '@/components/Charts/PieChart'
import PlanChart from '@/components/Charts/PlanChart'
import HebeiMap from '@/components/Charts/HebeiMap'

import { daterange1month, parseDate, getSalesChartSource } from '@/utils'
import { areaOption } from '@/utils/options'
import { getCards, getPlanCompletePercent, getSalesAreaSorted, getSalesPipelineGas, getSalesStat, getSalesAreaDetail } from '@/api/screen/wholesales'

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
      areaOption,
      mapData: []
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
    }
  },
  watch: {
    areaSorted: {
      handler: function (val) {
        const arr = []

        val.forEach(item => {
          const obj = this.areaOption.find(temp => temp.label === item.name)

          const symbolSize = Math.round(item.quantity) / 50
          arr.push({
            name: item.name,
            value: [obj.lng, obj.lat, symbolSize > 10 ? symbolSize : 10],
            code: item.code,
            quantity: Math.round(item.quantity),
            huanBi: item.tongBi || 0,
            tongBi: item.huanBi || 0,
            dataDate: item.dataDate || ''
          })
        })
        this.mapData = arr
      },
      deep: true
    }
  },
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
      if (res.status === 0) {
        this.planCompletePercent = res.data
        this.planCompletePercent.forEach(item => {
          for (const key in item) {
            if (!isNaN(item[key])) {
              item[key] = parseInt(item[key])
            }
          }
        })
      }
    },
    // 地图tooltip
    mapTooltip(params) {
      return `${params.name}(${params.data.dataDate})<br/>
            日销量：<span class="num">${params.data.quantity}</span>(万方)；<br/>
            环比：<span class="num">${params.data.huanBi}</span>(万方)；<br/>
            同比：<span class="num">${params.data.tongBi}</span>(万方)；`
    },
    // 地图hover
    async handleHover(params) {
      if (params.componentType === 'series') {
        const code = params.data.code
        const item = this.areaSorted.find(item => item.code === code)
        console.log(item)

        const res = await getSalesAreaDetail({ code: code })
        if (res.status === 0) {
          this.$set(item, 'tongBi', Math.round(res.data.daySales.tongBi))
          this.$set(item, 'huanBi', Math.round(res.data.daySales.huanBi))
          this.$set(item, 'dataDate', res.data.dataDate)
        }
      }
    },
    // 地图点击
    handleClick(params) {
      if (params.componentType === 'series') {
        this.$router.push({ path: `/screen/wholesale/${params.name}/${params.data.code}` })
        //  location.href = '../../html/bigscreen/wholesale_detail.html?area=' + params.name + '&code=' + params.data.index
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

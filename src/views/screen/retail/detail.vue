<template>
  <div class="container screen">
    <!-- 左边 -->
    <div class="container-left chart-wrapper map-wrapper">
      <div class="map">
        <div class="mapOp">
          <div class="mapOp-btn">
            <span class="skipBtn" @click="$router.go(-1)">返回河北省视图</span>
          </div>
          <!-- 显示地图 -->
          <hebei-map :chart-data="mapData" :center="center" :tooltip-fn="mapTooltip" :hover-fn="handleHover" :click-fn="handleClick" height="900px" />
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
      <!-- 计划完成率 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>计划完成率(<span v-text="company" />)</h4>
        </div>
        <div class="chart-container">
          <div class="w-49">
            <plan-chart :height="'130px'" :chart-data="planCompletePercent[0].completePercent" :color="'#ffd52b'" />
            <p>月度计划：<span class="num" v-text="planCompletePercent[0].planQuantity" /></p>
            <p>累计完成：<span class="num" v-text="planCompletePercent[0].accumulateQuantity" /></p>
            <p>完成率：<span class="num" v-text="planCompletePercent[0].completePercent + '%'" /></p>
          </div>
          <div class="w-49">
            <plan-chart :height="'130px'" :chart-data="planCompletePercent[1].completePercent" :color="'#ff6a00'" />
            <p>年度计划：<span class="num" v-text="planCompletePercent[1].planQuantity" /></p>
            <p>累计完成：<span class="num" v-text="planCompletePercent[1].accumulateQuantity" /></p>
            <p>完成率：<span class="num" v-text="planCompletePercent[1].completePercent + '%'" /></p>
          </div>
        </div>
      </div>
      <!-- 购销气类型占比 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>购销气类型占比(<span v-text="company" />)</h4>
          <div class="op">
            <span :class="{ active: portionType == 'sale' }" @click="portionType = 'sale'">销气</span> |
            <span :class="{ active: portionType == 'buy' }" @click="portionType = 'buy'">购气</span>
          </div>
        </div>
        <pie-chart :chart-data="portionType == 'sale' ? salesPortion : buyPortion" :height="'240px'" :show-label="true" :show-legend="true" />
      </div>
      <!-- 总销气量统计 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>总销气量统计(<span v-text="company" />)</h4>
        </div>
        <basic-chart :chart-data="salesStat" />
      </div>
      <!-- 总购气量统计 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>总购气量统计(<span v-text="company" />)</h4>
        </div>
        <div class="chart-container">
          <basic-chart :chart-data="purchaseStats" />
        </div>
      </div>
      <!-- 计划量与实际购气量对比 -->
      <div class="chart-wrapper w-100">
        <div class="chart-wrapper-title">
          <h4>计划量与实际购气量对比(<span v-text="company" />)</h4>
        </div>
        <basic-chart :chart-data="planAndRealGasCompare" type="bar" :height="'307px'" :color="['#28c3bb', '#fec632', '#5d62b3']" :rotate="25" />
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from '@/components/Charts/PieChart'
import BasicChart from '@/components/Charts/BasicChart'
import PlanChart from '@/components/Charts/PlanChart'
import HebeiMap from '@/components/Charts/HebeiMap'

import { daterange1month, parseDate, getSalesChartSource } from '@/utils'
import { areaOption } from '@/utils/options'
import { getPlanCompletePercentCustomer, getSaleStatsCustomer, getSalesCustomerItems, getPurchaseStatsCustomer, getPlanAndRealGasCompareCustomer, getPurchaseGasPercentCustomer, getCustomers, getCustomerDetail } from '@/api/screen/retail'

export default {
  name: 'RetailDetail',
  components: {
    PieChart,
    BasicChart,
    PlanChart,
    HebeiMap
  },
  props: {},
  data() {
    return {
      company: this.$route.params.name, // 地区名字
      code: this.$route.params.code, // 地区编号
      // 计划
      planCompletePercent: [
        {
          index: 1,
          name: '',
          planQuantity: 0,
          accumulateQuantity: 0,
          completePercent: 0
        },
        {
          index: 2,
          name: '',
          planQuantity: 0,
          accumulateQuantity: 0,
          completePercent: 0
        }
      ],
      portionType: 'sale',
      salesPortion: [],
      buyPortion: [],
      daterange1month: daterange1month(),
      // 销售统计
      salesStat: [],
      // 总购气量统计
      purchaseStats: [],
      // 三级单位-计划量与实际购气量对比
      planAndRealGasCompare: [],
      areaOption,
      mapData: [],
      center: [], // 地图中心点
      retailCustomers: []
    }
  },
  computed: {},
  watch: {
    retailCustomers: {
      handler: function (val) {
        const arr = []

        val.forEach(item => {
          const symbolSize = item.quantity / 8
          arr.push({
            name: item.name,
            code: item.id,
            value: [item.lon, item.lat, symbolSize > 10 ? symbolSize : 10],
            day: Math.round(item.quantity || 0),
            month: Math.round(item.month || 0),
            monthComplete: Math.round(item.monthComplete || 0),
            year: Math.round(item.year || 0),
            yearComplete: Math.round(item.yearComplete || 0),
            dataDate: item.dataDate || ''
          })

          if (this.company === item.name) {
            this.center = [item.lon, item.lat]
          }
        })
        this.mapData = arr
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    // 得到零售客户列表
    this.getRetailCustomers()
    // 计划完成率
    this.getPlanCompletePercent()

    // 三级单位-购销气类型占比
    this.getPurchaseGasPercent()

    // 三级单位-总销气量统计
    this.getSaleStatsCustomer()
    // 三级单位-总购气量统计
    this.getPurchaseStatsCustomer()

    // 三级单位-计划量与实际购气量对比
    this.getPlanAndRealGasCompareCustomer()
  },
  methods: {
    // 计划完成率
    async getPlanCompletePercent() {
      const res = await getPlanCompletePercentCustomer(this.code)
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
    // 三级单位-购销气类型占比
    async getPurchaseGasPercent() {
      const res = await getPurchaseGasPercentCustomer(this.code)
      if (res.status === 0) {
        this.buyPortion = [
          { name: '管道气', value: res.data[0].quantity },
          { name: 'LNG（内购）', value: res.data[1].quantity },
          { name: 'LNG（外购）', value: res.data[2].quantity },
          { name: '管输气', value: res.data[3].quantity },
          { name: 'CNG', value: res.data[4].quantity }
        ]
      }
    },
    // 三级单位-总销气量统计
    async getSaleStatsCustomer() {
      const res = await getSaleStatsCustomer(this.code, {
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1]),
        timeType: 1
      })
      if (res.status === 0) {
        this.salesStat = getSalesChartSource(res.data, this.daterange1month, ['时间', '总销气量'], true)
      }
    },
    // 三级单位-总购气量统计
    async getPurchaseStatsCustomer() {
      const res = await getPurchaseStatsCustomer(this.code, {
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1]),
        timeType: 1
      })
      if (res.status === 0) {
        this.purchaseStats = getSalesChartSource(res.data, this.daterange1month, ['时间', '总销气量'], true)
      }
    },
    // 三级单位-计划量与实际购气量对比
    async getPlanAndRealGasCompareCustomer() {
      const res = await getPlanAndRealGasCompareCustomer(this.code, {
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1])
      })
      if (res.status === 0) {
        this.planAndRealGasCompare.push(['日期', '计划量', '实际购气量'])
        res.data.forEach(item => {
          this.planAndRealGasCompare.push([item.name.split('-').slice(1).join('-'), Math.round(item.planValue), Math.round(item.purchaseValue)])
        })
      }
    },

    // 得到零售客户列表
    async getRetailCustomers() {
      const res = await getCustomers()
      if (res.status === 0) {
        this.retailCustomers = res.data
      }
    },

    // 地图tooltip
    mapTooltip(params) {
      return `${params.name}(${params.data.dataDate})<br/>日销量：<span class="num">${params.data.day}</span>(万方)；<br/>
              月销量：<span class="num">${params.data.month}</span>(万方)；
              月完成率：<span class="num">${params.data.monthComplete}</span>(%)；<br/>
              年销量：<span class="num">${params.data.year}</span>(万方)；
              年完成率：<span class="num">${params.data.yearComplete}</span>(%)；`
    },
    // 地图hover
    async handleHover(params) {
      if (params.componentType === 'series') {
        const name = params.data.name
        const item = this.retailCustomers.find(item => item.name === name)

        const res = await getCustomerDetail(name)
        if (res.status === 0) {
          this.$set(item, 'quantity', res.data.daySales.quantity)
          this.$set(item, 'month', Math.round(res.data.monthSales.quantity))
          this.$set(item, 'monthComplete', Math.round(res.data.monthSales.completePercent))
          this.$set(item, 'year', res.data.yearSales.quantity)
          this.$set(item, 'yearComplete', res.data.yearSales.completePercent)
          this.$set(item, 'dataDate', res.data.dataDate)
        }
      }
    },
    // 地图点击
    handleClick(params) {
      if (params.componentType === 'series') {
        this.$router.push({ path: `/screen/retail/${params.name}/${params.data.code}` })
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
  flex-wrap: wrap;
  p {
    text-align: center;
  }
}

.container.screen .map-wrapper .mapOp .mapOp-btn .skipBtn {
  position: relative;
  top: -20px;
  right: -30px;
}
</style>

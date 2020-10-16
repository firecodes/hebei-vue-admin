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
          <hebei-city-map :chart-data="mapData" :city="area" :tooltip-fn="mapTooltip" :hover-fn="handleHover" height="900px" />
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
      <!-- 地区基本情况 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>地区基本情况(<span v-text="area" />)</h4>
        </div>
        <div class="chart-container">
          <ul class="weather w-100">
            <li v-for="(item, index) in weatherData" :key="item.date" :class="index === 0 ? 'active' : ''">
              <div>
                <strong>{{ item.ymd.split('-').slice(1).join('-') }}</strong
                ><br />
                <span v-text="item.week" /><br />
                <span v-text="item.type" /><br />
                <span v-text="item.fx" /><span v-text="item.fl" /><br />
              </div>
            </li>
          </ul>
          <weather-chart :chart-data="weatherChartData" />
        </div>
      </div>
      <!-- 客户销售TOP10 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>客户销售TOP10(<span v-text="area" />)</h4>
          <div class="op">单位：万方</div>
        </div>

        <table>
          <template v-for="(item, i) in customerSorted">
            <tr v-if="i < 5" :key="i">
              <td class="index" v-text="i + 1" />
              <td class="name" v-text="item.name" />
              <td v-cloak class="num">{{ Math.round(item.quantity) }}</td>
              <template v-if="i < 5 && customerSorted[i + 5]">
                <td class="index" v-text="i + 1 + 5" />
                <td class="name" v-text="customerSorted[i + 5].name" />
                <td v-cloak class="num">{{ Math.round(customerSorted[i + 5].quantity) }}</td>
              </template>
            </tr>
          </template>
        </table>
      </div>
      <!-- 销售统计 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>销售统计(<span v-text="area" />)</h4>
        </div>
        <sales-chart :chart-data="salesStat" :color="['#d9b03c', '#29c2bf']" />
      </div>
      <!-- 销售占比 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>销售占比(<span v-text="area" />)</h4>
        </div>
        <div class="chart-container">
          <pie-chart :chart-data="areaSortedPortion" width="50%" title="地区销售占比" :show-label="true" label-position="inside" />
          <pie-chart :chart-data="customerSortedPortion" width="50%" title="客户销售占比" label-position="center" series-name="客户销售量" />
        </div>
      </div>
      <!-- 日均合同/计划日均/今日量 -->
      <div class="chart-wrapper w-100">
        <div class="chart-wrapper-title">
          <h4>日均合同/计划日均/今日量(<span v-text="area" />)</h4>
        </div>
        <basic-chart :chart-data="salesCustomerItemsData" type="bar" :height="'307px'" :color="['#28c3bb', '#fec632', '#5d62b3']" :rotate="25" />
      </div>
    </div>
  </div>
</template>

<script>
import SalesChart from '@/components/Charts/SalesChart'
import PieChart from '@/components/Charts/PieChart'
import BasicChart from '@/components/Charts/BasicChart'
import HebeiCityMap from './components/HebeiCityMap'
import weatherChart from './components/weatherChart'

import { daterange1month, parseDate, getSalesChartSource } from '@/utils'
import { areaOption } from '@/utils/options'
import { getSalesAreaSorted, getSalesAreaCustomerSorted, getSalesArea, getSalesStat, getSalesCustomerItems, getSalesCustomer } from '@/api/screen/wholesales'
import { getWeather } from '@/api/screen/weather'
import { fetchList as getPipelineCustomer } from '@/api/customer/pipeline'

export default {
  name: 'WholesaleDetail',
  components: {
    SalesChart,
    PieChart,
    BasicChart,
    weatherChart,
    HebeiCityMap
  },
  props: {},
  data() {
    return {
      area: this.$route.params.name, // 地区名字
      code: this.$route.params.code, // 地区编号
      weatherData: [],
      // 天气数据的地区编号
      areaCode: {
        石家庄地区: 101090101,
        邯郸地区: 101091001,
        邢台地区: 101090901,
        雄安地区: 101090201,
        衡水地区: 101090801,
        保定地区: 101090201,
        廊坊地区: 101090601,
        沧州地区: 101090701,
        张家口地区: 101090301,
        秦皇岛地区: 101091101,
        唐山地区: 101090501
      },
      // 地区销售排名
      areaSorted: [],
      // 客户销售排名
      customerSorted: [],
      daterange1month: daterange1month(),
      // 日均合同/计划日均/今日量
      salesCustomerItems: [],
      // 销售统计
      salesStat: [],
      areaOption,
      mapData: [],
      pipelineCustomer: []
    }
  },
  computed: {
    // 地区销售占比
    areaSortedPortion() {
      let sum = 0
      let quantity = 0
      this.areaSorted.forEach(item => {
        if (item.name === this.area) {
          quantity = item.quantity
        } else {
          sum += parseFloat(item.quantity)
        }
      })
      console.log(quantity, sum)
      return [
        { name: this.area, value: quantity },
        { name: '其他地区', value: sum }
      ]
    },
    // 客户销售占比
    customerSortedPortion() {
      const arr = []
      this.customerSorted.forEach(item => {
        arr.push({ name: item.name, value: item.quantity })
      })
      return arr
    },
    weatherChartData() {
      const arr = [['日期', '高温', '低温']]
      const reg = /(\d)+/
      this.weatherData.forEach((item, index) => {
        arr.push(['day' + index, reg.exec(item.high)[0], reg.exec(item.low)[0]])
      })
      return arr
    },
    // 日均合同/计划日均/今日量
    salesCustomerItemsData() {
      const arr = [['公司', '日均合同', '计划日均', '今日量']]
      this.salesCustomerItems.forEach((item, index) => {
        arr.push([item.customer, item.contractMeanValue, item.planMeanValue, item.dailyValue])
      })
      return arr
    }
  },
  watch: {},
  created() {},
  mounted() {
    // 天气数据
    this.getWeather()
    // 地区销售排名
    this.getSalesAreaSorted()
    // 客户销售排名

    // 销售统计
    this.getSalesArea()
    // 日均合同/计划日均/今日量
    this.getSalesCustomerItems()

    // 得到地图数据
    Promise.all([this.getSalesAreaCustomerSorted(), this.getPipelineCustomer()]).then(() => {
      const obj = {}
      this.pipelineCustomer.forEach(customer => {
        obj[customer.name] = customer
      })

      this.customerSorted.forEach(customer => {
        const symbolSize = Math.round(customer.quantity) / 10
        const item = obj[customer.name]
        this.mapData.push({
          code: item.id,
          name: customer.name,
          value: [item.lon, item.lat, symbolSize > 10 ? symbolSize : 10],
          quantity: Math.round(customer.quantity),
          tongBi: 0,
          huanBi: 0,
          dataDate: ''
        })
      })
    })
  },
  methods: {
    // 天气数据
    async getWeather() {
      console.log(this.area, this.areaCode[this.area], this.areaCode)
      const res = await getWeather(this.areaCode[this.area])
      if (res.status === 200) {
        this.weatherData = res.data.forecast.slice(0, 7)
      }
    },
    // 根据地区得到管道气各户
    async getPipelineCustomer() {
      const res = await getPipelineCustomer({
        pageSize: 1000,
        code: this.code
      })
      if (res.status === 0) {
        this.pipelineCustomer = res.data
      }
    },
    // 客户销售排名
    async getSalesAreaCustomerSorted() {
      const res = await getSalesAreaCustomerSorted(this.code)
      if (res.status === 0) {
        this.customerSorted = res.data
      }
    },
    // 地区销售排名
    async getSalesAreaSorted() {
      const res = await getSalesAreaSorted()
      if (res.status === 0) {
        this.areaSorted = res.data
      }
    },

    // 销售统计
    async getSalesArea() {
      const res = await getSalesArea(this.code, {
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1]),
        timeType: 1
      })
      if (res.status === 0) {
        this.salesStat = getSalesChartSource(res.data, this.daterange1month)
      }
    },

    // 日均合同/计划日均/今日量
    async getSalesCustomerItems() {
      const res = await getSalesCustomerItems(this.code)
      if (res.status === 0) {
        this.salesCustomerItems = res.data
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
        const customer = this.mapData.find(item => item.code === code)

        const res = await getSalesCustomer(code)
        if (res.status === 0) {
          customer.tongBi = Math.round(res.data.daySales.tongBi)
          customer.huanBi = Math.round(res.data.daySales.huanBi)
          customer.dataDate = res.data.dataDate || ''
        }
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

  .weather {
    padding: 10px;
    height: 100px;
    list-style: none;
    line-height: 20px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    li {
      text-align: center;
      &.active {
        color: #07e5ff;
      }
    }
  }
}

.container.screen .map-wrapper .mapOp .mapOp-btn .skipBtn {
  position: relative;
  top: -20px;
  right: -30px;
}
</style>

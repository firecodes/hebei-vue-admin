<template>
  <div class="container screen">
    <!-- 左边 -->
    <div class="container-left chart-wrapper map-wrapper">
      <!-- 3个card -->
      <panel-group :cards="cards" />
      <div class="map">
        <!-- 显示地图 -->
        <hebei-map :chart-data="mapData" :tooltip-fn="mapTooltip" :symbol-size="1" height="820px" />
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
      <!-- 客户日销售top10 -->
      <div class="chart-wrapper mb-1 w-100">
        <div class="chart-wrapper-title">
          <h4>客户日销售top10</h4>
          <div class="op">单位：万方</div>
        </div>
        <div class="chart-container">
          <table class="text-center">
            <tr style="border-bottom: 2px solid rgb(57, 117, 184) !important; color: #fff">
              <th>排名</th>
              <th>客户名称</th>
              <th>销售量(万方)</th>
              <th>排名</th>
              <th>客户名称</th>
              <th>销售量(万方)</th>
            </tr>
            <tr v-for="(item, i) in customersTop" :key="i">
              <template v-if="i < 5">
                <td class="index" v-text="i + 1" />
                <td class="name" v-text="item.name" />
                <td v-cloak class="num">{{ Math.round(item.quantity) }}</td>
                <td v-if="i < 5" class="index" v-text="i + 1 + 6" />
                <td v-if="i < 5" class="name" v-text="customersTop[i + 5].name" />
                <td v-cloak v-if="i < 5" class="num">{{ Math.round(customersTop[i + 5].quantity) }}</td>
              </template>
            </tr>
          </table>
          <pie-chart :chart-data="customersTopPortion" height="240px" width="600px" :show-label="true" />
        </div>
      </div>
      <!-- 客户年销售top10 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>客户年销售top10</h4>
          <div class="op">单位：亿方</div>
        </div>

        <table class="mb-1">
          <tbody>
            <tr>
              <td class="index">1</td>
              <td class="name">河北燃气</td>
              <td class="num text-success">0.55</td>
              <td class="index">6</td>
              <td class="name">廊坊百川</td>
              <td class="num text-success">0.10</td>
            </tr>
            <tr>
              <td class="index">2</td>
              <td class="name">唐山华普</td>
              <td class="num text-success">0.17</td>
              <td class="index">7</td>
              <td class="name">华气秦皇岛华润保运</td>
              <td class="num text-success">0.09</td>
            </tr>
            <tr>
              <td class="index">3</td>
              <td class="name">唐山燃气</td>
              <td class="num text-success">0.15</td>
              <td class="index">8</td>
              <td class="name">新奥能源（河北LNG）</td>
              <td class="num text-success">0.08</td>
            </tr>
            <tr>
              <td class="index">4</td>
              <td class="name">河北昆利</td>
              <td class="num text-success">0.14</td>
              <td class="index">9</td>
              <td class="name">河北华气</td>
              <td class="num text-success">0.08</td>
            </tr>
            <tr style="border-bottom: none">
              <td class="index">5</td>
              <td class="name">河北华港</td>
              <td class="num text-success">0.10</td>
              <td class="index">10</td>
              <td class="name">文安华油</td>
              <td class="num text-success">0.07</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 合同量top10 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>合同量top10</h4>
          <div class="op">单位：万方</div>
        </div>
        <table class="mb-1 text-center">
          <tbody>
            <tr>
              <td class="index">1</td>
              <td class="name">河北燃气</td>
              <td class="num text-success">8680</td>
              <td class="index">6</td>
              <td class="name">廊坊百川</td>
              <td class="num text-success">1844</td>
            </tr>
            <tr>
              <td class="index">2</td>
              <td class="name">河北昆利</td>
              <td class="num text-success">4040</td>
              <td class="index">7</td>
              <td class="name">永清昆仑</td>
              <td class="num text-success">1600</td>
            </tr>
            <tr>
              <td class="index">3</td>
              <td class="name">霸州昆燃</td>
              <td class="num text-success">3639</td>
              <td class="index">8</td>
              <td class="name">廊坊新奥</td>
              <td class="num text-success">1595</td>
            </tr>
            <tr>
              <td class="index">4</td>
              <td class="name">唐山燃气</td>
              <td class="num text-success">3240</td>
              <td class="index">9</td>
              <td class="name">秦皇岛华润</td>
              <td class="num text-success">1400</td>
            </tr>
            <tr style="border-bottom: none">
              <td class="index">5</td>
              <td class="name">河北华港</td>
              <td class="num text-success">2029</td>
              <td class="index">10</td>
              <td class="name">河北华气</td>
              <td class="num text-success">1240</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 客户量统计 -->
      <div class="chart-wrapper w-100">
        <div class="chart-wrapper-title">
          <h4>客户量统计</h4>
        </div>
        <basic-chart :chart-data="customersStatsSource" :color="['#29c3be', '#5d62b5', '#fdc931']" :height="'286px'" />
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from '@/components/Charts/PieChart'
import BasicChart from '@/components/Charts/BasicChart'
import HebeiMap from '@/components/Charts/HebeiMap'

import { areaOption } from '@/utils/options'
import { getCustomersCard, getCustomersCount, getCustomersTop, getCustomersStats } from '@/api/screen/customer'

export default {
  name: 'Customer',
  components: {
    PanelGroup,
    PieChart,
    BasicChart,
    HebeiMap
  },
  props: {},
  data() {
    return {
      // 卡片的几个数据
      cards: {
        totalCount: 0,
        kunlunCount: 0,
        directSupplyCount: 0,
        quantity: 0,
        huanBi: 0,
        tongBi: 0,
        dataDate: ''
      },
      // customersDecrease: [],
      // customersIncrease: [],
      customersTop: [],
      // 客户量统计
      customersStats: [],
      // 地区销售排名
      areaSorted: [],
      areaOption
      // mapData: []
    }
  },
  computed: {
    customersTopPortion() {
      const arr = []
      this.customersTop.forEach(item => {
        arr.push({ name: item.name, value: Math.round(item.quantity) })
      })
      return arr
    },
    customersStatsSource() {
      const arr = [['地区', '总客户数', '昆仑系', '直供工业用户']]
      this.customersStats.forEach(item => {
        arr.push([item.name, item.totalCount, item.kunlunCount, item.directSupplyCount])
      })
      return arr
    },
    mapData() {
      const arr = []
      this.customersStats.forEach(item => {
        const obj = this.areaOption.find(temp => temp.label === item.name)

        arr.push({
          name: item.name,
          value: [obj.lng, obj.lat, item.totalCount > 10 ? item.totalCount : 10],
          totalCount: item.totalCount,
          kunlunCount: item.kunlunCount,
          directSupplyCount: item.directSupplyCount
        })
      })
      return arr
    }
  },
  watch: {
  },
  created() {},
  mounted() {
    // 得到卡片数据
    this.getCustomersCard()
    this.getCustomersCount()
    // 客户日销售top10
    this.getCustomersTop()
    // 客户量统计
    this.getCustomersStats()

    // 地区销售排名
    // this.getSalesAreaSorted()
  },
  methods: {
    // 得到卡片数据
    async getCustomersCard() {
      const res = await getCustomersCard()
      if (res.status === 0) {
        this.cards.quantity = Math.round(res.data.quantity)
        this.cards.huanBi = Math.round(res.data.tongBi)
        this.cards.tongBi = Math.round(res.data.huanBi)
        this.cards.dataDate = res.data.dataDate
      }
    },
    // 地区销售排名
    // async getSalesAreaSorted() {
    //   const res = await getSalesAreaSorted()
    //   if (res.status === 0) {
    //     this.areaSorted = res.data
    //   }
    // },
    // 得到客户情况卡片数据
    async getCustomersCount() {
      const res = await getCustomersCount()
      if (res.status === 0) {
        this.cards.totalCount = res.data.totalCount
        this.cards.kunlunCount = res.data.kunlunCount
        this.cards.directSupplyCount = res.data.directSupplyCount
      }
    },
    // 客户销售TOP10
    async getCustomersTop() {
      const res = await getCustomersTop()
      if (res.status === 0) {
        this.customersTop = res.data
      }
    },
    // 客户量统计
    async getCustomersStats() {
      const res = await getCustomersStats()
      if (res.status === 0) {
        this.customersStats = res.data
      }
    },
    // 地图tooltip
    mapTooltip(params) {
      console.log(params)
      return `${params.name}<br/>总客户数：<span class="num">${params.data.totalCount}</span>(户);<br/>
      昆仑系：<span class="num">${params.data.kunlunCount}</span>(户);<br/>
      直供工业用户：<span class="num">${params.data.directSupplyCount}</span>(户);`
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

.container.screen .chart-wrapper table td,
.container.screen .chart-wrapper table th {
  line-height: 40px;
}
</style>

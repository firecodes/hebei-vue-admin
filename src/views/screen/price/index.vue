<template>
  <div class="container screen">
    <!-- 左边 -->
    <div class="container-left chart-wrapper map-wrapper">
      <!-- 3个card -->
      <div class="map">
        <!-- 显示地图 -->
        <hebei-map :chart-data="mapData" :tooltip-fn="mapTooltip" :hover-fn="handleHover" height="840px" />
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
      <!-- 管道天然气门站价格 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>管道天然气门站价格</h4>
        </div>

        <basic-chart :chart-data="gatePrice" unit="元/立方米" />
      </div>
      <!-- 管道天然气零售价格 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>管道天然气零售价格</h4>
          <div class="op">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" :class="{ active: retailpriceLoc.startsWith('河北') }"> {{ retailpriceLoc.startsWith('河北') ? retailpriceLoc : '河北' }}<i class="el-icon-arrow-down el-icon--right" /> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in locationOption[0].children" :key="item.value" @click.native="retailpriceLoc = item.value">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            | <span :class="{ active: retailpriceLoc === '北京' }" @click="retailpriceLoc = '北京'">北京</span> |
            <span :class="{ active: retailpriceLoc === '天津' }" @click="retailpriceLoc = '天津'">天津</span>
          </div>
        </div>
        <basic-chart :chart-data="retailprice" unit="元/立方米" />
      </div>
      <!-- LNG 接收站销售价格 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>LNG 接收站销售价格</h4>
        </div>
        <basic-chart :chart-data="lngReceive" unit="元/立方米" />
      </div>
      <!-- LNG 工厂销售价格 -->
      <div class="chart-wrapper mb-1 w-49">
        <div class="chart-wrapper-title">
          <h4>LNG 工厂销售价格</h4>
        </div>
        <div class="chart-container">
          <basic-chart :chart-data="lngPlant" unit="元/吨" />
        </div>
      </div>
      <!-- LNG 加气站零售价格 -->
      <div class="chart-wrapper w-49">
        <div class="chart-wrapper-title">
          <h4>LNG 加气站零售价格</h4>
          <div class="op">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" :class="{ active: lngRetailLoc.startsWith('河北') }"> {{ lngRetailLoc.startsWith('河北') ? lngRetailLoc : '河北' }}<i class="el-icon-arrow-down el-icon--right" /> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in locationOptionSmall[0].children" :key="item.value" @click.native="lngRetailLoc = item.value">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            | <span :class="{ active: lngRetailLoc === '北京' }" @click="lngRetailLoc = '北京'">北京</span> |
            <span :class="{ active: lngRetailLoc === '天津' }" @click="lngRetailLoc = '天津'">天津</span>
          </div>
        </div>
        <basic-chart :chart-data="lngRetail" unit="元/公升" />
      </div>
      <!-- CNG 车用价格 -->
      <div class="chart-wrapper w-49">
        <div class="chart-wrapper-title">
          <h4>CNG 车用价格</h4>
          <div class="op">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" :class="{ active: cngPriceLoc.startsWith('河北') }"> {{ cngPriceLoc.startsWith('河北') ? cngPriceLoc : '河北' }}<i class="el-icon-arrow-down el-icon--right" /> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in locationOption[0].children" :key="item.value" @click.native="cngPriceLoc = item.value">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            | <span :class="{ active: cngPriceLoc === '北京' }" @click="cngPriceLoc = '北京'">北京</span> |
            <span :class="{ active: cngPriceLoc === '天津' }" @click="cngPriceLoc = '天津'">天津</span>
          </div>
        </div>
        <basic-chart :chart-data="cngPrice" unit="元/立方米" height="267px" />
      </div>
    </div>
  </div>
</template>

<script>
import BasicChart from '@/components/Charts/BasicChart'
import HebeiMap from '@/components/Charts/HebeiMap'

import { daterange6month, parseDate, getPriceSource } from '@/utils'
import { locationOption, locationOptionSmall } from '@/utils/options'
import { getAreaPrice, getGatePrice, getRetailPrice, getLngReceive, getLngPlant, getLngRetail, getCngPrice } from '@/api/screen/price'

export default {
  name: 'Price',
  components: {
    BasicChart,
    HebeiMap
  },
  props: {},
  data() {
    return {
      locationOption,
      locationOptionSmall,
      daterange6month: daterange6month(),
      gatePrice: [], // 管道天然气门站价格
      retailprice: [], // 管道天然气零售价格
      retailpriceLoc: '河北-石家庄',
      lngReceive: [],
      lngPlant: [
        ['时间', '华气霸州', '迁安翅冀', '任丘华港', '中翔', '怡蕙达'],
        ['08-23', 2650, 2850, 2480, 4567, 2134],
        ['08-24', 2650, 2850, 2480, 4567, 2134],
        ['08-25', 2650, 2850, 2480, 4567, 2134],
        ['08-26', 2650, 2850, 2480, 4567, 2134],
        ['08-27', 2650, 2850, 2480, 4567, 2134],
        ['08-28', 2650, 2850, 2480, 4567, 2134],
        ['08-29', 2650, 2850, 2480, 4567, 2134],
        ['08-30', 2650, 2850, 2480, 4567, 2134],
        ['08-31', 2650, 2850, 2480, 4567, 2134],
        ['09-01', 2650, 2850, 2480, 4567, 2134],
        ['09-02', 2650, 2850, 2480, 4567, 2134],
        ['09-03', 2650, 2850, 2480, 4567, 2134],
        ['09-04', 2650, 2850, 2480, 4567, 2134],
        ['09-05', 2650, 2850, 2480, 4567, 2134],
        ['09-06', 2650, 2850, 2480, 4567, 2134],
        ['09-07', 2650, 2850, 2480, 4567, 2134],
        ['09-08', 2650, 2850, 2480, 4567, 2134],
        ['09-09', 2650, 2850, 2480, 4567, 2134],
        ['09-10', 2650, 2850, 2480, 4567, 2134],
        ['09-11', 2650, 2850, 2480, 4567, 2134],
        ['09-12', 2650, 2850, 2480, 4567, 2134],
        ['09-13', 2650, 2850, 2480, 4567, 2134],
        ['09-14', 2650, 2850, 2480, 4567, 2134],
        ['09-15', 2650, 2850, 2480, 4567, 2134],
        ['09-16', 2650, 2850, 2480, 4567, 2134],
        ['09-17', 2650, 2850, 2480, 4567, 2134],
        ['09-18', 2650, 2850, 2480, 4567, 2134],
        ['09-19', 2650, 2850, 2480, 4567, 2134],
        ['09-20', 2650, 2850, 2480, 4567, 2134],
        ['09-21', 2650, 2850, 2480, 4567, 2134],
        ['09-22', 2650, 2850, 2480, 4567, 2134]
      ],
      lngRetail: [],
      lngRetailLoc: '河北-石家庄',
      cngPrice: [],
      cngPriceLoc: '河北-石家庄',
      areaOption: [
        { label: '石家庄地区', lng: 114.48, lat: 38.03, priceItemName: '河北-石家庄', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '邯郸地区', lng: 114.47, lat: 36.62, priceItemName: '河北-邯郸', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '邢台地区', lng: 114.48, lat: 37.05, priceItemName: '河北-邢台', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '承德地区', lng: 117.939152, lat: 40.976204, priceItemName: '河北-承德', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '衡水地区', lng: 115.72, lat: 37.72, priceItemName: '河北-衡水', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '保定地区', lng: 115.48, lat: 38.85, priceItemName: '河北-保定', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '廊坊地区', lng: 116.7, lat: 39.53, priceItemName: '河北-廊坊', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '沧州地区', lng: 116.83, lat: 38.33, priceItemName: '河北-沧州', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '张家口地区', lng: 114.87, lat: 40.82, priceItemName: '河北-张家口', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '秦皇岛地区', lng: 119.57, lat: 39.95, priceItemName: '河北-秦皇岛', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '唐山地区', lng: 118.02, lat: 39.63, priceItemName: '河北-唐山', type: 1, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '北京', lng: 116.4, lat: 39.9, priceItemName: '北京', type: 2, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '天津', lng: 117.2, lat: 39.12, priceItemName: '天津', type: 2, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 },
        { label: '河北', lng: 115.666491, lat: 39.423331, priceItemName: '河北', type: 3, retailPrice_minyong: 0, retailPrice_gongye: 0, gatePrice: 0 }
      ],
      mapData: []
    }
  },
  computed: {},
  watch: {
    retailpriceLoc(val) {
      this.getRetailPrice(val)
    },
    lngRetailLoc(val) {
      this.getLngRetail(val)
    },
    cngPriceLoc(val) {
      this.getCngPrice(val)
    },
    areaOption: {
      handler: function (val) {
        const symbolSize = 10
        const arr = []

        val.forEach(item => {
          arr.push({
            name: item.label,
            value: [item.lng, item.lat, symbolSize],
            priceItemName: item.priceItemName,
            type: item.type,
            retailPrice_minyong: item.retailPrice_minyong,
            retailPrice_gongye: item.retailPrice_gongye,
            gatePrice: item.gatePrice,
            dataDate: item.dataDate || ''
          })
        })

        this.mapData = arr
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {
    // 管道天然气门站价格
    this.getGatePrice()
    // 管道天然气零售价格
    this.getRetailPrice(this.retailpriceLoc)
    // LNG 接收站销售价格
    this.getLngReceive()
    // LNG 工厂销售价格
    // this.getLngPlant()
    // LNG 加气站零售价格
    this.getLngRetail(this.lngRetailLoc)
    // CNG 车用价格
    this.getCngPrice(this.cngPriceLoc)
  },
  methods: {
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
          工商业: '工业用'
        }
        this.retailprice[0].forEach((item, index) => {
          if (obj[item]) this.retailprice[0][index] = obj[item]
        })
      }
    },
    // LNG 接收站销售价格
    async getLngReceive() {
      const res = await getLngReceive({
        start: parseDate(this.daterange6month[0]),
        end: parseDate(this.daterange6month[1]),
        pageNum: 1,
        pageSize: 10000
      })
      if (res.status === 0) {
        this.lngReceive = getPriceSource(res.data, this.daterange6month, 'priceItemName')
        const obj = {
          中石油曹妃甸: '中石化唐山'
        }
        this.lngReceive[0].forEach((item, index) => {
          if (obj[item]) this.lngReceive[0][index] = obj[item]
        })
      }
    },
    // LNG 工厂销售价格--接口错误了
    async getLngPlant(location) {
      const res = await getLngPlant({
        offerDay: '2020-10-09',
        pageNum: 1,
        pageSize: 10000
      })
      if (res.status === 0) {
        this.lngPlant = res.data
      }
    },
    // LNG 加气站零售价格
    async getLngRetail(location) {
      const res = await getLngRetail({
        location,
        start: parseDate(this.daterange6month[0]),
        end: parseDate(this.daterange6month[1]),
        pageNum: 1,
        pageSize: 10000
      })
      if (res.status === 0) {
        this.lngRetail = getPriceSource(res.data, this.daterange6month, 'priceItemName')
      }
    },
    // CNG 车用价格
    async getCngPrice(location) {
      const res = await getCngPrice({
        location,
        start: parseDate(this.daterange6month[0]),
        end: parseDate(this.daterange6month[1]),
        pageNum: 1,
        pageSize: 10000
      })
      if (res.status === 0) {
        this.cngPrice = getPriceSource(res.data, this.daterange6month, 'priceItemName')
      }
    },
    // 地图tooltip
    mapTooltip(params) {
      console.log(params)
      const type = params.data.type
      if (type === 1) {
        return `${params.name}(${params.data.dataDate})<br/>
          管道天然气零售(民用)：<span class="num">${params.data.retailPrice_minyong}</span>(元/立方米)；<br/>
          管道天然气零售(工业用)：<span class="num">${params.data.retailPrice_gongye}</span>(元/立方米)；`
      } else if (type === 2) {
        return `${params.name}(${params.data.dataDate})<br/>
          管道天然气门站：<span class="num">${params.data.gatePrice}</span> (元/立方米)；<br/>
          管道天然气零售(民用)：<span class="num">${params.data.retailPrice_minyong}</span>(元/立方米)；<br/>
          管道天然气零售(工业用)：<span class="num">${params.data.retailPrice_gongye}</span>(元/立方米)；`
      } else if (type === 3) {
        return `${params.name}(${params.data.dataDate})<br/>
        管道天然气门站：<span class="num">${params.data.gatePrice}</span> (元/立方米)；`
      }
    },
    // 地图hover
    async handleHover(params) {
      if (params.componentType === 'series') {
        const name = params.name
        const item = this.areaOption.find(element => element.label === name)

        const res = await getAreaPrice({
          location: params.data.priceItemName,
          offerDay: '2020-10-09'
        })
        if (res.status === 0) {
          res.data.forEach(element => {
            if (element.secondColumn === '天然气门站价格') {
              item.gatePrice = element.priceSingle
            } else if (element.threeColumn === '工商业') {
              item.retailPrice_gongye = element.priceSingle
            } else if (element.threeColumn === '民用') {
              item.retailPrice_minyong = element.priceSingle
            }

            this.$set(item, 'dataDate', element.offerDay)
          })
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
  .el-dropdown {
    color: #fff;
  }
}

.chart-container {
  display: flex;
  p {
    text-align: center;
  }
}
</style>

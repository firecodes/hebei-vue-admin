<template>
  <el-row :gutter="20">
    <el-col :span="16">
      <div class="l-t-container">
        <el-card class="item1">
          <p>
            <span class="num">{{ cards.wholeSaleToday }}</span>万方
          </p>
          <p>批发今日量</p>
        </el-card>
        <el-card class="item2">
          <p>
            <span class="num">{{ cards.retailToday }}</span>万方
          </p>
          <p>零售今日量</p>
        </el-card>
        <el-card class="item3">
          <p>
            <span class="num">{{ cards.temperatureToday }}</span>℃
          </p>
          <p>平均气温</p>
        </el-card>
      </div>
      <div class="l-m-container mt-1 mb-1" style="height: 300px">
        <el-card>
          <h4>批发业务销售统计</h4>
          <v-chart :options="wholeSaleOption" style="height: 260px; width:100%;" />
        </el-card>
      </div>
      <div class="l-b-container" style="height: 300px">
        <el-card>
          <h4>零售业务销售统计</h4>
          <v-chart :options="retailOption" style="height: 260px; width:100%;" />
        </el-card>
      </div>
    </el-col>
    <el-col :span="8">
      <el-card style="height: 250px">
        <h4>销售占比</h4>
        <v-chart :options="salePortionOption" style="height: 210px; width:100%;" />
      </el-card>
      <el-card class="mt-1 mb-1" style="height: 250px">
        <h4>管道天然气门站价格</h4>
        <v-chart :options="gatePriceOption" style="height: 210px; width:100%;" />
      </el-card>
      <el-card style="height: 250px">
        <h4>管道天然气零售价格</h4>
        <v-chart :options="retailpriceOption" style="height: 210px; width:100%;" />
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import fetchJsonp from 'fetch-jsonp'
import { daterange1month, dateFormat, getDefaultValue } from '@/util'
console.log(daterange1month)

export default {
  name: 'Home',
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      queryInfo: {
        daterange: daterange1month()
      },
      cards: {
        wholeSaleToday: 0,
        retailToday: 0,
        temperatureToday: 0,
        guandaoqi: 0,
        lng: 0
      },
      wholeSaleOption: {
        // title: '批发业务销量统计',
        legend: {},
        tooltip: { trigger: 'axis' },
        color: ['#4fa1fd', '#fed85c'],
        dataset: { source: [] },
        grid: { left: '50px', right: '20px', top: '50px', bottom: '30px' },
        xAxis: { type: 'category', axisTick: { alignWithLabel: true } },
        yAxis: { name: '单位：万方', splitLine: { show: false } },
        series: [{ type: 'bar' }, { type: 'line' }]
      },
      retailOption: {
        legend: {},
        tooltip: { trigger: 'axis' },
        color: ['#5d62b5', '#29c3be'],
        dataset: { source: [] },
        grid: { left: '50px', right: '20px', top: '50px', bottom: '30px' },
        xAxis: { type: 'category', axisTick: { alignWithLabel: true } },
        yAxis: { name: '单位：万方', splitLine: { show: false } },
        series: [{ type: 'bar' }, { type: 'line' }]
      },
      salePortionOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}万方 ({d}%)'
        },

        series: [
          {
            name: '销售占比',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 150, name: '批发业务' },
              { value: 50, name: '零售业务' }
            ]
          },
          {
            name: '销售占比',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 14,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            data: [
              { value: 100, name: '管道气' },
              { value: 50, name: '冀东LNG' },
              { value: 50, name: '终端销售' }]
          }
        ]
      },
      gatePriceOption: {
        legend: {},
        tooltip: { trigger: 'axis' },
        color: ['#4fa1fd', '#fed85c'],
        dataset: { source: [] },
        grid: { left: '50px', right: '20px', top: '50px', bottom: '30px' },
        xAxis: { type: 'category', axisTick: { alignWithLabel: true } },
        yAxis: { name: '单位：元/立方米', splitLine: { show: false } },
        series: [{ type: 'line' }]
      },
      retailpriceOption: {
        legend: {},
        tooltip: { trigger: 'axis' },
        color: ['#4fa1fd', '#feb54f'],
        dataset: { source: [] },
        grid: { left: '50px', right: '20px', top: '50px', bottom: '30px' },
        xAxis: { type: 'category', axisTick: { alignWithLabel: true } },
        yAxis: { name: '单位：元/立方米', splitLine: { show: false } },
        series: [{ type: 'line' }, { type: 'line' }]
      }
    }
  },
  created() {
    this.getCardsData(), this.getWholesalesCardsData()
    this.getWholesalesStat()
    this.getResalesStat()
    this.getGatePrice()
    this.getRetailprice()
  },
  methods: {
    async getCardsData() {
      // 得到今日的批发量和零售量
      const res = await this.$http.get('/api/index/cards')
      if (res.status !== 0) return this.$message.error('获取数据失败')
      this.cards.wholeSaleToday = res.data[0].quantity
      this.cards.retailToday = res.data[1].quantity

      this.salePortionOption.series[0].data[0].value = res.data[0].quantity
      this.salePortionOption.series[0].data[1].value = res.data[1].quantity
      this.salePortionOption.series[1].data[2].value = res.data[1].quantity
      // 得到今日气温
      fetchJsonp('http://152.136.232.230:8081/api/screen/weather/101090101')
        .then(response => {
          return response.json()
        }).then(json => {
          if (json.status !== 0) return this.$message.error('获取数据失败')
          const reg = /(\d+)/
          const high = reg.exec(json.data.forecast[0].high)[1]
          const low = reg.exec(json.data.forecast[0].low)[1]
          this.cards.temperatureToday = (parseInt(high) + parseInt(low)) / 2
        }).catch(function(ex) {
          console.log('parsing failed', ex)
        })
    },
    async getWholesalesCardsData() {
      // 得到今日的批发量和零售量
      const res = await this.$http.get('/api/screen/wholesales/sales/card')
      if (res.status !== 0) return this.$message.error('获取数据失败')
      this.cards.guandaoqi = res.data[1].quantity
      this.cards.lng = res.data[2].quantity

      this.salePortionOption.series[1].data[0].value = res.data[1].quantity
      this.salePortionOption.series[1].data[1].value = res.data[2].quantity
    },
    async getWholesalesStat() {
      const start = this.queryInfo.daterange[0]
      const end = this.queryInfo.daterange[1]
      const url = `/api/index/wholesales/stat?start=${dateFormat(start, 'yyyy-MM-dd')}&end=${dateFormat(end, 'yyyy-MM-dd')}`
      const res = await this.$http.get(url)
      if (res.status !== 0) return this.$message.error('获取数据失败')
      console.log(res.data)

      // 得到表格数据
      //  先把数据转成对象，方便操作
      const dataObj = {}
      res.data.forEach(item => {
        dataObj[item.name] = item
      })
      console.log(dataObj)
      const data = [['时间', '日销量', '同比']]

      for (let index = start.getTime(); index <= end.getTime();) {
        const date = dateFormat(new Date(index), 'yyyy-MM-dd')
        const quantity = (dataObj[date] && dataObj[date].quantity) || '-'
        const tongBi = (dataObj[date] && dataObj[date].quantity) || '-'

        data.push([date.split('-').slice(1).join('-'), Math.round(quantity), Math.round(tongBi)])
        index += 3600 * 1000 * 24
      }
      this.wholeSaleOption.dataset.source = data
    },
    async getResalesStat() {
      const start = this.queryInfo.daterange[0]
      const end = this.queryInfo.daterange[1]
      const url = `/api/index/resales/stat?start=${dateFormat(start, 'yyyy-MM-dd')}&end=${dateFormat(end, 'yyyy-MM-dd')}`
      const res = await this.$http.get(url)
      if (res.status !== 0) return this.$message.error('获取数据失败')
      console.log(res.data)

      // 得到表格数据
      //  先把数据转成对象，方便操作
      const dataObj = {}
      res.data.forEach(item => {
        dataObj[item.name] = item
      })
      console.log(dataObj)
      const data = [['时间', '日销量', '同比']]

      for (let index = start.getTime(); index <= end.getTime();) {
        const date = dateFormat(new Date(index), 'yyyy-MM-dd')
        const quantity = (dataObj[date] && dataObj[date].quantity) || '-'
        const tongBi = (dataObj[date] && dataObj[date].quantity) || '-'

        data.push([date.split('-').slice(1).join('-'), Math.round(quantity), Math.round(tongBi)])
        index += 3600 * 1000 * 24
      }
      this.retailOption.dataset.source = data
    },
    getGatePrice() {
      const start = this.queryInfo.daterange[0]
      const end = this.queryInfo.daterange[1]

      fetchJsonp(`http://152.136.232.230:8081/api/screen/price/gatePrice?start=${dateFormat(start, 'yyyy-MM-dd')}&end=${dateFormat(end, 'yyyy-MM-dd')}`)
        .then(response => {
          return response.json()
        }).then(json => {
          if (json.status !== 0) return this.$message.error('获取数据失败')
          // this.$message.success('获取数据成功')
          // 得到表格数据
          const data = [['时间', '河北']]
          const defaultNum2 = getDefaultValue(json.data['河北'])

          for (let index = start.getTime(); index <= end.getTime();) {
            const date = dateFormat(new Date(index), 'yyyy-MM-dd')
            const num = json.data['河北'] && json.data['河北'][date] && json.data['河北'][date].priceSingle || defaultNum2
            data.push([date.split('-').slice(1).join('-'), num])
            index += 3600 * 1000 * 24
          }

          console.log('data', data)
          this.gatePriceOption.dataset.source = data
        }).catch(function(ex) {
          console.log('parsing failed', ex)
        })
    },
    getRetailprice() {
      const start = this.queryInfo.daterange[0]
      const end = this.queryInfo.daterange[1]

      fetchJsonp(`http://152.136.232.230:8081/api/screen/price/retailprice?start=${dateFormat(start, 'yyyy-MM-dd')}&end=${dateFormat(end, 'yyyy-MM-dd')}&location=河北-石家庄`)
        .then(response => {
          return response.json()
        }).then(json => {
          if (json.status !== 0) return this.$message.error('获取数据失败')
          // this.$message.success('获取数据成功')
          // 得到表格数据
          const data = [['时间', '石家庄-民用', '石家庄-工业用']]
          const defaultNum1 = getDefaultValue(json.data['民用'])
          const defaultNum2 = getDefaultValue(json.data['工商业'])

          for (let index = start.getTime(); index <= end.getTime();) {
            const date = dateFormat(new Date(index), 'yyyy-MM-dd')
            const num1 = json.data['民用'] && json.data['民用'][date] && json.data['民用'][date].priceSingle || defaultNum1
            const num2 = json.data['工商业'] && json.data['工商业'][date] && json.data['工商业'][date].priceSingle || defaultNum2
            data.push([date.split('-').slice(1).join('-'), num1, num2])
            index += 3600 * 1000 * 24
          }
          this.retailpriceOption.dataset.source = data
        }).catch(function(ex) {
          console.log('parsing failed', ex)
        })
    }

  }
}

</script>
<style lang="less" scoped>
.l-t-container {
  display: flex;
  justify-content: space-between;
  height: 150px;

  .el-card {
    flex-grow: 1;
    background-repeat: no-repeat;
    background-position: right 20px center;

    &.item1 {
      background-image: url('../../assets/img/blue.png');
    }
    &.item2 {
      background-image: url('../../assets/img/green.png');
    }
    &.item3 {
      background-image: url('../../assets/img/yellow.png');
    }

    p:first-child {
      margin: 30px 0 10px;
      .num {
        font-size: 30px;
        margin-right: 5px;
      }
    }
    p:last-child {
      color: #c0c4cc;
    }
  }

  .el-card + .el-card {
    margin-left: 15px;
  }
}

h4 {
  font-weight: 700;
}
</style>

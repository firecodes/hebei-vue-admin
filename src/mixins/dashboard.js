

import BasicChart from '@/components/Charts/BasicChart'
import SalesChart from '@/components/Charts/SalesChart'
import ProportionChart from '@/components/Charts/ProportionChart'

import { daterange1month, daterange6month, parseDate, getSalesChartSource, getPriceSource } from '@/utils'
import { getCards, getWholesalesStat, getResalesStat } from '@/api/screen'
import { getCards as getWholesalesCards } from '@/api/screen/wholesales'
import { getGatePrice, getRetailPrice } from '@/api/screen/price'
import { getWeather } from '@/api/screen/weather'
import { fetchList } from '@/api/customer/retail'

export default {
  components: {
    SalesChart,
    ProportionChart,
    BasicChart,
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
        retailCustomersCount: 0,
        // 天气相关
        weatherTodayMid: 0,
        weatherTodayHigh: 0,
        weatherTodayLow: 0,
        weatherYesterMid: 0,
        weatherYesterHigh: 0,
        weatherYesterLow: 0

      },
      daterange1month: daterange1month(),
      daterange6month: daterange6month(),
      wholesalesStat: [], // 批发业务销售统计
      resalesStat: [], // 零售业务销售统计
      gatePrice: [], // 管道天然气门站价格
      retailprice: [] // 管道天然气零售价格
    }
  },
  mounted() {
    // 卡片数据
    this.getCards()
    // 得到零售客户数量
    this.getRetailCustomersCount()
    // 天气数据(河北 - 石家庄)
    this.getWeather('101090101')
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
    // 得到零售客户数量
    async getRetailCustomersCount() {
      const res = await fetchList({
        pageSize: 1000
      })
      if (res.status === 0) {
        this.cards.retailCustomersCount = res.totalCount
      }
    },
    // 天气数据
    async getWeather(code) {
      const res = await getWeather(101090101)
      if (res.status === 200) {
        const reg = /(\d)+/
        const today = res.data.forecast[0]
        const yesterday = res.data.yesterday
        this.cards.weatherTodayHigh = parseInt(reg.exec(today.high)[0])
        this.cards.weatherTodayLow = parseInt(reg.exec(today.low)[0])
        this.cards.weatherTodayMid = (this.cards.weatherTodayHigh + this.cards.weatherTodayLow) / 2

        this.cards.weatherYesterHigh = parseInt(reg.exec(yesterday.high)[0])
        this.cards.weatherYesterLow = parseInt(reg.exec(yesterday.low)[0])
        this.cards.weatherYesterMid = (this.cards.weatherYesterHigh + this.cards.weatherYesterLow) / 2
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
    },
    // 零售业务销售统计
    async getResalesStat() {
      const res = await getResalesStat({
        start: parseDate(this.daterange1month[0]),
        end: parseDate(this.daterange1month[1])
      })
      if (res.status === 0) {
        this.resalesStat = getSalesChartSource(res.data, this.daterange1month, ['时间', '日销量'], true)
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
    }
  }
}

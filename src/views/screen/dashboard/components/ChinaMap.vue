<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
require('echarts/map/js/china') // china.js
import resize from '@/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    cards: {
      type: Object,
      default: () => {}
    },
    cb: {
      type: Function,
      require: false
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data() {
      this.setOption()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOption()
    },
    setOption() {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (params.name === '河北') {
              return `批发业务(${this.cards.wholeSaleDate})：<br/>日销量：<span class="num">${Math.round(this.cards.wholeSaleTongBi)}</span>(万方)；
        环比：<span class="num">${Math.round(this.cards.wholeSaleTongBi)}</span>(万方)；
        同比：<span class="num">${Math.round(this.cards.wholeSaleHuanbBi)}</span>(万方)；<br/><br/>
        零售业务(${this.cards.retailDate})：<br/>日销量：<span class="num">${Math.round(this.cards.retail)}</span>(万方)<br/><br/>
        气温：<br/>今日平均气温：<span class="num">${this.cards.weatherTodayMid}</span>(℃)；
        高温：<span class="num"> ${this.cards.weatherTodayHigh}</span>(℃)；
        低温：<span class="num"> ${this.cards.weatherTodayLow}</span>(℃)；<br/>
        前日平均气温：<span class="num"> ${this.cards.weatherYesterMid}</span>(℃)；
        高温：<span class="num"> ${this.cards.weatherYesterHigh}</span>(℃)；
        低温：<span class="num"> ${this.cards.weatherYesterLow}</span>(℃)；`
            } else {
              return ''
            }
          }
        },
        series: [
          {
            type: 'map',
            map: 'china',
            label: { show: true, color: 'rgba(244,233,37,0.9)' },
            itemStyle: {
              normal: { areaColor: 'rgba(0,27,93,0.5)', borderColor: '#2ce9f8', borderWidth: 1 },
              emphasis: { areaColor: '#2ce9f8', borderColor: '#2ce9f8' }
            },
            data: [{ name: '河北', selected: true }]
          }
        ]
      })

      this.chart.on('click', params => {
        console.log(params.name)
        if (params.name === '河北') {
          this.cb()
        }
      })
    }
  }
}
</script>

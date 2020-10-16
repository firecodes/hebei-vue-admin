<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
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
      default: '260px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
    // rich: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions() {
      const option = {
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        series: [
          {
            name: '销售占比',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '40%'],
            label: { position: 'inner' },
            labelLine: { show: false },
            data: [
              { value: this.chartData.wholeSale, name: '批发业务' },
              { value: this.chartData.retail, name: '零售业务' }
            ]
          },
          {
            name: '销售占比',
            type: 'pie',
            radius: ['50%', '70%'],
            // startAngle: 180,
            data: [
              { value: this.chartData.guandaoqi, name: '管道气' },
              { value: this.chartData.lng, name: '冀东LNG' },
              { value: this.chartData.retail, name: '终端零售' }
            ]
          }
        ]
      }
      if (this.rich) {
        option.series[1].label = {
          // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          formatter: '{b|{b}：}{c}  {per|{d}%}  ',
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
              lineHeight: 33,
              padding: [4, 8]
            },
            per: {
              color: '#eee',
              backgroundColor: '#334455',
              padding: [2, 4],
              borderRadius: 2
            }
          }
        }
      }
      this.chart.setOption(option)
    }
  }
}
</script>

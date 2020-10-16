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
      type: Array,
      required: true
    },
    color: {
      type: Array,
      default: () => ['#4fa1fd', '#fed85c']
    },
    mainColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(source) {
        this.setOptions(source)
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
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(source) {
      this.chart.setOption({
        legend: { data: ['日销量', '同比'], textStyle: { color: this.mainColor } },
        tooltip: { trigger: 'axis' },
        textStyle: { color: this.mainColor },
        color: this.color,
        dataset: { source },

        grid: { left: 10, right: 10, bottom: 20, top: 30, containLabel: true },
        xAxis: { type: 'category', axisTick: { show: false }, axisLine: { show: false } },
        yAxis: [
          { name: '万方', splitLine: { show: false }, scale: true, axisLine: { lineStyle: { color: this.mainColor } } },
          { name: '万方', splitLine: { show: false }, scale: true, axisLine: { lineStyle: { color: this.mainColor } } }
        ],
        series: [
          { type: 'bar', barMaxWidth: '20' },
          { type: 'line', yAxisIndex: 1 }
        ]
      })
    }
  }
}
</script>

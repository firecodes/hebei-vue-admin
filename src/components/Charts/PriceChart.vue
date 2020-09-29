<template>
  <div :class="className" :style="{height:height,width:width}" />
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
      default: '350px'
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
      default: () => ['#2ec7c9', '#b6a2de', '#5ab1ef']
    },
    mainColor: {
      type: String,
      default: '#333'
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
      console.log(source)
      const option = {
        textStyle: { color: this.mainColor },
        legend: { data: source[0], textStyle: { color: this.mainColor } },
        tooltip: { trigger: 'axis' },
        color: this.color,
        dataset: { source },
        grid: { left: 20, right: 10, bottom: 20, top: 30, containLabel: true },
        xAxis: { type: 'category', axisTick: { alignWithLabel: true }, axisLine: { lineStyle: { color: this.mainColor } } },
        yAxis: { name: '单位：元/立方米', splitLine: { show: false }, scale: true, axisLine: { lineStyle: { color: this.mainColor } } },
        series: []
      }
      for (let i = 0; i < source[0].length - 1; i++) {
        option.series.push({ type: 'line' })
      }
      this.chart.setOption(option)
    }
  }
}
</script>

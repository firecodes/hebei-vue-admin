<template>
  <div :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/mixins/resize'

export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '120px'
    },
    chartData: {
      type: Array,
      default: () => []
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
        textStyle: { color: '#fff' },
        color: ['#fff', '#fff'],
        dataset: { source },
        grid: { left: 0, right: 0, bottom: 20, top: 30 },
        xAxis: { show: false, type: 'category' },
        yAxis: { show: false },
        series: []
      }
      if (source.length) {
        for (let i = 0; i < source[0].length - 1; i++) {
          option.series.push({
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: { label: { show: true } }
            }
          })
        }
      }
      this.chart.setOption(option)
    }
  }
}
</script>

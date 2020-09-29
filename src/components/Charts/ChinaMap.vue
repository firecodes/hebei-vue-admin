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
      default: '300px'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null
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
      const series = []
      for (let i = 0; i < this.data.length - 1; i++) {
        series.push({ type: 'bar', seriesLayoutBy: 'row' })
      }

      this.chart.setOption({
        tooltip: {
          // trigger: 'item',
          // formatter: '{b} : {c} ({d}%)',
        },
        legend: {
          left: 'center',
          top: 'bottom',
          show: false
        },
        dataset: {
          source: this.data
        },
        xAxis: { type: 'category' },
        yAxis: {},
        grid: {
          bottom: 40,
          left: 40,
          right: 20,
          top: 20
        },
        series: series
      })
    }
  }
}
</script>

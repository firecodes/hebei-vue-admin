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
    chartData: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#ffd52b'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData() {
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption()
    },
    setOption() {
      this.chart.setOption({
        series: [
          {
            name: '计划完成率',
            type: 'gauge',
            color: '#fff',
            detail: {
              formatter: '{value}%',
              fontSize: 18,
              color: 'auto',
              padding: [0, 0, 30, 0]
            },
            splitNumber: 5,
            axisLabel: { show: false },
            pointer: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [Math.min(this.chartData / 100, 1), this.color],
                  [1, '#1b5588']
                ],
                width: 15
              }
            },
            splitLine: { length: 15, lineStyle: { color: '#02417b' } },
            axisTick: { length: 15, lineStyle: { width: 2, color: '#02417b' } },
            // radius: '80%',
            startAngle: 314,
            endAngle: -45,
            data: [{ value: this.chartData, name: '' }]
          }
        ]
      })
    }
  }
}
</script>

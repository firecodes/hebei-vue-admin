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
      type: Array,
      default: () => []
    },
    seriesName: {
      type: String,
      default: '销售量'
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'outside'
    },
    title: {
      type: String,
      default: ''
    },
    showLegend: { type: Boolean, default: false }
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
        title: {
          text: this.title,
          textStyle: { color: '#ffffff', fontWeight: 'normal', fontSize: '14' },
          left: 'center'
        },
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c}万方 ({d}%)' },
        legend: {
          right: 10,
          top: 'center',
          show: this.showLegend,
          orient: 'vertical',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: this.seriesName,
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: true,
            label: { show: this.showLabel, position: this.labelPosition },
            emphasis: { label: { show: true, fontSize: '14' } },
            data: this.chartData
          }
        ]
      })
    }
  }
}
</script>

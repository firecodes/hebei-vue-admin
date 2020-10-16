<template>
  <div :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
require('echarts/map/js/province/hebei') // hebei.js
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
      default: '800px'
    },
    chartData: {
      type: Array,
      default: () => []
    },
    tooltipFn: {
      type: Function,
      default: () => ''
    },
    hoverFn: {
      type: Function,
      default: () => ''
    },
    clickFn: {
      type: Function,
      default: () => ''
    },
    center: {
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
        this.setOption(source)
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
      this.setOption()
    },
    setOption() {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: this.tooltipFn
        },
        geo: {
          map: '河北',
          label: { normal: { show: false }, emphasis: { show: false } },
          itemStyle: {
            normal: { areaColor: 'rgba(0,27,93,0.5)', borderColor: '#2ce9f8', borderWidth: 1 },
            emphasis: { areaColor: 'rgba(0,27,93,0.5)', borderColor: '#2ce9f8' }
          }
        },
        series: [
          {
            // 普通小点
            name: '销售量',
            type: 'effectScatter',
            showEffectOn: 'render',
            coordinateSystem: 'geo',
            zlevel: 1,
            rippleEffect: {
              brushType: 'stroke'
            },
            symbolSize: val => {
              return val[2]
            },
            label: {
              formatter: '{b}',
              position: 'bottom',
              show: true
            },
            itemStyle: {
              normal: {
                color: 'rgba(244,233,37,0.9)'
              },
              emphasis: {
                color: 'rgba(246,33,87,1)'
              }
            },
            data: this.chartData
          }
        ]
      }
      if (this.center.length) {
        option.geo.center = this.center
        option.geo.zoom = 3
      }
      this.chart.setOption(option)

      this.chart.on('mouseover', this.hoverFn)
      this.chart.on('click', this.clickFn)
    }
  }
}
</script>

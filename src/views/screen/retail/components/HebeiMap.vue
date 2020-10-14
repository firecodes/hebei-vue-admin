<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
require('echarts/map/js/province/hebei') // hebei.js
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
    chartData: {
      type: Array,
      required: true
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
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: params => {
            console.log(params)
            return `${params.name}<br/>
            日销量：<span class="num">${params.value[2]}</span> (万方)；<br/>
            环比：<span class="num">${params.value[2]}</span>(万方)；<br/>
            同比：<span class="num">${params.value[2]}</span>(万方)；`
          }
        },
        geo: {
          // type: 'map',
          map: '河北',
          label: { normal: { show: false }, emphasis: { show: false } },
          itemStyle: {
            normal: { areaColor: 'rgba(0,27,93,0.5)', borderColor: '#2ce9f8', borderWidth: 1 },
            emphasis: { areaColor: '#2ce9f8', borderColor: '#2ce9f8' }
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
            symbolSize: function (val) {
              var size = val[2] / 50
              return size > 6 ? size : 6
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
      })
    }
  }
}
</script>

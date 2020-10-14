<template>
  <div :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import baoding from './map/保定地区.json'
import cangzhou from './map/沧州地区.json'
import handan from './map/邯郸地区.json'
import hengshui from './map/衡水地区.json'
import langfang from './map/廊坊地区.json'
import qinhuangdao from './map/秦皇岛地区.json'
import shijiazhuang from './map/石家庄地区.json'
import tangshan from './map/唐山地区.json'
import xingtai from './map/邢台地区.json'
import zhangjiakou from './map/张家口地区.json'
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
    city: {
      type: String,
      require: true
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
    echarts.registerMap('保定地区', baoding)
    echarts.registerMap('沧州地区', cangzhou)
    echarts.registerMap('邯郸地区', handan)
    echarts.registerMap('衡水地区', hengshui)
    echarts.registerMap('廊坊地区', langfang)
    echarts.registerMap('秦皇岛地区', qinhuangdao)
    echarts.registerMap('石家庄地区', shijiazhuang)
    echarts.registerMap('唐山地区', tangshan)
    echarts.registerMap('邢台地区', xingtai)
    echarts.registerMap('张家口地区', zhangjiakou)
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
      console.log('setOption---')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: this.tooltipFn
        },
        geo: {
          map: this.city,
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
      })

      this.chart.on('mouseover', this.hoverFn)
    }
  }
}
</script>

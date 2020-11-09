<template>
  <div class="container screen">
    <div class="chart-wrapper map-wrapper">
      <!-- 显示管线 -->
      <div class="mapOp">
        <div class="mapOp-btn">
          <span class="skipBtn" @click="$router.push('/screen')">返回首页</span>
          <span class="skipBtn" @click="reset">最初大小</span>
        </div>
        <h1>河北省天然气长输管道走向示意图</h1>
        <canvas ref="guanxiantuRef" width="1888" height="981" />

        <div ref="tooltipRef" class="tooltip">
          <div class="tooltip-inner">
            <div class="title">{{ tooltip.title }}</div>
            <ul>
              <li v-for="(item, index) in tooltip.customer" :key="index">{{ index + 1 + '.' }} {{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 四个角的三角形 -->
      <div class="angel">
        <img class="img1" src="~@/assets/img/screen/angle.png" alt />
        <img class="img2" src="~@/assets/img/screen/angle.png" alt />
        <img class="img3" src="~@/assets/img/screen/angle.png" alt />
        <img class="img4" src="~@/assets/img/screen/angle.png" alt />
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="900px">
      <h2>主要分布情况</h2>
      <table>
        <thead>
          <tr>
            <th />
            <th>南部地区</th>
            <th>中部地区</th>
            <th>北部地区</th>
            <th>唐山</th>
            <th>秦皇岛</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in gridData" :key="index">
            <th>{{ item.guanxian }}</th>
            <td>{{ item.southArea }}</td>
            <td>{{ item.midArea }}</td>
            <td>{{ item.northArea }}</td>
            <td>{{ item.tangshan }}</td>
            <td>{{ item.qinhuangdao }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <img src="../../assets/img/fenbuqingkuang.png" style="width:100%" /> -->
    </el-dialog>
  </div>
</template>

<script>
import stationInfo from './stationInfo'
import fenbu from './fenbu'

export default {
  data() {
    return {
      stationInfo,
      canvas: null,
      context: null,
      img: null,
      imgX: 0,
      imgY: 0,
      imgScale: 0.3,
      posSize: 40,
      tooltip: {
        title: 'jiji',
        customer: ['1', '2']
      },
      dialogVisible: false,
      gridData: fenbu
    }
  },
  mounted() {
    console.log(this.canvas)
    this.canvas = this.$refs['guanxiantuRef']
    this.context = this.canvas.getContext('2d') // 画布显示二维图片
    this.loadImg()
    this.canvasEventsInit()
  },
  methods: {
    loadImg() {
      this.img = new Image()
      this.img.onload = () => {
        this.drawImage()
      }
      const imgUrl = require('@/assets/img/guanxian/guanxiantu-big.png')
      this.img.src = imgUrl
    },
    refresh() {
      this.clear()
      this.drawImage()
    },
    reset() {
      this.imgX = 0
      this.imgY = 0
      this.imgScale = 0.3
      this.clear()
      this.drawImage()
    },
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    drawImage() {
      this.context.drawImage(
        this.img, // 规定要使用的图像、画布或视频。
        0,
        0, // 开始剪切的 x 坐标位置。
        this.img.width,
        this.img.height, // 被剪切图像的高度。
        this.imgX,
        this.imgY, // 在画布上放置图像的 x 、y坐标位置。
        this.img.width * this.imgScale,
        this.img.height * this.imgScale // 要使用的图像的宽度、高度
      )
    },
    /* 事件注册*/
    canvasEventsInit() {
      this.canvas.onmousewheel = this.canvas.onwheel = event => {
        // 滚轮放大缩小
        const pos = this.windowToCanvas(event.clientX, event.clientY)

        const wheelDelta = event.wheelDelta ? event.wheelDelta : event.deltalY * -40 // 获取当前鼠标的滚动情况
        if (wheelDelta > 0) {
          this.imgScale *= 2
          this.imgX = this.imgX * 2 - pos.x
          this.imgY = this.imgY * 2 - pos.y
          this.refresh() // 重新绘制图片
        } else {
          if (this.imgScale >= 0.6) {
            this.imgScale /= 2
            this.imgX = this.imgX * 0.5 + pos.x * 0.5
            this.imgY = this.imgY * 0.5 + pos.y * 0.5
            this.refresh() // 重新绘制图片
          }
        }
      }

      // 点击事件
      // this.canvas.addEventListener(
      //   'click',
      //   e => {
      //     const p = this.getEventPosition(e)
      //     console.log(p)

      //     const x = (p.x - this.imgX) / this.imgScale
      //     const y = (p.y - this.imgY) / this.imgScale
      //     let isOnStation = false
      //     // 判断点击了那个矩形
      //     for (let i = 0; i < this.stationInfo.length; i++) {
      //       const item = {
      //         x_min: this.stationInfo[i].x - this.posSize,
      //         y_min: this.stationInfo[i].y - this.posSize,
      //         x_max: this.stationInfo[i].x + this.posSize,
      //         y_max: this.stationInfo[i].y + this.posSize,
      //         name: this.stationInfo[i].name,
      //         guanxian: this.stationInfo[i].guanxian,
      //         customer: this.stationInfo[i].customer
      //       }

      //       if (item.y_min <= y && y <= item.y_max) {
      //         if (item.x_min <= x && x <= item.x_max) {
      //           isOnStation = true
      //           this.tooltip.title = `${item.name}(${item.guanxian})`
      //           this.tooltip.customer = item.customer
      //           this.$refs['tooltipRef'].style.opacity = 1
      //           this.$refs['tooltipRef'].style.left = e.screenX + 'px'
      //           this.$refs['tooltipRef'].style.top = e.screenY + 'px'
      //           break
      //         }
      //       }
      //     }

      //     if (!isOnStation) {
      //       this.$refs['tooltipRef'].style.opacity = 0
      //     }
      //   },
      //   false
      // )
    },
    /* 坐标转换*/
    windowToCanvas(x, y) {
      const box = this.canvas.getBoundingClientRect() // 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
      return {
        x: x - box.left - (box.width - this.canvas.width) / 2,
        y: y - box.top - (box.height - this.canvas.height) / 2
      }
    }
    // getEventPosition(ev) {
    //   var x, y
    //   if (ev.layerX || ev.layerX == 0) {
    //     x = ev.layerX
    //     y = ev.layerY
    //   } else if (ev.offsetX || ev.offsetX == 0) {
    //     // Opera
    //     x = ev.offsetX
    //     y = ev.offsetY
    //   }
    //   return {
    //     x: x,
    //     y: y
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  background: #044e8e;
}
.el-dialog .el-dialog__header {
  display: none;
}
.el-dialog .el-dialog__body {
  color: #fff;
  padding-top: 2px;
}

table {
  width: 100%;
  border: 1px solid #0d8fdb;
  box-shadow: 0px 0px 4px #0d8fdb !important;
  text-align: center;
}
table td,
table th {
  padding: 24px 8px;
  border: 1px dashed #0d8fdb;
}
table td {
  color: #f4e925;
  width: 150px;
  box-sizing: border-box;
  text-align: left;
}
table thead tr {
  height: 40px;
}
</style>

<style scoped lang="scss">
.container {
  width: 1920px;
  height: 1080px;
  background-image: linear-gradient(#05549b, #001f4d);
  color: #fff;
  padding: 15px;
  .map-wrapper {
    text-align: center;
    position: relative;
    .mapOp {
      // padding: 0 15px;
      // position: relative;
      .mapOp-btn {
        padding-right: 15px;
      }

      h1 {
        position: absolute;
        text-align: center;
        font-size: 40px;
        line-height: 66px;
        text-shadow: 0 0 5px #ffffff;
        margin: 0;
        font-weight: 400;
        top: 0;
        left: 50%;
        margin-left: -300px;
      }

      canvas {
        margin-top: 10px;
        // background-color: pink;
        margin-bottom: 5px;
      }

      .tooltip {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
      }
      .tooltip-inner {
        max-width: 200px;
        padding: 0.25rem 0.5rem;
        color: #fff;
        // text-align: center;
        border-radius: 0.25rem;
        background-color: rgba(0, 0, 0, 0.5);
        ul {
          padding: 0;
        }
        li {
          list-style: none;
          text-align: left;
          line-height: 24px;
        }
      }
    }
  }
}
</style>

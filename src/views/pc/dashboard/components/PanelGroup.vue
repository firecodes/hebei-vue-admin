<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :span="8" class="card-panel-col">
      <div class="card-panel item1">
        <div class="card-panel-description">
          <div><span class="card-panel-num" v-text="cards.wholeSale" />万方</div>
          <div class="card-panel-text">
            批发业务量(
            <span v-text="cards.wholeSaleDate" />)
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="8" class="card-panel-col">
      <div class="card-panel item2">
        <div class="card-panel-description">
          <div><span class="card-panel-num" v-text="cards.retail" />万方</div>
          <div class="card-panel-text">
            零售业务量(
            <span v-text="cards.retailDate" />))
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="8" class="card-panel-col">
      <div class="card-panel item3">
        <div class="card-panel-description">
          <div><span class="card-panel-num">0</span>℃</div>
          <div class="card-panel-text">平均气温</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    cards: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    padding: 20px;
    height: 150px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    background-repeat: no-repeat;
    background-position: right 20px center;

    &.item1 {
      background-image: url('~@/assets/img/pc/blue.png');
    }
    &.item2 {
      background-image: url('~@/assets/img/pc/green.png');
    }
    &.item3 {
      background-image: url('~@/assets/img/pc/yellow.png');
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      margin-top: 26px;

      .card-panel-text {
        line-height: 30px;
        color: rgb(192, 196, 204);
      }

      .card-panel-num {
        font-size: 30px;
        margin-right: 5px;
      }
    }
  }
}
</style>

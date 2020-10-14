<template>
  <div class="panel-group">
    <div class="card-panel" :title="cards.wholeSaleDate">
      <div class="card-panel-title">客户数量（户）</div>
      <div class="card-panel-content">
        <div class="card-panel-num" v-text="cards.totalCount" />
        <div class="card-panel-description">
          <div class="mb-0">
            昆仑系:
            <span v-text="cards.kunlunCount" />
          </div>
          <div>
            直供工业用户:
            <span v-text="cards.directSupplyCount" />
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel" :title="cards.dataDate">
      <div class="card-panel-title">总销气量（万方）</div>
      <div class="card-panel-content">
        <div class="card-panel-num" v-text="cards.quantity" />
        <div class="card-panel-description">
          <div class="mb-0">
            环比：
            <span v-text="cards.huanBi" />
          </div>
          <div>
            同比：
            <span v-text="cards.tongBi" />
          </div>
        </div>
      </div>
    </div>
  </div>
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
  display: flex;
  justify-content: space-around;
  padding: 0 60px;

  .card-panel {
    list-style: none;
    width: 200px;
    height: 93px;
    padding: 14px 14px 0;
    background: url(~@/assets/img/screen/cards_index_wholesale.png) no-repeat;
    .card-panel-title {
      margin-bottom: 10px;
    }

    .card-panel-content {
      display: flex;
      justify-content: space-between;

      .card-panel-num {
        font-size: 28px;
        color: #21e1ff;
        text-shadow: 0 0 10px #21e1ff;
        padding-top: 9px;
      }
      .card-panel-description {
        color: #b1643f;
        line-height: 20px;
      }
    }
  }
}
</style>

<template>
  <div class="panel-group">
    <div class="card-panel" :title="cards.wholeSaleDate">
      <div class="card-panel-title">日销售量(含LNG)（万方）</div>
      <div class="card-panel-content">
        <div class="card-panel-num" v-text="cards.wholeSale" />
        <div class="card-panel-description">
          <div class="mb-0">
            环比：
            <span v-text="cards.wholeSaleHuanBi" />
          </div>
          <div>
            同比：
            <span v-text="cards.wholeSaleTongBi" />
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel" :title="cards.guandaoqiDate">
      <div class="card-panel-title">管道气业务量（万方）</div>
      <div class="card-panel-content">
        <div class="card-panel-num" v-text="cards.guandaoqi" />
        <div class="card-panel-description">
          <div class="mb-0">
            环比：
            <span v-text="cards.guandaoqiHuanBi" />
          </div>
          <div>
            同比：
            <span v-text="cards.guandaoqiTongBi" />
          </div>
        </div>
      </div>
    </div>
    <div class="card-panel" :title="cards.lngDate">
      <div class="card-panel-title">冀东LNG业务量（万方）</div>
      <div class="card-panel-content">
        <div class="card-panel-num" v-text="cards.lng" />
        <div class="card-panel-description">
          <div class="mb-0">
            环比：
            <span v-text="cards.lngHuanBi" />
          </div>
          <div>
            同比：
            <span v-text="cards.lngTongBi" />
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
  justify-content: space-between;

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

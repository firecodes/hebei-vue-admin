<template>
  <div class="panel-group">
    <div class="card-panel" :title="cards.wholeSaleDate">
      <div class="card-panel-title">批发业务量（万方）</div>
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
    <div class="card-panel" :title="cards.retailDate">
      <div class="card-panel-title">零售业务量（万方）</div>
      <div class="card-panel-content">
        <div class="card-panel-num" v-text="cards.retail" />
        <div class="card-panel-description">
          <div style="padding-top: 20px">终端用户：22（个）</div>
        </div>
      </div>
    </div>
    <div class="card-panel">
      <div class="card-panel-title">平均气温（℃）</div>
      <div class="card-panel-content">
        <div class="card-panel-num">21</div>
        <div class="card-panel-description">
          <div>高温：36</div>
          <div>低温：17</div>
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
    width: 318px;
    height: 128px;
    padding: 14px 26px 0;
    background: url(~@/assets/img/screen/cards_index.png) no-repeat;
    .card-panel-title {
      margin-bottom: 35px;
    }

    .card-panel-content {
      display: flex;
      justify-content: space-between;

      .card-panel-num {
        font-size: 36px;
        color: #21e1ff;
        text-shadow: 0 0 10px #21e1ff;
        // padding-top: 20px;
      }
      .card-panel-description {
        color: #b1643f;
        line-height: 20px;
      }
    }
  }
}
</style>

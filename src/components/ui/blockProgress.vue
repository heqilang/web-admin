<template>
  <div>
    <ul class="nativePlaceAnalysis">
      <li v-for="(item, index) in list" :key="index">
        <div class="top">
          <div class="left">
            <span>{{ item.ranking }} </span>
            <span>{{ item.province }}</span>
          </div>
          <div class="right">
            <span>{{ item.num + '  ' }} </span>
            <span>{{ item.unit }}</span>
            {{ item.perent + '%' }}
          </div>
        </div>
        <div style="width: 100%">
          <progressUi
            :strokeColor="{
              from: '#248CDB',
              to: '#34DDEB'
            }"
            :stroke-width="12"
            :percent="item.perent"
            type="line"
            :showInfo="false"
            lineColor="#f00"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import progressUi from './progressUi.vue';
defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
</script>

<style scoped lang="scss">
@mixin box_hover {
  &:hover {
    box-shadow: rgba(111, 184, 255, 0.7) 0 0 6px 6px inset;
  }
}
.nativePlaceAnalysis {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #19253e 0%, #223e61 100%);
  padding: 14px;
  border-radius: 4px;
  li {
    background: linear-gradient(90deg, #223e61 0%, #19253e 100%);
    border-radius: 2px;
    padding: 14px 21px;
    width: 100%;
    height: 75px;
    margin-bottom: 14px;
    @include box_hover;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        font-size: 16px;
        font-family: Alimama ShuHeiTi;
        font-weight: bold;
        color: #ffffff;
        span:nth-child(1) {
          background: linear-gradient(180deg, #ffffff, #3ca2f8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          font-size: 20px;
        }
        & > span:nth-child(2) {
          font-size: 16px;
          font-family: Alibaba PuHuiTi 2;
          margin-left: 4px;
        }
      }
      .right {
        font-size: 16px;
        font-weight: normal;
        color: #ffffff;
        span:nth-child(1) {
          font-size: 18px;
          @include common_text;
        }
      }
    }
  }
}
</style>

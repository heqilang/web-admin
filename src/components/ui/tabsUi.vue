<template>
  <div>
    <el-scrollbar ref="scrollbarRef">
      <ul>
        <li
          :style="propStyle"
          v-for="(item, index) in tabList"
          :key="index"
          :class="copyActive == index ? 'tabActive' : ''"
          @click="clickEvent(index, item)"
        >
          <div>{{ item.name }}</div>
          <img
            v-show="copyActive == index"
            :style="`width:${propStyle.minWidth};`"
            src="/images/warning/tabBelow.png"
            alt=""
          />
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script scoped setup>
import { ref, watch } from 'vue';
const props = defineProps({
  tabList: {
    type: Array,
    default: () => []
  },
  propStyle: {
    type: Object,
    default: () => {
      return {
        'min-width': '80px'
      };
    }
  },
  active: {
    type: Number,
    default: 0
  }
});
const copyActive = ref(props.active);
watch(
  () => props.active,
  val => {
    if (val) {
      copyActive.value = val;
    }
  },
  { immediate: true }
);
const emits = defineEmits(['clickEvent', 'update:active']);
// const active = ref(0);
function clickEvent(index, item) {
  copyActive.value = index;
  emits('clickEvent', item);
  emits('update:active', index);
}
</script>

<style scoped lang="scss">
ul {
  display: flex;
  li {
    display: flex;
    min-width: 64px;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    font-size: 16px;
    font-family: Alibaba PuHuiTi 2;
    font-weight: normal;
    color: #ffffff;
    align-items: center;
    // margin: 0 12px;
    cursor: pointer;
    img {
      width: 100%;
      height: 10px;
    }
  }
  .tabActive {
    div {
      color: #25a6ff;
    }
  }
}
</style>

<template>
  <span>
    <span v-if="props.show">{{ data.phone }}</span>
    <span v-if="props.showIcon && data.phone" class="mobile" @click.stop="showPhone"></span>
  </span>
</template>

<script setup lang="ts">
import { formateMobile } from '@/utils/formateUtil';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  userInfo: {
    type: Object
  },
  // desensitize: {
  //   type: Boolean,
  //   default: true
  // },
  show: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});

const isDesensitize = ref(false);
watch(
  () => props.userInfo,
  val => {
    isDesensitize.value = val?.desensitize;
  },
  { immediate: true, deep: true }
);
const data: any = computed(() => {
  if (isDesensitize.value) {
    return {
      ...props?.userInfo,
      phone: formateMobile(props.userInfo?.mobile)
    };
  }
  return {
    ...props?.userInfo,
    phone: props.userInfo?.mobile
  };
});
function showPhone() {
  isDesensitize.value = !isDesensitize.value;
}
</script>

<style lang="scss" scoped>
.mobile {
  cursor: pointer;
  display: inline-block;
  background-image: url(/images/phone.png);
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-left: 6px;
}
</style>

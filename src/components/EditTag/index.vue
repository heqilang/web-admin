<template>
  <div class="tags">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      class="edit-tag"
      :closable="!disabled"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
  </div>
  <template v-if="!disabled">
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"> + 添加 </el-button>
  </template>
</template>

<script>
export default {
  name: 'EditTag'
};
</script>
<script setup>
import { nextTick, ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['update:modelValue']);
const inputValue = ref('');
const dynamicTags = computed(() => {
  return props.modelValue;
});
const inputVisible = ref(false);
const InputRef = ref();

const handleClose = tag => {
  // props.data.splice(props.data.indexOf(tag), 1);
  const res = dynamicTags.value.filter(it => it !== tag);
  emits('update:modelValue', res);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value?.input?.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    // props.data.push(inputValue.value);
    emits('update:modelValue', [...dynamicTags.value, inputValue.value]);
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>
<style lang="scss" scoped>
.edit-tag {
  animation: fade 300ms;
}
@keyframes fade {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

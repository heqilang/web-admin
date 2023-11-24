<template>
  <div class="base-ueditor-wrap" :id="containerId" name="content" type="text/plain"></div>
</template>
<script>
export default {
  name: 'BaseUeditorWrap'
};
</script>
<script setup>
import { onMounted } from 'vue';
const containerId = `Ueditor-id-${parseInt(Math.random() * 10000)}`;
let editor = null;
const props = defineProps({
  modelValue: { type: String, default: '' },
  height: Number
});
const emits = defineEmits(['update:modelValue']);
onMounted(() => {
  editor = window.UE.getEditor(containerId, {
    UEDITOR_HOME_URL: '/UEditor/',
    // 编辑器不自动被内容撑高
    autoHeightEnabled: false,
    // 工具栏是否可以浮动
    autoFloatEnabled: false,
    // 初始容器高度
    initialFrameHeight: props.height || 400,
    // 初始容器宽度
    initialFrameWidth: '100%',
    // 关闭自动保存
    enableAutoSave: true
  });
  editor.ready(() => {
    //设置编辑器的内容
    editor.setContent(props.modelValue);
  });
  editor.addListener('contentChange', () => {
    emits('update:modelValue', editor.getContent());
  });
});
</script>

<style lang="scss" scoped>
.base-ueditor-wrap {
}
</style>

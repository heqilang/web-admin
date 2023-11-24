<template>
  <div class="contain">
    <div class="search">
      <el-input
        class="input"
        :class="{ 'red-border': tips.length > 0 }"
        v-model="value"
        @input="onInput"
        :placeholder="placeholder"
        clearable
        @clear="clear"
      >
        <template #prefix>
          <i :class="['iconfont', iconName]"></i>
        </template>
        <!-- <template #suffix>

        </template> -->
      </el-input>
      <div class="btn" @click="emits('onChange')">
        <img src="/images/house/3.1-搜索@2x.png" alt="" />
        <span>搜索</span>
      </div>
    </div>
    <div class="tips" v-if="tips.length > 0">
      {{ tips }}
    </div>
  </div>
</template>

<script setup>
import { ElInput } from 'element-plus';
import { ref, defineEmits, defineProps } from 'vue';
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: { type: String, default: '' },
  oninput: { type: String, default: '' },
  iconName: { type: String, default: '' },
  tips: { type: String, default: '' }
});
const emits = defineEmits(['input', 'update:modelValue', 'onChange', 'clear']);
const value = ref(props.modelValue);

/** 向父组件提交事件更新数据 */
function onInput(e) {
  emits('update:modelValue', e);
  emits('input', e);
}
function clear() {
  emits('clear');
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  .input {
    height: 50px;
    text-align: left;

    .iconfont {
      font-size: 22px;
      color: #127ffc;
      display: inline-block;
      margin-right: 14px;
    }
  }
  :deep() {
    .el-input {
      margin-right: 6px;
    }
    .el-input__wrapper {
      background-color: #081d32;
      height: 34px;
      box-shadow: none;
    }
    .el-input__inner {
      color: #fff;
    }
  }
}
.red-border {
  :deep(.el-input__inner) {
    border: 1px solid #ff6666;
  }
}
.tips {
  font-size: 14px;
  color: #ff6666;
  text-align: left;
  margin: 5px auto 20px;
}
.btn {
  padding: 0 10px;
  margin-top: 2px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  background-color: #25a6ff;
  display: flex;
  align-items: center;
}
img {
  width: 26%;
  margin-right: 4px;
}
</style>

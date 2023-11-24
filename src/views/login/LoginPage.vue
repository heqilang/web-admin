<template>
  <div class="login_bg">
    <div class="login_wrap">
      <div class="login_title">
        <p class="title_hello">{{ getTimeState() }}！</p>
        <p class="title_mark">欢迎登录 {{ logWordName }}</p>
      </div>
      <DefaultLogin v-show="modality === 'default'" @Mode="getMode" />
      <CodeLogin v-show="modality === 'code'" @Mode="getMode" />
      <ResetPwd v-show="modality === 'resetPwd'" @Mode="getMode" />
    </div>
  </div>
</template>
<script setup lang="ts">
import DefaultLogin from './components/DefaultLogin.vue';
import CodeLogin from './components/CodeLogin.vue';
import ResetPwd from './components/ResetPwd.vue';
import { ref } from 'vue';

const modality = ref('default');
const logWordName = import.meta.env.VITE_APP_SYSTEM_NAME;

// 根据系统时间判断 问候语
function getTimeState() {
  // 获取当前时间
  const timeNow = new Date();
  // 获取当前小时
  const hours = timeNow.getHours();
  // 设置默认文字
  let text = ``;
  // 判断当前时间段
  if (hours >= 0 && hours <= 10) {
    text = `早上好`;
  } else if (hours > 10 && hours <= 14) {
    text = `中午好`;
  } else if (hours > 14 && hours <= 18) {
    text = `下午好`;
  } else if (hours > 18 && hours <= 24) {
    text = `晚上好`;
  }
  return text;
}

function getMode(val: string) {
  modality.value = val;
}
</script>
<style lang="scss" scoped>
@import './login.scss';
.loginBG {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bei-an-hao {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  a:hover {
    text-decoration: underline;
  }
}
</style>

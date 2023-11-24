<template>
  <div class="login_box">
    <div class="xt-title">
      <div class="xt-logo"></div>
      <div>
        {{ logWordName }}
      </div>
    </div>
    <h3>
      <span style="color: #2a61ff">账号密码登录</span>
    </h3>
    <el-form
      :model="form"
      label-position="top"
      :rules="rules"
      ref="loginFormRef"
      label-width="100px"
      class="login_form"
    >
      <el-form-item label prop="phone">
        <p class="label">账号</p>
        <el-input autocomplete="on" ref="phone" v-model="form.phone" placeholder="请输入手机号" maxlength="11">
          <template #prefix> <i-ep-User /> </template
        ></el-input>
      </el-form-item>
      <el-form-item label prop="password">
        <p class="label">密码</p>
        <el-input
          ref="password"
          v-model="form.password"
          @keyup.enter="to_login(loginFormRef)"
          placeholder="请输入密码"
          maxlength="15"
          show-password
        >
          <template #prefix> <i-ep-Lock /> </template>
          <template #suffix>
            <span>
              |
              <i @click="changeState('resetPwd')" class="text_forget_pwd">忘记密码？</i>
            </span>
          </template>
        </el-input>
      </el-form-item>
      <br />
      <el-button
        type="primary"
        class="block_btn"
        :loading="loading"
        @keyup.enter="to_login(loginFormRef)"
        @click.prevent="to_login(loginFormRef)"
        >登录 <i class="el-icon-right"></i
      ></el-button>
    </el-form>
    <br />
    <div style="text-align: center; color: #008fff; cursor: pointer">
      <p class="btn" @click="changeState('code')">
        <span>手机验证码登录</span>
        <i class="el-icon-sort" style="transform: rotate(90deg); margin-left: 5px"></i>
      </p>
    </div>
  </div>
</template>
<script setup>
import UseUserStore from '@/store/user';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const emit = defineEmits(['Mode']);

const loginFormRef = ref();
const loading = ref(false);
const form = reactive({ phone: '', password: '' });
const rules = reactive({
  phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度为6到15位', trigger: 'blur' }
  ]
});
const logWordName = import.meta.env.VITE_APP_SYSTEM_NAME;

function changeState(state) {
  emit('Mode', state);
}
function to_login(formEl) {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      UseUserStore()
        .loginSubmit({ user_mobile: form.phone, user_pwd: form.password })
        .then(() => {
          router.push({ path: '/' });
          loading.value = false;
        })
        .catch(() => {
          loading.value = false;
        });
    }
  });
}
</script>
<script>
export default {
  name: 'DefaultLogin'
};
</script>
<style lang="scss" scoped>
@import '../login.scss';
</style>

<template>
  <div class="login_box">
    <div class="xt-title">
      <div class="xt-logo"></div>
      <div>
        {{ logWordName }}
      </div>
    </div>
    <h3>
      <span style="color: #2a61ff">验证码登录</span>
    </h3>
    <el-form :model="form" label-position="top" :rules="rules" ref="loginForm" label-width="100px" class="login_form">
      <el-form-item label prop="user_mobile">
        <p class="label">手机号</p>
        <el-input v-model="form.user_mobile" placeholder="请输入手机号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label prop="verify_code">
        <p class="label">验证码</p>
        <el-input v-model="form.verify_code" maxlength="6" placeholder="6位验证码">
          <template #suffix>
            <span>
              |
              <el-button class="text_forget_pwd" link @click="getSmsverify_code" :disabled="!gtSuc">
                {{ gtText }}
              </el-button>
            </span>
          </template>
        </el-input>
      </el-form-item>
      <br />
      <el-button type="primary" class="block_btn" :loading="loading" @click="to_login"
        >登录 <i class="el-icon-right"></i
      ></el-button>
    </el-form>
    <br />
    <div style="text-align: center; color: #008fff; cursor: pointer">
      <p class="btn" @click="changeState('default')">
        <span>切换账号密码登录</span>
        <i class="el-icon-sort" style="transform: rotate(90deg); margin-left: 5px"></i>
      </p>
    </div>
  </div>
</template>
<script setup>
import { getLoginSmsVerifyCode } from '@/api/system/api/SysApi';
import UseUserStore from '@/store/user';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const emits = defineEmits(['Mode']);
const router = useRouter();
const route = useRoute();

const loginForm = ref(null);
const loading = ref(false);
const gtSuc = ref(true);
const gtText = ref('获取短信验证码');
const form = reactive({
  user_mobile: '',
  verify_code: ''
});
const rules = {
  user_mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
};
const logWordName = import.meta.env.VITE_APP_SYSTEM_NAME;

function changeState(state) {
  emits('Mode', state);
}
function to_login() {
  loginForm.value.validate(valid => {
    if (valid) {
      loading.value = true;
      UseUserStore()
        .loginBySmsSubmit(form)
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
function getSmsverify_code() {
  loginForm.value.validateField('user_mobile', message => {
    if (message) {
      gtSuc.value = false;
      getLoginSmsVerifyCode({ user_mobile: form.user_mobile }); //发送手机号码获取验证码
      let time = 60;
      let interval = setInterval(() => {
        gtText.value = `${time} 秒后重新发送`;
        --time;
        if (time < 0) {
          gtText.value = '重新发送';

          gtSuc.value = true;
          clearInterval(interval);
          interval = null;
        }
      }, 1000);
    } else {
      ElMessage.error({
        title: '错误',
        message: '请输入正确的电话号码!'
      });
    }
  });
}
onMounted(() => {
  document.onkeydown = e => {
    e = window.event || e;
    if (e.verify_code?.toUpperCase() === 'ENTER' && route?.path === '/login') {
      to_login();
    }
  };
});
</script>
<style lang="scss" scoped>
@import '../login.scss';
</style>

<template>
  <div class="login_box">
    <div class="xt-title">
      <div class="xt-logo"></div>
      <div>
        <!-- 精神文明管理后台 -->
        {{ logWordName }}
      </div>
    </div>
    <h3>
      <span style="color: #2a61ff">重置密码</span>
    </h3>
    <div class="login_form">
      <el-form :model="form" label-position="top" :rules="rules" ref="thisForm" label-width="100px" class="login_form">
        <el-form-item label prop="user_mobile">
          <el-input v-model="form.user_mobile" placeholder="请输入手机号" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label prop="verify_code">
          <el-input v-model="form.verify_code" maxlength="6" autocomplete="off" placeholder="6位验证码">
            <template #suffix>
              <span>
                |
                <el-button class="text_forget_pwd" link @click="getSmsverify_code" :disabled="!gtSuc">{{
                  gtText
                }}</el-button>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input v-model="form.password" maxlength="15" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="passwordConfirm">
          <el-input v-model="form.passwordConfirm" maxlength="15" placeholder="确认密码" show-password></el-input>
        </el-form-item>
        <el-button type="primary" class="block_btn" @click="to_submit">确定重置</el-button>
        <br />
        <div style="text-align: center; color: #008fff; cursor: pointer">
          <p class="btn" @click="to_back()">
            <span>返回登录</span>
            <i class="el-icon-sort" style="transform: rotate(90deg); margin-left: 5px"></i>
          </p>
        </div>
        <br />
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { getResetSmsVerifyCode_1, resetUserPassword } from '@/api/system/api/SysApi';
import { ElMessage, ElNotification } from 'element-plus';
import { reactive, ref } from 'vue';
const emits = defineEmits(['Mode']);

const thisForm = ref(null);
// 是否可以获取验证码
const gtSuc = ref(true);
const gtText = ref('获取验证码');
const form = reactive({
  user_mobile: '',
  verify_code: '',
  password: '',
  passwordConfirm: ''
});
const validatePass = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.length < 6 || value.length > 15) {
    callback(new Error('密码长度为6到15位'));
  } else {
    if (form.passwordConfirm !== '') {
      thisForm.value?.validateField('passwordConfirm');
    }
    callback();
  }
};
const validatePass2 = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};
const rules = {
  user_mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  verify_code: [{ required: true, message: '验证码必填', trigger: 'blur' }],
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: 'blur'
    }
  ],
  passwordConfirm: [{ required: true, validator: validatePass2, trigger: 'blur' }]
};

const logWordName = import.meta.env.VITE_APP_SYSTEM_NAME;

function getSmsverify_code() {
  thisForm.value?.validateField('user_mobile', message => {
    if (!message.length) {
      gtSuc.value = false;
      getResetSmsVerifyCode_1({ user_mobile: form.user_mobile }); //发送手机号码获取验证码
      let time = 60;
      let interval = setInterval(() => {
        gtText.value = `${time} 秒 后重新发送`;
        --time;
        if (time < 0) {
          gtText.value = '重新发送';
          time = 60;
          gtSuc.value = true;
          clearInterval(interval);
          interval = null;
        }
      }, 1000);
    } else {
      ElNotification.error({
        title: '错误',
        message: '请输入正确的手机号码!'
      });
    }
  });
}
function to_back() {
  emits('Mode', 'default');
}
function to_submit() {
  thisForm.value?.validate(valid => {
    if (valid) {
      const currForm = {
        user_mobile: form.user_mobile,
        verify_code: form.verify_code,
        user_pwd: form.password
      };
      resetUserPassword(currForm).then(data => {
        if (data.state === 0) {
          ElMessage.success(data.msg);
          emits('Mode', 'default');
        }
      });
    }
  });
}
</script>
<style lang="scss" scoped>
@import '../login.scss';
.el-form-item {
  margin-bottom: 21px;
}
</style>

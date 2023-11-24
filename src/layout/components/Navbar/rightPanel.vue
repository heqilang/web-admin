<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link" style="color: #fff; cursor: pointer">
      <img v-if="avatar" :src="avatar" class="touixiang" height="20" width="20" alt="用户头像" />
      <img v-else src="/images/user.png" class="touixiang" height="20" width="20" alt="默认头像" />
      <span>&nbsp;{{ UseUserStore().name }}</span>
      <i class="el-icon-caret-bottom"></i>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter" icon="el-icon-user"
          >个人中心<span style="margin-right: 20px"></span
        ></el-dropdown-item>
        <el-dropdown-item command="loginOut" icon="el-icon-switch-button"
          >安全退出<span style="margin-right: 20px"></span
        ></el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import UseUserStore from '@/store/user';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const UPLOAD_BASE_URL = ref(import.meta.env.VITE_APP_UPLOAD_URL);

const avatar = computed(() => {
  const avatar = UseUserStore().avatar;
  if (!avatar) return;
  if (avatar?.startsWith('http')) {
    return avatar;
  } else {
    return UPLOAD_BASE_URL.value + avatar;
  }
});
function handleCommand(command) {
  if (command === 'personalCenter') {
    router.push({ name: 'personalCenter' });
  } else if (command === 'loginOut') {
    try {
      // await logOutMessage();
      UseUserStore().logout();
      router.push({ name: 'login' });
    } catch (error) {
      console.error(error);
      UseUserStore().logout();
      router.push({ name: 'login' });
    }
  }
}
</script>
<style lang="less" scoped>
.touixiang {
  vertical-align: middle;
  border-radius: 100%;
}
</style>

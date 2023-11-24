import { defineStore } from 'pinia';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { UserLoginDTO } from '@/entity/system';
import { useRouter } from 'vue-router';
import UsePermissionStore from './permission';
import { getLoginUserInfo, getSysUser, login, loginBySms } from '@/api/system/api/SysApi';

const UseUserStore = defineStore('userStore', {
  state: () => ({
    token: getToken(),
    name: '',
    avatar: '',
    phone: '',
    comment: '',
    userId: '',
    empId: '',
    userInfo: {},
    currentPosition: {}
  }),
  actions: {
    // user login
    async loginSubmit(userInfo: UserLoginDTO) {
      try {
        const { user_mobile = '', user_pwd } = userInfo;
        const response = await login({ user_mobile: user_mobile.trim(), user_pwd });
        if (response.state === 0 && response.data && response.data.access_token) {
          const token = response.data.access_token;
          this.token = token;
          setToken(token);
          return response.data;
        } else {
          throw response;
        }
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    },

    async loginBySmsSubmit(userInfo: UserLoginDTO) {
      try {
        const response = await loginBySms(userInfo);
        if (response.state === 0 && response.data && response.data.access_token) {
          const token = response.data.access_token;
          this.token = token;
          setToken(token);
          return response.data;
        } else {
          throw response;
        }
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    },

    // get user info ,getSysUser
    async getInfo() {
      try {
        const response = await getLoginUserInfo();
        if (response.state !== 0 || !response.data) {
          throw response.msg;
        }
        let userId = '';
        if (
          response.data &&
          response.data.length > 0 &&
          response.data[0].Type === 'login_user_id' &&
          response.data[0].Value
        ) {
          userId = response.data[0].Value;
          const res = await getSysUser({ user_id: userId });

          if (res.state === 500) {
            removeToken();
            useRouter().push('/login');
          }
          if (res.state !== 0 || !res.data) {
            throw res.msg;
          }
          const { data } = res;
          const { user_name, user_avatar_url, user_mobile, user_comment } = data;
          this.name = user_name ?? '';
          this.avatar = user_avatar_url ?? '';
          this.phone = user_mobile ?? '';
          this.userId = userId;
          this.userInfo = data;
          this.comment = user_comment ?? '';
          return data;
        } else {
          throw new Error('用户不存在');
        }
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      this.token = '';
      this.name = '';
      UsePermissionStore().permissionArr = [];
      removeToken();
    },
    resetToken() {
      return new Promise(() => {
        this.logout();
      });
    }
  }
});

export default UseUserStore;

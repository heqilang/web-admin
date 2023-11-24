import router from './router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import UseUserStore from './store/user';
import UsePermissionStore from './store/permission';
import { ElMessage } from 'element-plus';
import getPageTitle from './utils/getPageTitle';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/screen']; // no redirect whitelist

router.beforeEach(async (to, _from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title as string);

  // 跳转登录移除用户信息
  if (to.path === '/login') {
    UseUserStore().logout();
    NProgress.done();
    next();
    return;
  }

  // 白名单检查
  if (whiteList.includes(to.path)) {
    next();
    return;
  }
  // token检查
  const hasToken = getToken();
  if (!hasToken) {
    NProgress.done();
    next({ path: `/login` });
    return;
  }

  // 用户信息检查
  const hasUserInfo = UseUserStore().name; // 判断是否有userInfo
  if (!hasUserInfo) {
    await UseUserStore().getInfo();
  }
  const hasPermissionArr = UsePermissionStore().permissionArr && UsePermissionStore().permissionArr.length > 0;

  // 菜单检查
  if (!hasPermissionArr) {
    try {
      // 没有权限菜单，去获取权限菜单
      const _data = await UsePermissionStore().generateRoutes();
      // 控制权限不能随便输入进行访问 start
      const list = _data;
      if (plain(list).some(item => item.name === to.name || item.name === to.meta.belong)) {
        next();
      } else {
        const firstRoute = getFirstRoute(plain(list));
        firstRoute.name && next({ name: firstRoute.name }); //需要修改，去到没权限 to do
      }
      return;
    } catch (error) {
      await UseUserStore().resetToken();
      ElMessage.error(error || '系统错误，请重新登录');
      next({ path: `/login` });
      NProgress.done();
      return;
    }
  }

  next();
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

function getFirstRoute(routes: any[]): any {
  if (routes.length > 0) {
    if (routes[0].children && routes[0].children.length > 0) {
      return getFirstRoute(routes[0].children);
    } else {
      return routes[0];
    }
  }
}
function plain(list: any[]): any[] {
  return list.reduce((accr, item) => {
    accr.push(item);
    if (item?.children?.length) {
      accr = accr.concat(plain(item.children));
    }
    return accr;
  }, []);
}

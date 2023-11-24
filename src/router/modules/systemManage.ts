import { RouteRecordRaw } from 'vue-router';
import menuMian from '@/components/Main/mainLevelOne.vue';

const systemManageRouter: RouteRecordRaw = {
  path: '/systemManage',
  component: menuMian,
  name: 'systemManage',
  meta: {
    title: '系统管理',
    icon: 'system'
  },
  children: [
    {
      path: '/organizeSetting',
      name: 'organizeSetting',
      meta: { title: '组织架构管理' },
      component: () => import('@/views/systemManage/organizeManage/OrganizeManage.vue')
    },
    {
      path: '/roleList',
      name: 'roleList',
      meta: { title: '角色管理' },
      component: () => import('@/views/systemManage/roleManage/RoleManage.vue')
    },
    {
      path: '/roleInfo',
      name: 'roleInfo',
      meta: { title: '查看角色' },
      component: () => import('@/views/systemManage/roleManage/RoleDetail.vue')
    },
    {
      path: '/updateroleInfo',
      name: 'updateroleInfo',
      meta: { title: '编辑角色' },
      component: () => import('@/views/systemManage/roleManage/RoleDetail.vue')
    },

    {
      path: '/userList',
      name: 'userList',
      meta: { title: '用户管理' },
      component: () => import('@/views/systemManage/userManage/UserManage.vue')
    },
    {
      path: '/menu-man',
      name: 'menu-man',
      meta: { title: '菜单管理' },
      component: () => import('@/views/systemManage/menuManage/MenuManage.vue')
    },
    {
      path: '/logManage',
      name: 'logManage',
      meta: { title: '日志管理' },
      component: () => import('@/views/systemManage/logManage/LogManage.vue')
    }
  ]
};

export default systemManageRouter;

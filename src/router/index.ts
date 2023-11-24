import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import systemManageRouter from './modules/systemManage';

const Layout = () => import('@/layout/index.vue');

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginPage.vue')
  },
  {
    path: '/',
    name: 'home',
    component: Layout,
    children: [systemManageRouter]
  },
  {
    path: '/noAuthority',
    name: 'noAuthority',
    component: () => import('@/views/errorPage/noAuthority.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFund',
    component: () => import('@/views/errorPage/404Page.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

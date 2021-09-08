import { createRouter, createWebHashHistory } from 'vue-router';

export const menus = [{
  name: '首页',
  index: 'home',
  route: '/',
  icon: 'home-filled',
  component: () => import('./views/home.vue')
}, {
  name: '设置',
  index: 'setting',
  route: '/setting',
  icon: 'setting',
  component: () => import('./views/setting.vue')
}];

const routes = menus.map(item => {
  return {
    name: item.index,
    path: item.route,
    component: item.component,
    meta: {menu: item}
  };
});

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import { Component } from 'vue-property-decorator';
import systemArchives from '@/views/occupHealhPages/systemArchives';

Vue.use(VueRouter);

Component.registerHooks([
  'beforeRouterEnter',
  'beforeRouterLeave',
  'beforeRouterUpdate'
]);


const originalPath = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return (originalPath.call(this, location)).catch((e) => { e; });
};

const routes = [
  {
    path: '/SystemArchives',
    name: 'SystemArchives',
    component: systemArchives
  }
];

const router = new VueRouter({
  base: '/',
  routes
});

router.beforeEach((to, from, next) => {
  next();
  // const { fullPath } = to;
  // let obj = getUrlParams(fullPath);
  // if (obj.token) {
  //   sessionStorage.setItem('token', obj.token);
  // }
  // let token = sessionStorage.getItem('token');
  // if (token) {
  //   next();
  // } else {
  //   if (to.path == '/login') {
  //     next();
  //   } else {
  //     next('/login');
  //   }
  // }
});
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Redmine from '../views/Redmine.vue';
import Setting from '../views/Setting.vue';
import TabedView from '../views/TabedView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/redmine',
    name: 'Redmine view',
    component: Redmine
  },
  {
    path: '/tab',
    name: 'Tab',
    component: TabedView
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  },
  {
    path: '/',
    redirect: '/redmine'
  }
];

const router = new VueRouter({
  routes
});

export default router;

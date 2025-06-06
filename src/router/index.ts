import { createRouter, createWebHistory } from 'vue-router';
import { getRoleFromJWT } from '../utils/jwtUtils';
import HomePage from '../components/pages/HomePage.vue';
import UserLogin from '../components/pages/UserLogin.vue';
import AdminLogin from '../components/pages/AdminLogin.vue';
import MainLayout from '../components/layouts/MainLayout.vue';
import AdminLayout from '../components/layouts/AdminLayout.vue';
import AdminOrderManagerPage from '../components/pages/admin/AdminOrderManagerPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/user-login',
    component: MainLayout,
    children: [
      { path: '/home', component: HomePage },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'order-manager', component: AdminOrderManagerPage },
    ],
    beforeEnter: (_to: any, _from: any, next: (arg?: string) => void) => {
      const role = getRoleFromJWT();
      if (role === 'ADMIN') {
        next();
      } else {
        console.log('Access denied: User does not have admin role');
        next('/admin-login');
      }
    },
  },
  { name: 'user-login', path: '/user-login', component: UserLogin },
  { name: 'admin-login', path: '/admin-login', component: AdminLogin },
];

const router = createRouter({
  history: createWebHistory('/dew-qr-ui/'),
  routes,
});

export default router;
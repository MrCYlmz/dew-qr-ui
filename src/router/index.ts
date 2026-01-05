import { createRouter, createWebHistory } from 'vue-router';
import { getRoleFromJWT, getIdFromJWT } from '../utils/jwtUtils';
import { authApi } from '../api/openapi';
import HomePage from '../components/pages/HomePage.vue';
import UserLogin from '../components/pages/UserLogin.vue';
import AdminLogin from '../components/pages/AdminLogin.vue';
import WaitingScreen from '../components/pages/WaitingScreen.vue';
import MainLayout from '../components/layouts/MainLayout.vue';
import AdminLayout from '../components/layouts/AdminLayout.vue';
import AdminOrderManagerPage from '../components/pages/AdminOrderManagerPage.vue';
import AdminTablesPage from '../components/pages/AdminTablesPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/user-login',
    component: MainLayout,
    children: [
      {
        path: '/home',
        component: HomePage,
        beforeEnter: async (_to: any, _from: any, next: (arg?: string) => void) => {
          const userId = getIdFromJWT();
          if (!userId) {
            next('/user-login');
            return;
          }
          try {
            const response = await authApi.getUserStatus(userId);
            if (response.data.status === 'APPROVED') {
              next();
            } else {
              next('/waiting');
            }
          } catch {
            next('/user-login');
          }
        },
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/tables',
    children: [
      { path: 'order-manager', component: AdminOrderManagerPage },
      { path: 'tables', component: AdminTablesPage },
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
  { name: 'waiting', path: '/waiting', component: WaitingScreen },
];

const router = createRouter({
  history: createWebHistory('/dew-qr-ui/'),
  routes,
});

export default router;
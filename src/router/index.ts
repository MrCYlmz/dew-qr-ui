import { createRouter, createWebHistory } from 'vue-router';
import { getRoleFromJWT } from '../utils/jwtUtils';
// Ensure you install jwt-decode: npm install jwt-decode
import HomePage from '../pages/HomePage.vue';
import AdminPage from '../pages/AdminPage.vue';
import UserLogin from '../pages/UserLogin.vue';
import MainLayout from '../layouts/MainLayout.vue';
import AdminLogin from '../pages/AdminLogin.vue';

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: MainLayout,
    children: [
      { path: '/home', component: HomePage },
      { path: '/admin-dashboard', component: AdminPage },
    ],
  },
  { name: 'user-login', path: '/user-login', component: UserLogin },
  { name: 'admin-login', path: '/admin-login', component: AdminLogin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check roles
router.beforeEach((to, _from, next) => {
  if (to.path === '/admin-dashboard') {
    const role = getRoleFromJWT();
    if (role) {
        if (getRoleFromJWT() === 'ADMIN') {
          next(); // Allow access
        } else {
          console.log('Access denied: User does not have admin role');
          next('/admin-login'); // Redirect to home if not admin
        }
      }
      else {
        console.log('Access denied: No token found');
        next('/admin-login');
      };
    }else {
      next();
    } 
  } 
);

export default router;
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'home', component: () => import('pages/IndexPage.vue') }]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', meta: { requiresUnauth: true }, component: () => import('pages/auth/LoginPage.vue') },
      { path: '/forgot-password', name: 'forgot-password', meta: { requiresUnauth: true }, component: () => import('pages/auth/ForgotPasswordPage.vue') },
      { path: '/register', name: 'register', meta: { requiresUnauth: true }, component: () => import('pages/auth/RegisterPage.vue') }
    ]
  },
  {
    path: '/verify-email/:code',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'verify-email', component: () => import('pages/auth/VerifyEmailPage.vue') }
    ]
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'profile', component: () => import('pages/ProfilePage.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/pricing',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'pricing', component: () => import('pages/PricingPage.vue') }
    ]
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'about', component: () => import('pages/AboutPage.vue') }
    ]
  },
  {
    path: '/contact',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'contact', component: () => import('pages/ContactPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import RegisterView from '../views/RegisterView.vue'
import DefaultLayout from '../layout/DefaultLayout.vue'
import AboutLayout from '../layout/AboutLayout.vue'
import CreateAcaraView from '../views/Acara/CreateAcaraView.vue'
import EditAcaraView from '../views/Acara/EditAcaraView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/home',
    name: 'public',
    component: DefaultLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/CreateAcara',
    name: 'CreateAcara',
    component: CreateAcaraView
  },
  {
    path: '/EditAcara/:id',
    name: 'EditAcara',
    component: EditAcaraView
  },
  {
    path: '/about',
    name: 'publicAbout',
    component: AboutLayout,
    redirect: '/about',
    children: [
      {
        path: '/about',
        name: 'about',
        component: AboutView
      }
    ]
    // path: '/about',
    // name: 'about',
    // component: AboutView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Add navigation guard to check authentication status
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/') // Redirect to login if not authenticated and accessing protected page
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Inicio from '../views/Inicio.vue'
import Instructivos from '../views/Instructivos.vue'
import Inodoros from '../views/Instructivos/Inodoros.vue'
import Herrajes from '../views/Instructivos/Herrajes.vue'
import Griferias from '@/views/Instructivos/Griferias.vue'
import Lavamanos from '@/views/Instructivos/Lavamanos.vue'
import Fichas from '@/views/Fichas.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',         // Lo primero que se ve (Home)
      name: 'login',
      component: Login
    },
    {
      path: '/inicio',         // Ruta para el dashboard
      name: 'inicio',
      component: Inicio
    },
    {
      path: '/instructivos',         // Ruta para los instructivos
      name: 'instructivos',
      component: Instructivos
    },
    {
      path: '/fichas',         // Ruta para las Fichas Técnicas
      name: 'fichas',
      component: Fichas
    },
    {
      path: '/instructivos/inodoros',         // Ruta para los inodoros
      name: 'inodoros',
      component: Inodoros
    },
    {
      path: '/instructivos/herrajes',         // Ruta para los herrajes
      name: 'herrajes',
      component: Herrajes
    },
    {
      path: '/instructivos/griferias',         // Ruta para las griferías
      name: 'griferias',
      component: Griferias
    },
    {
      path: '/instructivos/lavamanos',         // Ruta para los lavamanos
      name: 'lavamanos',
      component: Lavamanos
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0, behavior: 'smooth' }
  }
  
})

export default router
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Inicio from '../views/Inicio.vue'
import Manuales from '../views/Manuales.vue'
import Inodoros from '../views/Manuales/Inodoros.vue'
import Herrajes from '../views/Manuales/Herrajes.vue'
import Griferias from '@/views/Manuales/Griferias.vue'
import Lavamanos from '@/views/Manuales/Lavamanos.vue'
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
      path: '/manuales',         // Ruta para los manuales
      name: 'manuales',
      component: Manuales
    },
    {
      path: '/fichas',         // Ruta para las Fichas Técnicas
      name: 'fichas',
      component: Fichas
    },
    {
      path: '/manuales/inodoros',         // Ruta para los inodoros
      name: 'inodoros',
      component: Inodoros
    },
    {
      path: '/manuales/herrajes',         // Ruta para los herrajes
      name: 'herrajes',
      component: Herrajes
    },
    {
      path: '/manuales/griferias',         // Ruta para las griferías
      name: 'griferias',
      component: Griferias
    },
    {
      path: '/manuales/lavamanos',         // Ruta para los lavamanos
      name: 'lavamanos',
      component: Lavamanos
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0, behavior: 'smooth' }
  }
  
})

export default router
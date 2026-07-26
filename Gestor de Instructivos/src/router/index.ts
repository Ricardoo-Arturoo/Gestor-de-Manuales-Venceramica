import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Inicio from '../views/Inicio.vue'
import Manuales from '../views/Manuales.vue'
import Inodoros from '../views/Manuales/Inodoros.vue'


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
      path: '/manuales/inodoros',         // Ruta para los inodoros
      name: 'inodoros',
      component: Inodoros
    }

  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0, behavior: 'smooth' }
  }
  
})

export default router
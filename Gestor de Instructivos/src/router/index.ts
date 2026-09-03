import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Inicio from '../views/Inicio.vue'
import Instructivos from '../views/Instructivos.vue'
import Inodoros from '../views/Instructivos/Inodoros.vue'
import Herrajes from '../views/Instructivos/Herrajes.vue'
import Griferias from '@/views/Instructivos/Griferias.vue'
import Lavamanos from '@/views/Instructivos/Lavamanos.vue'
import Fichas from '@/views/Fichas.vue'
import Bidet from '@/views/Instructivos/Bidet.vue'
import Urinarios from '@/views/Instructivos/Urinarios.vue'
import Asientos from '@/views/Instructivos/Asientos.vue'
import AccesoriosYRepuestos from '@/views/Instructivos/AccesoriosYRepuestos.vue'
import InodorosFichas from '@/views/Fichas/Inodoros.vue'
import LavamanosFichas from '@/views/Fichas/Lavamanos.vue'
import BidetFichas from '@/views/Fichas/Bidets.vue'
import UrinariosFichas from '@/views/Fichas/Urinarios.vue'
import AsientosFichas from '@/views/Fichas/Asientos.vue'
import HerrajesFichas from '@/views/Fichas/Herrajes.vue'
import GriferiasFichas from '@/views/Fichas/Griferias.vue'
import AccesoriosYRepuestosFichas from '@/views/Fichas/AccesoriosYRepuestos.vue'




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
    {
      path: '/instructivos/bidet',         // Ruta para los bidets
      name: 'bidet',
      component: Bidet
    },
    {
      path: '/instructivos/urinarios',         // Ruta para los urinarios
      name: 'urinarios',
      component: Urinarios
    },
    {
      path: '/instructivos/asientos',         // Ruta para los asientos
      name: 'asientos',
      component: Asientos
    },
    {
      path: '/instructivos/accesorios-y-repuestos',
      name: 'accesorios-y-repuestos',
      component: AccesoriosYRepuestos
    },
    {
      path: '/fichas/inodoros',
      name: 'inodoros-fichas',
      component: InodorosFichas
    },
    {
      path: '/fichas/lavamanos',
      name: 'lavamanos-fichas',
      component: LavamanosFichas
    },
    {
      path: '/fichas/bidets',
      name: 'bidets-fichas',
      component: BidetFichas
    },
    {
      path: '/fichas/urinarios',
      name: 'urinarios-fichas',
      component: UrinariosFichas
    },
    {
      path: '/fichas/asientos',
      name: 'asientos-fichas',
      component: AsientosFichas
    },
    {
      path: '/fichas/herrajes',
      name: 'herrajes-fichas',
      component: HerrajesFichas
    },
    {
      path: '/fichas/griferias',
      name: 'griferias-fichas',
      component: GriferiasFichas
    },
    {
      path: '/fichas/accesorios-y-repuestos',
      name: 'accesorios-y-repuestos-fichas',
      component: AccesoriosYRepuestosFichas
    },
    

  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
  
})

export default router
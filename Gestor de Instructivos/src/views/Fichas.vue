<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import TarjetaCategoria from '../components/TarjetaCategoria.vue'
import fondo from '@/assets/images/Fondo.png'
import ImagenInodoro from '@/assets/images/INODOROS.png'
import ImagenLavamanos from '@/assets/images/LAVAMANOS.png'
import ImagenBidet from '@/assets/images/BIDETS.png'
import ImagenUrinarios from '@/assets/images/URINARIOS.png'
import ImagenAsientos from '@/assets/images/ASIENTOS.png'
import ImagenHerrajes from '@/assets/images/HERRAJES.png'
import ImagenGriferias from '@/assets/images/GRIFERIAS.png'
import ImagenAccesorios from '@/assets/images/ACCESORIOS Y REPUESTOS.png'

const router = useRouter()

const categorias = ref([
  { id: 1, 
    nombre: 'Inodoros',
    imagen: ImagenInodoro,
    subcategorias: [
      { id: 'inodoro-de-dos-piezas', nombre: 'Inodoro de Dos Piezas' },
      { id: 'inodoro-de-una-pieza', nombre: 'Inodoro de Una Pieza' },
    ]
  },
  { id: 2, nombre: 'Lavamanos',
    imagen: ImagenLavamanos,
    subcategorias: [
      { id: 'lavamanos-con-pedestal', nombre: 'Lavamanos con Pedestal' },
      { id: 'lavamanos-para-sobreponer', nombre: 'Lavamanos para Sobreponer' },
      { id: 'lavamanos-para-empotrar', nombre: 'Lavamanos para Empotrar' },
    ]
   },
  { id: 3, nombre: 'Bidet', imagen: ImagenBidet },
  { id: 4, nombre: 'Urinarios', imagen: ImagenUrinarios },
  { id: 5, nombre: 'Asientos', imagen: ImagenAsientos },
  { id: 6, nombre: 'Herrajes', 
    imagen: ImagenHerrajes,
    subcategorias: [
      { id: 'herrajes-para-inodoros-de-dos-piezas', nombre: 'Herrajes para Inodoros de Dos Piezas' },
      { id: 'herrajes-para-inodoros-de-una-pieza', nombre: 'Herrajes para Inodoros de Una Pieza' },
    ]
  },
  { 
    id: 7, 
    nombre: 'Griferias', 
    imagen: ImagenGriferias,
    subcategorias: [
      { id: 'bidet', nombre: 'Para Bidet' },
      { id: 'ducha', nombre: 'Para Ducha' },
      { id: 'lavamanos', nombre: 'Para Lavamanos' },
      { id: 'cocinas', nombre: 'Para Cocinas' },
      { id: 'fluxometros', nombre: 'Fluxómetros' },
      { id: 'llaves-temporizadas', nombre: 'Llaves Temporizadas' }
    ]
  },
  { id: 8, 
    nombre: 'Accesorios y Repuestos', 
    imagen: ImagenAccesorios,
    subcategorias: [
      { id: 'accesorios', nombre: 'Accesorios' },
      { id: 'repuestos', nombre: 'Repuestos' },
    ]
  },
])

const seleccionarCategoria = (nombre) => {
  const rutaFormateada = nombre.toLowerCase().replace(/ /g, '-')
  
  // Lista de rutas válidas
  const rutasActivas = ['inodoros', 'herrajes', 'griferias', 'lavamanos', 'bidets', 'urinarios', 'asientos', 'accesorios-y-repuestos']
  
  // Ajuste para plural de bidet
  const rutaFinal = rutaFormateada === 'bidet' ? 'bidets' : rutaFormateada

  if (rutasActivas.includes(rutaFinal)) {
    router.push(`/fichas/${rutaFinal}`)
  } else {
    alert(`La vista para la categoría "${nombre}" está en construcción.`)
  }
}

// Envía a la ruta correcta adjuntando el hash (#id)
const seleccionarSubcategoria = (nombreCategoria, idSubcategoria) => {
  const rutaFormateada = nombreCategoria.toLowerCase().replace(/ /g, '-')
  const rutaFinal = rutaFormateada === 'bidet' ? 'bidets' : rutaFormateada
  
  router.push({ path: `/fichas/${rutaFinal}`, hash: `#${idSubcategoria}` })
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />
    <main class="flex-1 w-full h-full overflow-y-auto relative">
      <div class="relative w-full bg-cover bg-center bg-no-repeat pt-16 pb-10 px-6 md:px-12 mb-8 animacion-entrada border-b-1 border-venceramica" :style="{ backgroundImage: `url(${fondo})` }">
        <div class="absolute inset-0 bg-black/60"></div>
        <div class="relative z-10">
          <h1 class="font-black text-white tracking-tight text-3xl md:text-4xl lg:text-5xl">Fichas Técnicas</h1>
          <p class="text-gray-200 mt-2 text-lg max-w-2xl">Seleccione una categoría para ver y descargar los documentos disponibles.</p>
        </div>
      </div>
      
      <div class="px-6 md:px-12 pb-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animacion-entrada-retraso">
          <TarjetaCategoria 
            v-for="categoria in categorias" 
            :key="categoria.id" 
            :titulo="categoria.nombre"
            :imagen="categoria.imagen" 
            :subcategorias="categoria.subcategorias"
            subtitulo="Ver instructivos" 
            @click="seleccionarCategoria(categoria.nombre)"
            @click-subcategoria="(idSub) => seleccionarSubcategoria(categoria.nombre, idSub)"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animacion-entrada { opacity: 0; animation: fadeUp 0.8s ease-out forwards; }
.animacion-entrada-retraso { opacity: 0; animation: fadeUp 0.8s ease-out 0.2s forwards; }
@keyframes fadeUp { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
</style>
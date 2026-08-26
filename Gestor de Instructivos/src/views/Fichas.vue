<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import TarjetaCategoria from '../components/TarjetaCategoria.vue'
import fondo from '@/assets/images/Fondo.png'

const router = useRouter()

// Arreglo de categorías con las imágenes dinámicas y subcategorías
const categorias = ref([
  { id: 1, 
    nombre: 'Inodoros',
    imagen: '/img/inodoros.png',
    subcategorias: [
      { id: 'inodoro-de-dos-piezas', nombre: 'Inodoro de Dos Piezas' },
      { id: 'inodoro-de-una-pieza', nombre: 'Inodoro de Una Pieza' },
    ]
  },

  { id: 2, nombre: 'Lavamanos',
    imagen: '/img/lavamanos.png',
    subcategorias: [
      { id: 'lavamanos-con-pedestal', nombre: 'Lavamanos con Pedestal' },
      { id: 'lavamanos-para-sobreponer', nombre: 'Lavamanos para Sobreponer' },
      { id: 'lavamanos-para-empotrar', nombre: 'Lavamanos para Empotrar' },
    ]
   },

  { id: 3, nombre: 'Bidet', imagen: '/img/bidet.png' },
  { id: 4, nombre: 'Urinarios', imagen: '/img/urinarios.png' },
  { id: 5, nombre: 'Asientos', imagen: '/img/asientos.png' },
  { id: 6, nombre: 'Herrajes', 
    imagen: '/img/herrajes.png',
    subcategorias: [
      { id: 'herrajes-para-inodoros-de-dos-piezas', nombre: 'Herrajes para Inodoros de Dos Piezas' },
      { id: 'herrajes-para-inodoros-de-una-pieza', nombre: 'Herrajes para Inodoros de Una Pieza' },
    ]
  },
  { 
    id: 7, 
    nombre: 'Griferias', 
    imagen: null,
    // Subcategorías añadidas para el efecto hover y el scroll
    subcategorias: [
      { id: 'bidet', nombre: 'Para Bidet' },
      { id: 'ducha', nombre: 'Para Ducha' },
      { id: 'lavamanos', nombre: 'Para Lavamanos' },
      { id: 'cocinas', nombre: 'Para Cocinas' },
      { id: 'fluxometros', nombre: 'Fluxómetros' },
      { id: 'llaves-temporizadas', nombre: 'Llaves Temporizadas' }
    ]
  },
  { id: 8, nombre: 'Accesorios', imagen: null },
  { id: 9, nombre: 'Repuestos', imagen: null },
])

// Lógica de redirección al hacer clic en una tarjeta principal
const seleccionarCategoria = (nombre) => {
  console.log(`Abriendo categoría: ${nombre}`)
  if (nombre === 'Inodoros') {
    router.push('/fichas/inodoros')
  }
  else if (nombre === 'Herrajes') {
    router.push('/fichas/herrajes')
  }
  else if (nombre === 'Griferias') {
    router.push('/fichas/griferias')
  }
  else if (nombre === 'Lavamanos') {
    router.push('/fichas/lavamanos')
  }
  else if (nombre === 'Bidet') {
    router.push('/fichas/bidets')
  }
  else if (nombre === 'Urinarios') {
    router.push('/fichas/urinarios')
  }
  else if (nombre === 'Asientos') {
    router.push('/fichas/asientos')
  }
  else if (nombre === 'Accesorios') {
    router.push('/fichas/accesorios')
  }
  else if (nombre === 'Repuestos') {
    router.push('/fichas/repuestos')
  }
  else {
    const rutaFormateada = nombre.toLowerCase().replace(/ /g, '-')
    alert(`La vista para la categoría "${nombre}" está en construcción.`)
  }
}

// Lógica para manejar el clic en una subcategoría específica (deslizamiento)
const seleccionarSubcategoria = (nombreCategoria, idSubcategoria) => {
  if (nombreCategoria === 'Griferias') {
    router.push({ path: '/fichas/griferias', hash: `#${idSubcategoria}` })
  }
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <!-- Componente de navegación lateral -->
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto relative">
      
      <!-- 2. Aplicas la variable de la imagen con un binding de estilo (:style) -->
      <!-- Se redujo el alto cambiando pt-24 pb-16 por pt-16 pb-10 -->
      <div 
        class="relative w-full bg-cover bg-center bg-no-repeat pt-16 pb-10 px-6 md:px-12 mb-8 animacion-entrada border-b-1 border-venceramica"
        :style="{ backgroundImage: `url(${fondo})` }"
      >
        <!-- Overlay oscuro para que el texto resalte -->
        <div class="absolute inset-0 bg-black/60"></div>

        <!-- Contenido del encabezado -->
        <div class="relative z-10">
          <h1 class=" font-black text-white tracking-tight  text-3xl md:text-4xl lg:text-5xl ">
            Fichas Técnicas
          </h1>
          <!-- Reduje también un poco el margen superior del texto (mt-2) -->
          <p class="text-gray-200 mt-2 text-lg max-w-2xl">
            Seleccione una categoría para ver y descargar los documentos disponibles.
          </p>
        </div>
      </div>
      
      <!-- Cuadrícula (Grid) de Categorías -->
      <div class="px-6 md:px-12 pb-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animacion-entrada-retraso">
          <!-- Componente reutilizable de tarjeta -->
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
/* Animaciones de entrada fluidas */
.animacion-entrada {
  opacity: 0;
  animation: fadeUp 0.8s ease-out forwards;
}

.animacion-entrada-retraso {
  opacity: 0;
  animation: fadeUp 0.8s ease-out 0.2s forwards;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
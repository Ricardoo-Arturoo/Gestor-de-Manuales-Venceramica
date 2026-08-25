<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import TarjetaCategoria from '../components/TarjetaCategoria.vue'

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
    router.push('/instructivos/inodoros')
  }
  else if (nombre === 'Herrajes') {
    router.push('/instructivos/herrajes')
  }
  else if (nombre === 'Griferias') {
    router.push('/instructivos/griferias')
  }
  else if (nombre === 'Lavamanos') {
    router.push('/instructivos/lavamanos')
  }
  else if (nombre === 'Bidet') {
    router.push('/instructivos/bidet')
  }
  else if (nombre === 'Urinarios') {
    router.push('/instructivos/urinarios')
  }
  else if (nombre === 'Asientos') {
    router.push('/instructivos/asientos')
  }
  else if (nombre === 'Accesorios') {
    router.push('/instructivos/accesorios')
  }
  else if (nombre === 'Repuestos') {
    router.push('/instructivos/repuestos')
  }
  else {
    const rutaFormateada = nombre.toLowerCase().replace(/ /g, '-')
    alert(`La vista para la categoría "${nombre}" está en construcción.`)
  }
}

// Lógica para manejar el clic en una subcategoría específica (deslizamiento)
const seleccionarSubcategoria = (nombreCategoria, idSubcategoria) => {
  if (nombreCategoria === 'Griferias') {
    router.push({ path: '/instructivos/griferias', hash: `#${idSubcategoria}` })
  }
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <!-- Componente de navegación lateral -->
    <Sidebar />
    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <!-- Encabezado de la página -->
      <div class="mb-10 animacion-entrada">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 tracking-tight">
          Instructivos de Instalación
        </h1>
        <p class="text-gray-500 mt-3 text-lg md:text-xl">
          Seleccione una categoría para ver y descargar los documentos disponibles.
        </p>
      </div>
      
      <!-- Cuadrícula (Grid) de Categorías -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animacion-entrada-retraso">
        <!-- Componente reutilizable de tarjeta con soporte para subcategorías y eventos -->
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
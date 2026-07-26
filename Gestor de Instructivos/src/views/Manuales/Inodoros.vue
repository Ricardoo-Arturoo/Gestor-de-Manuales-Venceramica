<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from "@/components/Sidebar.vue"
import TarjetaCategoria from "@/components/TarjetaCategoria.vue"

const router = useRouter()

// Lista de inodoros de 1 Pieza
const inodorosUnaPieza = ref([
  { id: 1, nombre: 'Sitges', imagen: '/img/inodoro-aqua.png' },
  { id: 2, nombre: 'Rimini Regular', imagen: '/img/inodoro-elegance.png' },
  { id: 3, nombre: 'Rimini Elongado', imagen: '/img/inodoro-premium.png' },
  { id: 4, nombre: 'Rimini Elongado Dual', imagen: '/img/inodoro-premium.png' },
  { id: 5, nombre: 'Vinci', imagen: '/img/inodoro-premium.png' },
  { id: 6, nombre: 'Tiara', imagen: '/img/inodoro-premium.png' },
  { id: 7, nombre: 'Diadema', imagen: '/img/inodoro-premium.png' },
])

// Lista de inodoros de 2 Piezas
const inodorosDosPiezas = ref([
  { id: 8, nombre: 'Valencia', imagen: '/img/inodoro-clasico.png' },
  { id: 9, nombre: 'Coronet', imagen: '/img/inodoro-vento.png' },
  { id: 10, nombre: 'Rorondo', imagen: '/img/inodoro-infantil.png' },
  { id: 11, nombre: 'Savex Regular', imagen: '/img/inodoro-flux.png' },
  { id: 12, nombre: 'Savex Elongado', imagen: '/img/inodoro-flux.png' },
  { id: 13, nombre: 'Prado', imagen: '/img/inodoro-flux.png' },
  { id: 14, nombre: 'Carlton', imagen: '/img/inodoro-flux.png' },
])

// Función para el botón volver
const volverAManuales = () => {
  router.push('/manuales')
}

// Función que se ejecutará al hacer clic en un inodoro
const descargarManual = (nombre) => {
  console.log(`Descargando o abriendo manual de: ${nombre}`)
  // Ejemplo: window.open(`/pdfs/inodoros/${nombre.replace(/ /g, '-').toLowerCase()}.pdf`, '_blank')
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    
    <!-- Mantenemos el Sidebar de navegación -->
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      
      <!-- Botón Volver -->
      <button 
        @click="volverAManuales"
        class="mb-6 hover:cursor-pointer flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors focus:outline-none animacion-entrada"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="font-semibold">Volver a Categorías</span>
      </button>

      <!-- Encabezado de la página -->
      <div class="mb-10 animacion-entrada">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 tracking-tight">
          Manuales de Inodoros
        </h1>
        <p class="text-gray-500 mt-3 text-lg md:text-xl">
          Seleccione el modelo de inodoro para ver o descargar su manual de instalación.
        </p>
      </div>

      <!-- SECCIÓN 1: INODOROS DE 1 PIEZA -->
      <div class="mb-12">
        <!-- Subtítulo de la sección con línea decorativa -->
        <div class="animacion-entrada-retraso mb-6 flex items-center">
          <h2 class="text-2xl font-bold text-gray-700 pr-4">Inodoros de 1 Pieza</h2>
          <div class="flex-grow h-px bg-red-200"></div>
        </div>

        <!-- Cuadrícula de 1 Pieza -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animacion-entrada-retraso">
          <TarjetaCategoria 
            v-for="inodoro in inodorosUnaPieza" 
            :key="inodoro.id"
            :titulo="inodoro.nombre"
            :imagen="inodoro.imagen"
            subtitulo="Descargar PDF"
            @click="descargarManual(inodoro.nombre)"
          />
        </div>
      </div>

      <!-- SECCIÓN 2: INODOROS DE 2 PIEZAS -->
      <div class="mb-8">
        <!-- Subtítulo de la sección con línea decorativa -->
        <div class="animacion-entrada-retraso mb-6 flex items-center">
          <h2 class="text-2xl font-bold text-gray-700 pr-4">Inodoros de 2 Piezas</h2>
          <div class="flex-grow h-px bg-red-200"></div>
        </div>

        <!-- Cuadrícula de 2 Piezas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animacion-entrada-retraso">
          <TarjetaCategoria 
            v-for="inodoro in inodorosDosPiezas" 
            :key="inodoro.id"
            :titulo="inodoro.nombre"
            :imagen="inodoro.imagen"
            subtitulo="Descargar PDF"
            @click="descargarManual(inodoro.nombre)"
          />
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* Mantenemos las animaciones fluidas */
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
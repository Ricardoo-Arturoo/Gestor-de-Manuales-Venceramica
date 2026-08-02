<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  rutaVolver: { type: String, default: '/manuales' }
})

const volver = (ruta) => {
  router.push(ruta)
}
</script>

<template>
  <div>
    <button 
      @click="volver(rutaVolver)"
      class="mb-6 hover:cursor-pointer flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors focus:outline-none animacion-entrada"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span class="font-semibold">Volver a Categorías</span>
    </button>

    <div class="mb-10 animacion-entrada">
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 tracking-tight">
        {{ titulo }}
      </h1>
      <p class="text-gray-500 mt-3 text-lg md:text-xl">
        {{ descripcion }}
      </p>
    </div>
  </div>
</template>
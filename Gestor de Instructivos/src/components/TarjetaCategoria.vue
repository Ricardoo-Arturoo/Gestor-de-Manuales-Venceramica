<template>
  <!-- 
    El contenedor ahora SOLO reacciona a la variable 'menuAbierto'.
    Se establecen alturas mínimas explícitas (104px base a 240px abierto) 
    para que la transición de tamaño sea fluida y calculada.
  -->
  <div 
    class="relative w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#CE1126]/30 transition-all duration-500 ease-in-out overflow-hidden"
    :class="menuAbierto && tieneSubcategorias ? 'min-h-[240px] shadow-xl border-[#CE1126]/30' : 'min-h-[104px]'"
  >
    
    <!-- CARA FRONTAL: Contenido principal -->
    <div 
      @click="manejarClicPrincipal"
      class="absolute inset-0 w-full p-6 flex items-center space-x-4 text-left cursor-pointer focus:outline-none"
    >
      <div class="flex-shrink-0 w-14 h-14 bg-[#CE1126]/10 text-[#CE1126] rounded-xl flex items-center justify-center transition-colors duration-300"
           :class="{ 'bg-[#AB1A2D] text-white': menuAbierto }">
        <slot name="icono">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </slot>
      </div>

      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 transition-colors"
            :class="{ 'text-[#AB1A2D]': menuAbierto }">
          {{ titulo }}
        </h3>
        <p class="text-sm text-gray-400 mt-1">{{ subtitulo }}</p>
      </div>

      <!-- Botón "+" universal para abrir subcategorías (PC y Móvil) -->
      <button 
        v-if="tieneSubcategorias"
        @click.stop="toggleMenu"
        class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#CE1126] transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE1126] z-10 relative"
        aria-label="Ver subcategorías"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-500" :class="{ 'rotate-45 text-[#CE1126]': menuAbierto }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- CARA TRASERA: Submenú -->
    <div 
      class="absolute inset-0 bg-[#CE1126] text-white p-4 flex flex-col transition-transform duration-500 ease-in-out z-20"
      :class="menuAbierto ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="flex justify-between items-center border-b border-white/20 pb-2 mb-2">
        <h4 class="font-bold text-sm uppercase tracking-wide">
          {{ titulo }}
        </h4>
        <!-- Botón para cerrar (visible en PC y móvil) -->
        <button @click.stop="menuAbierto = false" class="text-white/70 hover:text-white transition-colors p-1">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Lista con scroll interno -->
      <div class="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        <button 
          v-for="sub in subcategorias" 
          :key="sub.id"
          @click.stop="manejarClicSubcategoria(sub.id)"
          class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/20 hover:pl-4 transition-all duration-200"
        >
          • {{ sub.nombre }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  subtitulo: {
    type: String,
    default: 'Ver más'
  },
  subcategorias: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['click', 'click-subcategoria'])

// Variable reactiva
const menuAbierto = ref(false)

const tieneSubcategorias = computed(() => {
  return props.subcategorias && props.subcategorias.length > 0
})

// Un solo controlador para abrir/cerrar desde el botón '+'
const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

// Clics en la tarjeta y subcategorías
const manejarClicPrincipal = () => {
  emit('click')
}

const manejarClicSubcategoria = (id) => {
  emit('click-subcategoria', id)
  menuAbierto.value = false 
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5); 
  border-radius: 4px;
}
</style>
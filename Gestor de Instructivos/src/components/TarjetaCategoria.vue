<template>
  <button 
    @click="$emit('click')"
    class="group w-full hover:cursor-pointer bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#CE1126]/30 hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4 text-left focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:ring-offset-2"
  >
    <!-- Ícono de la tarjeta -->
    <div class="flex-shrink-0 w-14 h-14 bg-[#CE1126]/10 text-[#CE1126] rounded-xl flex items-center justify-center group-hover:bg-[#AB1A2D] group-hover:text-white transition-colors duration-300">
      <!-- Usamos un slot por si en otra página quieres pasar un SVG diferente -->
      <slot name="icono">
        <!-- Ícono por defecto (Libro/Manual) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </slot>
    </div>

    <!-- Texto de la tarjeta -->
    <div>
      <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#AB1A2D] transition-colors">
        {{ titulo }}
      </h3>
      <p class="text-sm text-gray-400 mt-1">{{ subtitulo }}</p>
    </div>
  </button>
</template>

<script setup>
// Definimos las propiedades que este componente puede recibir
defineProps({
  titulo: {
    type: String,
    required: true
  },
  subtitulo: {
    type: String,
    default: 'Ver más' // Si no le pasas subtítulo, dirá "Ver más"
  }
})

// Declaramos que este componente puede emitir un evento 'click'
defineEmits(['click'])
</script>
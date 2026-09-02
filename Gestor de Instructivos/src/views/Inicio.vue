<script setup>
// Importamos el componente Sidebar (Subimos un nivel con '../' y entramos a components)
import Sidebar from '../components/Sidebar.vue'
import imagenInicio from '@/assets/images/IMG_INICIO.jpg'

</script>

<template>
  <!-- Contenedor principal que ocupa toda la pantalla (flexbox) -->
  <div class="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
   
    <!-- Inyectamos nuestro componente Sidebar -->
    <Sidebar />

    <!-- CONTENIDO PRINCIPAL: Ocupa el 80% en PC (flex-1 rellena el espacio restante) -->
    <main class="flex-1 relative w-full h-full">
     
      <!-- Imagen de Fondo con efecto de desvanecido -->
      <div
        class="absolute inset-0 bg-cover bg-center imagen-desvanecida"
        :style="{ backgroundImage: `url(${imagenInicio})` }"
      ></div>

      <!-- Capa Transparente Oscura (Overlay) para que el texto se lea bien -->
      <!-- También le agregamos un ligero retraso a la capa oscura para un efecto más profesional -->
      <div class="absolute inset-0 bg-black/60 capa-desvanecida"></div>

      <!-- Textos Centrados con efecto de entrada -->
      <div class="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center texto-desvanecido">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
          Bienvenido
        </h1>
        <p class="text-2xl md:text-4xl text-gray-200 font-light drop-shadow-lg">
          Gracias por su compra
        </p>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* 1. Animación principal: Desvanecido de la imagen (Dura 2 segundos) */
.imagen-desvanecida {
  opacity: 0;
  animation: fadeIn 2s ease-in-out forwards;
}

/* 2. Animación de la capa oscura: Mismo efecto pero sincronizado */
.capa-desvanecida {
  opacity: 0;
  animation: fadeIn 2s ease-in-out forwards;
}

/* 3. Animación de los textos: Aparecen medio segundo después (retraso) para que la imagen se luzca primero */
.texto-desvanecido {
  opacity: 0;
  transform: translateY(20px); /* Le da un ligero movimiento de abajo hacia arriba */
  animation: fadeUp 1.5s ease-out 0.5s forwards;
}

/* --- Definición de los fotogramas (Keyframes) --- */

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import TarjetaCategoria from '../components/TarjetaCategoria.vue'

const router = useRouter()

// Arreglo de categorías con las imágenes dinámicas
const categorias = ref([
  { id: 1, nombre: 'Inodoros', imagen: '/img/inodoros.png' },
  { id: 2, nombre: 'Lavamanos', imagen: '/img/lavamanos.png' },
  { id: 3, nombre: 'Bidet y Urinarios', imagen: '/img/bidet.png' },
  { id: 4, nombre: 'Herrajes', imagen: '/img/herrajes.png' },
  { id: 5, nombre: 'Asientos', imagen: '/img/asientos.png' },
  { id: 6, nombre: 'Otros', imagen: null } 
])

// Lógica de redirección al hacer clic en una tarjeta
const seleccionarCategoria = (nombre) => {
  console.log(`Abriendo categoría: ${nombre}`)
  
  if (nombre === 'Inodoros') {
    // Redirige a la vista que acabamos de crear
    router.push('/manuales/inodoros')
  } 
  else if (nombre === 'Herrajes') {
    router.push('/manuales/herrajes')
  }
  else {
    // Para las demás categorías, creamos una ruta dinámica. 
    // Ejemplo: "Bidet y Urinarios" se convierte en "bidet-y-urinarios"
    const rutaFormateada = nombre.toLowerCase().replace(/ y /g, '-y-').replace(/ /g, '-')
    
    // Descomenta la siguiente línea cuando vayas creando las demás vistas:
    // router.push(`/manuales/${rutaFormateada}`)
    
    // Mientras tanto, un pequeño aviso para pruebas:
    alert(`La vista para la categoría "${nombre}" está en construcción.`)
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
          Manuales de Instalación
        </h1>
        <p class="text-gray-500 mt-3 text-lg md:text-xl">
          Seleccione una categoría para ver y descargar los documentos disponibles.
        </p>
      </div>

      <!-- Cuadrícula (Grid) de Categorías -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animacion-entrada-retraso">
        
        <!-- Componente reutilizable de tarjeta -->
        <TarjetaCategoria 
          v-for="categoria in categorias" 
          :key="categoria.id"
          :titulo="categoria.nombre"
          :imagen="categoria.imagen"
          subtitulo="Ver manuales"
          @click="seleccionarCategoria(categoria.nombre)"
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
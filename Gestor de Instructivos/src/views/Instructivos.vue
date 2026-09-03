<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import TarjetaCategoria from '../components/TarjetaCategoria.vue'
import fondoPoceta from '@/assets/images/Poceta.png'
import ImagenInodoro from '@/assets/images/INODOROS.png'
import ImagenLavamanos from '@/assets/images/LAVAMANOS.png'
import ImagenBidet from '@/assets/images/BIDETS.png'
import ImagenUrinarios from '@/assets/images/URINARIOS.png'
import ImagenAsientos from '@/assets/images/ASIENTOS.png'
import ImagenHerrajes from '@/assets/images/HERRAJES.png'
import ImagenGriferias from '@/assets/images/GRIFERIAS.png'
import ImagenAccesorios from '@/assets/images/ACCESORIOS Y REPUESTOS.png'


const router = useRouter()

// Arreglo de categorías con las imágenes dinámicas y subcategorías
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
  { id: 8, 
    nombre: 'Accesorios y Repuestos', 
    imagen: ImagenAccesorios,
    subcategorias: [
      { id: 'accesorios', nombre: 'Accesorios' },
      { id: 'repuestos', nombre: 'Repuestos' },
    ]
  },
])

// Lógica dinámica de redirección al hacer clic en una tarjeta principal
const seleccionarCategoria = (nombre) => {
  console.log(`Abriendo categoría: ${nombre}`)
  
  // Convierte el nombre a un formato de URL (ej: "Inodoros" -> "inodoros", "Otras Cosas" -> "otras-cosas")
  const rutaFormateada = nombre.toLowerCase().replace(/ /g, '-')
  
  // Lista de rutas que sabemos que existen y están activas en /instructivos/
  const rutasActivas = [
    'inodoros', 'herrajes', 'griferias', 'lavamanos', 
    'bidet', 'urinarios', 'asientos', 'accesorios-y-repuestos'
  ]

  if (rutasActivas.includes(rutaFormateada)) {
    router.push(`/instructivos/${rutaFormateada}`)
  } else {
    alert(`La vista para la categoría "${nombre}" está en construcción.`)
  }
}

// Lógica dinámica para manejar el clic en cualquier subcategoría específica (deslizamiento)
const seleccionarSubcategoria = (nombreCategoria, idSubcategoria) => {
  const rutaFormateada = nombreCategoria.toLowerCase().replace(/ /g, '-')
  
  // Navega a la ruta base de la categoría adjuntando el hash (#) de la subcategoría
  router.push({ path: `/instructivos/${rutaFormateada}`, hash: `#${idSubcategoria}` })
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
        :style="{ backgroundImage: `url(${fondoPoceta})` }"
      >
        <!-- Overlay oscuro para que el texto resalte -->
        <div class="absolute inset-0 bg-black/60"></div>

        <!-- Contenido del encabezado -->
        <div class="relative z-10">
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight lg:text-5xl">
            Instructivos de Instalación
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
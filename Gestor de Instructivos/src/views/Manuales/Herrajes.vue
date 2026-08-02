<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"

// 1. Estados
const herrajesTanque = ref([])
const fluxometros = ref([])
const repuestos = ref([])
const cargando = ref(true)

// 2. Fetch a la base de datos
const cargarHerrajes = async () => {
  try {
    // 🔥 AQUÍ ESTÁ EL CAMBIO: Ahora llamamos a la ruta dinámica apuntando a la categoría 'Herrajes'
    const respuesta = await fetch('http://localhost:3000/api/productos/Herrajes')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    // Filtramos según la columna "tipo" en tu base de datos
    herrajesTanque.value = datosObtenidos.filter(h => h.tipo === 'Tanque')
    fluxometros.value = datosObtenidos.filter(h => h.tipo === 'Fluxómetro')
    repuestos.value = datosObtenidos.filter(h => h.tipo === 'Repuesto')

  } catch (error) {
    console.error('Error cargando los herrajes:', error)
    alert('Hubo un problema cargando los productos.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarHerrajes()
})

// 3. Lógica de descarga
const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) {
    alert("Este producto aún no tiene un manual asignado.")
    return
  }
  window.open(`http://localhost:3000/api/descargar/${archivoPdf}`, '_blank')
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      
      <!-- Componente Header (Incluye botón volver, título y texto) -->
      <HeaderVista 
        titulo="Manuales de Herrajes" 
        descripcion="Seleccione el modelo de herraje o fluxómetro para ver o descargar su manual."
      />

      <!-- Componente de Carga -->
      <Cargador v-if="cargando" mensaje="Cargando herrajes..." />

      <!-- Contenido (Solo se muestra si ya cargó) -->
      <div v-else>
        
        <!-- Reutilizamos el componente de Sección para cada tipo de herraje -->
        <SeccionTarjetas 
          tituloSeccion="Herrajes para Tanques" 
          :productos="herrajesTanque" 
          @descargar="procesarDescarga" 
        />

        <SeccionTarjetas 
          tituloSeccion="Fluxómetros" 
          :productos="fluxometros" 
          @descargar="procesarDescarga" 
        />

        <SeccionTarjetas 
          tituloSeccion="Repuestos" 
          :productos="repuestos" 
          @descargar="procesarDescarga" 
        />

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Solo necesitamos estas animaciones globales aquí si los subcomponentes las usan directamente, 
   o puedes pasarlas a tu archivo global de CSS/Tailwind para no repetirlas */
.animacion-entrada {
  opacity: 0;
  animation: fadeUp 0.8s ease-out forwards;
}

.animacion-entrada-retraso {
  opacity: 0;
  animation: fadeUp 0.8s ease-out 0.2s forwards;
}

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
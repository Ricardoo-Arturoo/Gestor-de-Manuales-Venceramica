<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"

// 1. Iniciamos los arreglos vacíos y agregamos un estado de carga
const inodorosUnaPieza = ref([])
const inodorosDosPiezas = ref([])
const cargando = ref(true)

// 2. Función para buscar los inodoros en la base de datos
const cargarInodoros = async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/api/inodoros')
    
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    // 3. Filtramos los resultados según el tipo
    inodorosUnaPieza.value = datosObtenidos.filter(inodoro => inodoro.tipo === '1 Pieza')
    inodorosDosPiezas.value = datosObtenidos.filter(inodoro => inodoro.tipo === '2 Piezas')

  } catch (error) {
    console.error('Error cargando los inodoros:', error)
    alert('Hubo un problema cargando los productos.')
  } finally {
    cargando.value = false
  }
}

// 4. Ejecutamos la función al cargar la pantalla
onMounted(() => {
  cargarInodoros()
})

// 5. Función de descarga
const descargarManual = (archivoPdf) => {
  if (!archivoPdf) {
    alert("Este producto aún no tiene un manual asignado en la base de datos.")
    return
  }
  
  console.log(`Descargando manual: ${archivoPdf}`)
  window.open(`http://localhost:3000/api/descargar/${archivoPdf}`, '_blank')
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      
      <!-- Componente Header (Sustituye al botón volver, título y descripción) -->
      <HeaderVista 
        titulo="Manuales de Inodoros" 
        descripcion="Seleccione el modelo de inodoro para ver o descargar su manual de instalación."
      />

      <!-- MIENTRAS ESTÁ CARGANDO -->
      <Cargador v-if="cargando" mensaje="Cargando manuales..." />

      <!-- CUANDO YA CARGARON LOS DATOS -->
      <div v-else>
        
        <!-- SECCIÓN 1: INODOROS DE 1 PIEZA -->
        <SeccionTarjetas 
          tituloSeccion="Inodoros de 1 Pieza" 
          :productos="inodorosUnaPieza" 
          @descargar="descargarManual" 
        />

        <!-- SECCIÓN 2: INODOROS DE 2 PIEZAS -->
        <SeccionTarjetas 
          tituloSeccion="Inodoros de 2 Piezas" 
          :productos="inodorosDosPiezas" 
          @descargar="descargarManual" 
        />

      </div>

    </main>
  </div>
</template>

<style scoped>
/* Puedes mantener estas animaciones aquí, o moverlas a tu archivo CSS global (ej: style.css o main.css) 
   para no tener que pegarlas en cada vista. */
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
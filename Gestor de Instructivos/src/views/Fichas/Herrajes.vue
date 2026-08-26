<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" // <-- Importamos nuestro nuevo súper componente

const HerrajesParaInodorosDeDosPiezas = ref([])
const HerrajesParaInodorosDeUnaPieza = ref([])
const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') // Guardará si es Tanque, Fluxómetro o Repuesto

const cargarHerrajes = async () => {
  try {
    const respuesta = await fetch('https://api.instructivos.venceramica.com/api/productos/Herrajes')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    HerrajesParaInodorosDeDosPiezas.value = datosObtenidos.filter(h => h.tipo === 'Herrajes para Inodoros de Dos Piezas'&& h.clasificacion === 'Ficha')
    HerrajesParaInodorosDeUnaPieza.value = datosObtenidos.filter(h => h.tipo === 'Herrajes para Inodoros de Una Pieza'&& h.clasificacion === 'Ficha')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = localStorage.getItem('usuarioLogueado')
  if (usuario) esAdmin.value = true 
  cargarHerrajes()
})

const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) return alert("Este producto aún no tiene un instructivo asignado.")
  window.open(`https://api.instructivos.venceramica.com/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su instructivo?')) {
    try {
      await fetch(`https://api.instructivos.venceramica.com/api/productos/${id}`, { method: 'DELETE' })
      HerrajesParaInodorosDeDosPiezas.value = HerrajesParaInodorosDeDosPiezas.value.filter(item => item.id !== id)
      HerrajesParaInodorosDeUnaPieza.value = HerrajesParaInodorosDeUnaPieza.value.filter(item => item.id !== id)
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

const editarProducto = (producto) => {
  console.log("Editar:", producto.nombre)
}

// Abrir modal y asignar el tipo correcto según la sección
const abrirFormularioAgregar = (seccion) => {
  if (seccion === 'Herrajes para Inodoros de Dos Piezas') tipoSeleccionadoParaModal.value = 'Herrajes para Inodoros de Dos Piezas'
  else if (seccion === 'Herrajes para Inodoros de Una Pieza') tipoSeleccionadoParaModal.value = 'Herrajes para Inodoros de Una Pieza'
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />
    

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Fichas Técnicas de Herrajes" descripcion="Seleccione el modelo de herraje para descargar su ficha." rutaVolver="/fichas"/>

      <Cargador v-if="cargando" mensaje="Cargando herrajes..." />

      <div v-else>
        <SeccionTarjetas 
          tituloSeccion="Herrajes para Inodoros de Dos Piezas" 
          :productos="HerrajesParaInodorosDeDosPiezas" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
        />

        <SeccionTarjetas 
          tituloSeccion="Herrajes para Inodoros de Una Pieza" 
          :productos="HerrajesParaInodorosDeUnaPieza" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />
      </div>
    </main>

    <!-- Usamos nuestro componente Modal reutilizable -->
    <ModalAgregarProducto 
      :mostrar="mostrarModal"
      categoria="Herrajes"
      :tipo="tipoSeleccionadoParaModal"
      @cerrar="mostrarModal = false"
      @guardado="cargarHerrajes"
    />

  </div>
</template>
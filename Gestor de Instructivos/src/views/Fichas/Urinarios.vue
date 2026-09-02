<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" // <-- Importamos nuestro nuevo súper componente
import imgUrinarios from '@/assets/images/URINARIOS.png'

const urinarios = ref([])
const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') // Guardará si es Tanque, Fluxómetro o Repuesto
const clasificacionSeleccionadaParaModal = ref('Ficha') 

const cargarUrinarios = async () => {
  try {
    const respuesta = await fetch('https://api.instructivos.venceramica.com/api/productos/Urinarios')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    urinarios.value = datosObtenidos.filter(h => h.clasificacion === 'Ficha')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = localStorage.getItem('usuarioLogueado')
  if (usuario) esAdmin.value = true 
  cargarUrinarios()
})

const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) return alert("Este producto aún no tiene un instructivo asignado.")
  window.open(`https://api.instructivos.venceramica.com/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su instructivo?')) {
    try {
      await fetch(`https://api.instructivos.venceramica.com/api/productos/${id}`, { method: 'DELETE' })
      urinarios.value = urinarios.value.filter(item => item.id !== id)
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
  if (seccion === 'urinarios') tipoSeleccionadoParaModal.value = 'Urinarios'
  clasificacionSeleccionadaParaModal.value = 'Ficha'
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Fichas Técnicas de Urinarios" descripcion="Seleccione el modelo de urinario para descargar su ficha." rutaVolver="/fichas" />

      <Cargador v-if="cargando" mensaje="Cargando Urinarios..." />

      <div v-else>
        <SeccionTarjetas 
          tituloSeccion="Urinarios" 
          :productos="urinarios" 
          :estaLogueado="esAdmin"
          :imagen="imgUrinarios"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
        />
      </div>
    </main>

    <!-- Usamos nuestro componente Modal reutilizable -->
    <ModalAgregarProducto 
      :mostrar="mostrarModal"
      categoria="Urinarios"
      :tipo="tipoSeleccionadoParaModal"
      :clasificacion-inicial="clasificacionSeleccionadaParaModal"
      @cerrar="mostrarModal = false"
      @guardado="cargarUrinarios"
    />

  </div>
</template>
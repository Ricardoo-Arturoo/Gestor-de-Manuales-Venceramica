<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" // <-- Importamos nuestro nuevo súper componente
import imgLavamanos from '@/assets/images/LAVAMANOS.png'

const LavamanosConPedestal = ref([])
const LavamanosParaSobreponer = ref([])
const LavamanosParaEmpotrar = ref([])
const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') // Guardará si es Tanque, Fluxómetro o Repuesto

const cargarLavamanos = async () => {
  try {
    const respuesta = await fetch('https://api.instructivos.venceramica.com/api/productos/Lavamanos')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    LavamanosConPedestal.value = datosObtenidos.filter(h => h.tipo === 'Lavamanos con Pedestal'&& h.clasificacion === 'Instructivo')
    LavamanosParaSobreponer.value = datosObtenidos.filter(h => h.tipo === 'Lavamanos para Sobreponer'&& h.clasificacion === 'Instructivo')
    LavamanosParaEmpotrar.value = datosObtenidos.filter(h => h.tipo === 'Lavamanos para Empotrar'&& h.clasificacion === 'Instructivo')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = localStorage.getItem('usuarioLogueado')
  if (usuario) esAdmin.value = true 
  cargarLavamanos()
})

const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) return alert("Este producto aún no tiene un instructivo asignado.")
  window.open(`https://api.instructivos.venceramica.com/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su instructivo?')) {
    try {
      await fetch(`https://api.instructivos.venceramica.com/api/productos/${id}`, { method: 'DELETE' })
      LavamanosConPedestal.value = LavamanosConPedestal.value.filter(item => item.id !== id)
      LavamanosParaSobreponer.value = LavamanosParaSobreponer.value.filter(item => item.id !== id)
      LavamanosParaEmpotrar.value = LavamanosParaEmpotrar.value.filter(item => item.id !== id)
    } catch (error) {
      console.error("Error:", error)
    }
  }
}


// Abrir modal y asignar el tipo correcto según la sección
const abrirFormularioAgregar = (seccion) => {
  if (seccion === 'Lavamanos con Pedestal') tipoSeleccionadoParaModal.value = 'Lavamanos con Pedestal'
  else if (seccion === 'Lavamanos para Empotrar') tipoSeleccionadoParaModal.value = 'Lavamanos para Empotrar'
  else if (seccion === 'Lavamanos para Sobreponer') tipoSeleccionadoParaModal.value = 'Lavamanos para Sobreponer'
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />
    

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Instructivos de Lavamanos" descripcion="Seleccione el modelo de lavamanos para descargar su instructivo." />

      <Cargador v-if="cargando" mensaje="Cargando Lavamanos..." />

      <div v-else>
        <SeccionTarjetas 
          tituloSeccion="Lavamanos con Pedestal" 
          :productos="LavamanosConPedestal" 
          :estaLogueado="esAdmin"
          :imagen="imgLavamanos"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
        />

        <SeccionTarjetas 
          tituloSeccion="Lavamanos para Sobreponer" 
          :productos="LavamanosParaSobreponer" 
          :estaLogueado="esAdmin"
          :imagen="imgLavamanos"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />

        <SeccionTarjetas 
          tituloSeccion="Lavamanos para Empotrar" 
          :productos="LavamanosParaEmpotrar" 
          :estaLogueado="esAdmin"
          :imagen="imgLavamanos"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />
      </div>
    </main>

    <!-- Usamos nuestro componente Modal reutilizable -->
    <ModalAgregarProducto 
      :mostrar="mostrarModal"
      categoria="Lavamanos"
      :tipo="tipoSeleccionadoParaModal"
      @cerrar="mostrarModal = false"
      @guardado="cargarLavamanos"
    />

  </div>
</template>
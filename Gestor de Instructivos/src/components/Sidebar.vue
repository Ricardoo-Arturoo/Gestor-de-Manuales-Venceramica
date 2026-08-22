<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const router = useRouter()

// Variables reactivas para el estado de la sesión
const isLoggedIn = ref(false)
const nombreUsuario = ref('')

// Se ejecuta al cargar el Sidebar
onMounted(() => {
  // CORRECCIÓN: Usamos 'usuarioLogueado' que es la llave que usamos en el resto de la app
  const dataUsuario = localStorage.getItem('usuarioLogueado')
  
  if (dataUsuario) {
    // Si existe, activamos la sesión
    isLoggedIn.value = true
    
    try {
      // Intentamos leer el objeto (si guardaste { name: "Juan", ... } en el login)
      const user = JSON.parse(dataUsuario)
      nombreUsuario.value = user.name || 'Administrador'
    } catch (e) {
      // Si en el login guardaste solo un texto (ej: "true"), mostramos "Administrador" por defecto
      nombreUsuario.value = 'Administrador'
    }
  } else {
    // Si no existe (entró como invitado)
    isLoggedIn.value = false
  }
})

// Función para cerrar la sesión
const cerrarSesion = () => {
  isOpen.value = false // Cierra el menú en móviles
  
  // 1. Borramos los datos del usuario usando LA MISMA LLAVE
  localStorage.removeItem('usuarioLogueado')
  isLoggedIn.value = false
  nombreUsuario.value = ''
  
  // 2. Redirigimos de vuelta a la pantalla de Login
  router.push('/')
}
</script>

<template>
  <!-- Botón de Hamburguesa (Solo visible en móviles) con Pantone 186 -->
  <button 
    @click="isOpen = !isOpen" 
    class="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#CE1126] text-white rounded-md shadow-md focus:outline-none hover:bg-[#AB1A2D] transition-colors"
  >
    <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Fondo oscuro con EFECTO BORROSO para móviles -->
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      @click="isOpen = false" 
      class="fixed inset-0 bg-black/40 backdrop-blur-md z-30 md:hidden"
    ></div>
  </Transition>

  <!-- Contenedor Lateral (Sidebar) -->
  <aside 
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    class="fixed inset-y-0 left-0 z-40 w-64 md:w-[20%] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out md:translate-x-0 md:static flex flex-col h-screen"
  >

    <!-- Cabecera con Pantone 186 -->
    <div class="bg-[#CE1126] flex items-center justify-center h-20 md:h-24 overflow-hidden shadow-md px-4 pl-14 md:pl-4">
      <img 
        src="../assets/logoVenceramica-removebg-preview.png" 
        alt="Logo Venceramica" 
        class="h-full w-auto max-h-16 object-contain scale-225 drop-shadow-md mb-3" 
      />
    </div>

    <!-- Enlaces de Navegación Principales -->
    <nav class="flex-1 px-4 py-8 space-y-4 overflow-y-auto">

      <!-- Enlace a Inicio -->
      <router-link 
        to="/inicio" 
        @click="isOpen = false"
        class="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-[#AB1A2D] transition-all font-semibold text-lg"
        active-class="bg-red-50 text-[#CE1126]"
      >
        Inicio
      </router-link>
      
      <!-- Enlace a Manuales -->
      <router-link 
        to="/manuales" 
        @click="isOpen = false"
        class="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-[#AB1A2D] transition-all font-semibold text-lg"
        active-class="bg-red-50 text-[#CE1126]"
      >
        Manuales
      </router-link>

      <!-- Enlace a Fichas -->
      <router-link 
        to="/fichas" 
        @click="isOpen = false"
        class="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-[#AB1A2D] transition-all font-semibold text-lg"
        active-class="bg-red-50 text-[#CE1126]"
      >
        Fichas
      </router-link>
      
    </nav>

    <!-- Zona Inferior (Web y Login/Logout) -->
    <div class="px-4 py-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
      
      <!-- Enlace a la Web Externa -->
      <a 
        href="https://venceramica.com" 
        target="_blank" 
        rel="noopener noreferrer"
        @click="isOpen = false"
        class="flex items-center px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all font-semibold text-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        Sitio Web Oficial
      </a>

      <!-- SI EL USUARIO ENTRÓ COMO INVITADO -->
      <router-link 
        v-if="!isLoggedIn"
        to="/" 
        @click="isOpen = false"
        class="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-800 hover:text-white transition-all font-semibold text-md bg-white border border-gray-200 shadow-sm"
        active-class="bg-gray-800 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Iniciar Sesión
      </router-link>

      <!-- SI EL USUARIO INICIÓ SESIÓN (Usa Pantone 186 al hacer hover y Pantone 187 como acento profundo) -->
      <button 
        v-else
        @click="cerrarSesion"
        class="w-full flex items-center px-4 py-3 rounded-xl text-gray-600 hover:cursor-pointer bg-white border border-gray-200 shadow-sm hover:bg-[#CE1126] hover:text-white hover:border-[#CE1126] transition-all font-semibold text-md text-left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="truncate">Cerrar Sesión ({{ nombreUsuario }})</span>
      </button>
      
    </div>
  </aside>
</template>


<style scoped>
/* Transición suave para la aparición del efecto borroso y la capa oscura */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  // Limpiamos mensajes anteriores
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    // Hacemos la petición al Backend
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      // Guardamos la sesión en localStorage
      localStorage.setItem('usuarioLogueado', JSON.stringify({
        name: data.user.name,
        role: data.user.role,
        email: data.user.email
      }))

      if (data.user.role === 'admin') {
        successMessage.value = `¡Acceso concedido! Bienvenido Administrador: ${data.user.name}`
      } else {
        successMessage.value = `¡Acceso concedido! Bienvenido ${data.user.name}`
      }

      // Redirigimos a Inicio después de medio segundo
      setTimeout(() => {
        router.push('/inicio')
      }, 500)

    } else {
      // Si la contraseña es incorrecta o no existe el correo
      errorMessage.value = data.message || 'Error al iniciar sesión'
    }
  } catch (error) {
    // Si el servidor Node.js está apagado
    errorMessage.value = 'Error de conexión con el servidor.'
  } finally {
    isLoading.value = false
  }
}

const handleGuest = () => {
  errorMessage.value = ''
  successMessage.value = 'Entrando como invitado... redirigiendo.'
  
  // Limpiamos la clave 'usuarioLogueado'
  localStorage.removeItem('usuarioLogueado')
  
  setTimeout(() => {
    router.push('/inicio')
  }, 500)
}
</script>

<template>
  <div class="flex flex-col-reverse md:flex-row min-h-screen font-sans">
    
    <!-- LADO IZQUIERDO: Login -->
    <div class="w-full md:w-[40%] bg-white flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
      <div class="max-w-md w-full mx-auto">
        
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
        <p class="text-gray-500 mb-8">Por favor, ingresa a tu cuenta o entra como invitado.</p>

        <!-- Mensajes de Alerta -->
        <div v-if="errorMessage" class="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {{ successMessage }}
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-900">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              v-model="email"
              placeholder="tu@correo.com"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-colors"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-900">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              v-model="password"
              placeholder="••••••••"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-colors"
              required
            />
          </div>

          <!-- Botón de Iniciar Sesión con Pantone 186 y hover en Pantone 187 -->
          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full hover:cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#CE1126] hover:bg-[#AB1A2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CE1126] transition-colors disabled:bg-red-300"
          >
            {{ isLoading ? 'Verificando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="mt-8 flex items-center ">
          <div class="flex-grow border-t border-gray-300 "></div>
          <span class="flex-shrink-0 px-4 text-sm text-gray-500">O continuar sin cuenta</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Botón de Invitado -->
        <button 
          @click="handleGuest"
          type="button" 
          class="mt-6 hover:cursor-pointer w-full flex justify-center py-3 px-4 border-2 border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
        >
          Entrar como Invitado
        </button>
      </div>
    </div>

    <!-- LADO DERECHO: Venceramica con Degradado de los dos Pantone -->
    <div class="w-full md:w-[60%] bg-gradient-to-br from-[#CE1126] to-[#AB1A2D] flex items-center justify-center p-12 min-h-[30vh] md:min-h-screen">
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight text-center drop-shadow-lg">
        Vencerámica
      </h1>
    </div>

  </div>
</template>
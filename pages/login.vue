<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth'
})

const { login } = useAuth()

const state = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
  if (!state.username || !state.password) {
    errorMessage.value = 'Please enter both username and password'
    return
  }

  loading.value = true
  errorMessage.value = ''
  
  try {
    const success = await login(state)
    if (success) {
      navigateTo('/')
    } else {
      errorMessage.value = 'Invalid username or password'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <UCard class="w-full" :ui="{ header: { padding: 'p-6 sm:px-8' }, body: { padding: 'p-6 sm:px-8' } }">
      <template #header>
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
            <UIcon name="i-lucide-graduation-cap" class="w-7 h-7" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>
      </template>

      <UForm :state="state" @submit="onSubmit" class="space-y-6">
        <UAlert v-if="errorMessage" icon="i-lucide-alert-triangle" color="red" variant="subtle" :title="errorMessage" class="mb-4" />
        
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" icon="i-lucide-user" placeholder="Enter your username" autocomplete="username" size="lg" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" icon="i-lucide-lock" placeholder="••••••••" autocomplete="current-password" size="lg" class="w-full"/>
        </UFormField>

        <UButton type="submit" color="primary" block :loading="loading" class="mt-2" size="lg">
          Sign In
        </UButton>
      </UForm>
    </UCard>
    
    <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>admin / password123</p>
      &copy; {{ new Date().getFullYear() }} KidsFirst Development System
    </div>
  </div>
</template>

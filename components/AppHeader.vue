<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()

const items = computed(() => [
  [
    { label: user.value?.firstname + ' ' + user.value?.lastname, disabled: true }
  ],
  [
    { label: 'Sign out', icon: 'i-lucide-log-out', onSelect: logout }
  ]
])
</script>

<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10">
    <!-- Mobile Menu Button (Placeholder for future) -->
    <div class="flex items-center sm:hidden">
      <UButton icon="i-lucide-menu" color="gray" variant="ghost" />
    </div>
    
    <!-- Title / Breadcrumb (Optional) -->
    <div class="hidden sm:flex items-center text-gray-700 dark:text-gray-200 font-medium">
      Child Development System
    </div>

    <!-- User Menu -->
    <div class="flex items-center space-x-4 ml-auto">
      <UDropdownMenu :items="items" :popper="{ placement: 'bottom-end' }">
        <div class="flex items-center space-x-2 cursor-pointer cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors">
          <UAvatar :alt="user?.firstname" size="sm" class="bg-violet-500 text-white" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">{{ user?.firstname }}</span>
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-gray-400" />
        </div>
      </UDropdownMenu>
    </div>
  </header>
</template>

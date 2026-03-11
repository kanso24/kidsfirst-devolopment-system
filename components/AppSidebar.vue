<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const links = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Users',
    icon: 'i-lucide-users',
    to: '/users'
  },
  {
    label: 'Students',
    icon: 'i-lucide-graduation-cap',
    to: '/students'
  },
  {
    label: 'Assessments',
    icon: 'i-lucide-clipboard-list',
    to: '/assessments'
  },
  {
    label: 'Question Groups',
    icon: 'i-lucide-book-open',
    to: '/question-groups'
  },
  {
    label: 'Reports',
    icon: 'i-lucide-bar-chart-3',
    to: '/reports'
  }
]

const isActive = (to: string) => route.path === to
const navigate = (to: string) => router.push(to)
</script>

<template>
  <aside class="hidden sm:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-20 transition-all duration-300">
    <!-- Logo area -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-2 text-violet-600 dark:text-violet-400">
        <UIcon name="i-lucide-heart" class="w-6 h-6" />
        <span class="text-lg font-bold tracking-tight">KidsFirst</span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto py-4 px-3">
      <nav class="space-y-1">
        <UButton
          v-for="link in links"
          :key="link.to"
          variant="ghost"
          :color="isActive(link.to) ? 'primary' : 'gray'"
          class="w-full justify-start"
          :icon="link.icon"
          @click="navigate(link.to)"
        >
          {{ link.label }}
        </UButton>
      </nav>
    </div>
  </aside>
</template>

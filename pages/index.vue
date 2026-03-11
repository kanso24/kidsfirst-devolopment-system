<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()

const { data: summaryData, pending, error } = await useFetch('/api/reports/summary', {
  lazy: true
})

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, {{ user?.firstname }}! Here's what's happening today.</p>
      </div>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <USkeleton class="h-32 w-full" />
      <USkeleton class="h-32 w-full" />
    </div>

    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
      Failed to load dashboard summary.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Users Card -->
      <UCard :ui="{ body: { padding: 'px-4 py-5 sm:p-6' } }">
        <div class="flex items-center">
          <div class="flex-shrink-0 p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
            <UIcon name="i-lucide-users" class="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ summaryData?.summary.totalUsers || 0 }}</div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>

      <!-- Total Students Card -->
      <UCard :ui="{ body: { padding: 'px-4 py-5 sm:p-6' } }">
        <div class="flex items-center">
          <div class="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <UIcon name="i-lucide-graduation-cap" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Students</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ summaryData?.summary.totalStudents || 0 }}</div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity -->
    <div v-if="summaryData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Recent Students</h3>
            <UButton to="/students" color="gray" variant="ghost" size="sm">View all</UButton>
          </div>
        </template>
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
          <li v-for="student in summaryData.recent.students" :key="student.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <p class="text-sm font-medium text-violet-600 dark:text-violet-400 truncate">{{ student.firstname }} {{ student.lastname }}</p>
                <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-calendar" class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <p>Age: {{ student.age }}</p>
                </div>
              </div>
              <div class="ml-2 flex flex-shrink-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">Added {{ new Date(student.createdAt).toLocaleDateString() }}</p>
              </div>
            </div>
          </li>
          <li v-if="!summaryData.recent.students.length" class="py-4 text-sm text-gray-500 text-center">No students found.</li>
        </ul>
      </UCard>

      <UCard v-if="user?.role === 'admin'">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Recent Users</h3>
            <UButton to="/users" color="gray" variant="ghost" size="sm">View all</UButton>
          </div>
        </template>
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
          <li v-for="u in summaryData.recent.users" :key="u.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <p class="text-sm font-medium text-violet-600 dark:text-violet-400 truncate">{{ u.firstname }} {{ u.lastname }}</p>
                <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-at-sign" class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <p>{{ u.username }} ({{ u.role }})</p>
                </div>
              </div>
              <div class="ml-2 flex flex-shrink-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">Added {{ new Date(u.createdAt).toLocaleDateString() }}</p>
              </div>
            </div>
          </li>
          <li v-if="!summaryData.recent.users.length" class="py-4 text-sm text-gray-500 text-center">No users found.</li>
        </ul>
      </UCard>
    </div>
  </div>
</template>

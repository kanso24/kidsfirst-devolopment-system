<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'
import { usePdfExport } from '~/composables/usePdfExport'

const UBadge = resolveComponent('UBadge')

const { user } = useAuth()
const { exportTableToPdf } = usePdfExport()
const toast = useToast()

const selectedTab = ref(0)
const loadingExport = ref(false)

const tabs = [
  { label: 'Students Report', key: 'students' },
]

if (user.value?.role === 'admin') {
  tabs.push({ label: 'Users Report', key: 'users' })
}

const { data: studentsData, pending: pendingStudents } = await useFetch('/api/reports/export', {
  query: { type: 'students' },
  lazy: true
})

const { data: usersData, pending: pendingUsers } = await useFetch('/api/reports/export', {
  query: { type: 'users' },
  lazy: true,
  // Only fetch if admin
  immediate: user.value?.role === 'admin'
})

const studentColumns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'firstname', header: 'First Name' },
  { accessorKey: 'lastname', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'phone', header: 'Phone' },
  { 
    accessorKey: 'createdAt', 
    header: 'Added Date',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  }
]

const userColumns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'firstname', header: 'First Name' },
  { accessorKey: 'lastname', header: 'Last Name' },
  { accessorKey: 'username', header: 'Username' },
  { 
    accessorKey: 'role', 
    header: 'Role',
    cell: ({ row }) => h(UBadge, { color: row.original.role === 'admin' ? 'violet' : 'gray', variant: 'soft' }, () => row.original.role)
  },
  { 
    accessorKey: 'createdAt', 
    header: 'Added Date',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  }
]

const exportCurrentReport = () => {
  try {
    loadingExport.value = true
    const currentTab = tabs[selectedTab.value].key
    let rows: any[][] = []
    let columns: string[] = []
    let title = ''
    let filename = ''

    if (currentTab === 'students') {
      title = 'System Students Report'
      filename = `students-report-${new Date().toISOString().split('T')[0]}.pdf`
      columns = studentColumns.map(c => c.label)
      rows = (studentsData.value?.data || []).map((s: any) => [
        s.id, s.firstname, s.lastname, s.age, s.phone || '-', new Date(s.createdAt).toLocaleDateString()
      ])
    } else if (currentTab === 'users') {
      title = 'System Users Report'
      filename = `users-report-${new Date().toISOString().split('T')[0]}.pdf`
      columns = userColumns.map(c => c.label)
      rows = (usersData.value?.data || []).map((u: any) => [
        u.id, u.firstname, u.lastname, u.username, u.role, new Date(u.createdAt).toLocaleDateString()
      ])
    }

    if (rows.length === 0) {
      toast.add({ title: 'No data to export', color: 'orange' })
      return
    }

    exportTableToPdf(title, columns, rows, filename)
    toast.add({ title: 'Report exported successfully', color: 'green' })
  } catch (error: any) {
    toast.add({ title: 'Export failed', description: error.message, color: 'red' })
  } finally {
    loadingExport.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">View and export system data.</p>
      </div>
      <div class="mt-4 sm:ml-4 sm:mt-0">
        <UButton 
          icon="i-lucide-download" 
          color="violet" 
          size="lg"
          @click="exportCurrentReport" 
          :loading="loadingExport"
        >
          Export as PDF
        </UButton>
      </div>
    </div>

    <UCard>
      <UTabs v-model="selectedTab" :items="tabs" class="w-full">
        <template #item="{ item }">
          <div v-if="item.key === 'students'" class="mt-4">
            <UTable 
              :data="studentsData?.data || []" 
              :columns="studentColumns" 
              :loading="pendingStudents"
              class="w-full"
            >
              <template #empty-state>
                <div class="py-6 text-center text-sm text-gray-500">No students available in the report.</div>
              </template>
            </UTable>
          </div>

          <div v-if="item.key === 'users'" class="mt-4">
            <UTable 
              :data="usersData?.data || []" 
              :columns="userColumns" 
              :loading="pendingUsers"
              class="w-full"
            >
              <template #empty-state>
                <div class="py-6 text-center text-sm text-gray-500">No users available in the report.</div>
              </template>
            </UTable>
          </div>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const toast = useToast()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const searchInput = ref('')
const status = ref('all')
const sortBy = ref('assessmentDate')
const sortOrder = ref('desc')

const { data, pending, refresh } = await useFetch('/api/assessments', {
  query: { page, limit, search, status, sortBy, sortOrder },
  watch: [page, limit, search, status, sortBy, sortOrder]
})

const columns: TableColumn<any>[] = [
  { accessorKey: 'assessmentNumber', header: 'Assessment #' },
  { accessorKey: 'student', header: 'Student Name', cell: ({ row }) => `${row.original.student?.firstname} ${row.original.student?.lastname}` },
  { accessorKey: 'assessmentDate', header: 'Assessment Date', cell: ({ row }) => new Date(row.original.assessmentDate).toLocaleDateString() },
  { accessorKey: 'questionGroups', header: 'Assessment Group', cell: ({ row }) => {
    const groups = row.original.domainScores?.map((ds: any) => ds.questionGroup?.title).filter(Boolean) || []
    return groups.length > 0 ? groups.join(', ') : '-'
  }},
  { accessorKey: 'overallScore', header: 'Overall Score', cell: ({ row }) => row.original.overallScore?.toFixed(2) || '-' },
  { accessorKey: 'overallLevel', header: 'Overall Level', cell: ({ row }) => h('span', { class: `px-2 py-1 rounded-full text-xs ${getLevelClass(row.original.overallLevel)}` }, row.original.overallLevel || '-') },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => h('span', { class: `px-2 py-1 rounded-full text-xs ${row.original.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}` }, row.original.status) },
  { 
    accessorKey: 'actions', 
    header: 'Actions',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
      h(UButton, { color: 'neutral', variant: 'ghost', icon: 'i-lucide-eye', size: 'sm', onClick: () => navigateTo(`/assessments/${row.original.id}`) }),
      h(UButton, { color: 'neutral', variant: 'ghost', icon: 'i-lucide-pencil', size: 'sm', onClick: () => navigateTo(`/assessments/${row.original.id}/edit`) }),
      h(UButton, { color: 'error', variant: 'ghost', icon: 'i-lucide-trash-2', size: 'sm', onClick: () => confirmDelete(row.original) })
    ])
  }
]

const getLevelClass = (level: string) => {
  switch (level) {
    case 'Advanced': return 'bg-purple-100 text-purple-800'
    case 'Proficient': return 'bg-green-100 text-green-800'
    case 'Developing': return 'bg-yellow-100 text-yellow-800'
    case 'Emerging': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const isConfirmOpen = ref(false)
const selectedAssessment = ref<any>(null)
const deleting = ref(false)

const onSearch = () => {
  search.value = searchInput.value
  page.value = 1
}

const goToNewAssessment = () => {
  navigateTo('/assessments/new')
}

const confirmDelete = (row: any) => {
  selectedAssessment.value = row
  isConfirmOpen.value = true
}

const deleteAssessment = async () => {
  try {
    deleting.value = true
    await $fetch(`/api/assessments/${selectedAssessment.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Assessment deleted successfully', color: 'success' })
    isConfirmOpen.value = false
    refresh()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to delete', color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">View and create assessments.</p>
      </div>
      <div class="mt-4 sm:ml-4 sm:mt-0">
        <UButton icon="i-lucide-plus" color="primary" @click="goToNewAssessment" size="lg">
          Assessment
        </UButton>
      </div>
    </div>

    <UCard>
      <div class="flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <form @submit.prevent="onSearch" class="flex gap-2 w-full max-w-sm">
          <UInput v-model="searchInput" icon="i-lucide-search" placeholder="Search by student name..." class="w-full" size="lg" />
          <UButton type="submit" color="primary" variant="solid" size="lg">Search</UButton>
        </form>
        <div class="flex gap-2">
          <USelect v-model="status" :items="[{ label: 'All Status', value: 'all' }, { label: 'Draft', value: 'draft' }, { label: 'Completed', value: 'completed' }]" placeholder="Status" class="w-32" />
          <USelect v-model="sortBy" :items="[{ label: 'Date', value: 'assessmentDate' }, { label: 'Assessment #', value: 'assessmentNumber' }]" class="w-32" />
          <UButton icon="i-lucide-arrow-up-down" color="neutral" variant="ghost" @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'" />
        </div>
      </div>

      <UTable :data="data?.assessments || []" :columns="columns" :loading="pending">
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm text-gray-500">No assessments found</span>
            <UButton label="Create Assessment" color="primary" @click="goToNewAssessment" />
          </div>
        </template>
      </UTable>

      <div v-if="data?.total" class="flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Showing <span class="font-medium">{{ (data.page - 1) * data.limit + 1 }}</span> to <span class="font-medium">{{ Math.min(data.page * data.limit, data.total) }}</span> of <span class="font-medium">{{ data.total }}</span> results
        </span>
        <UPagination v-model="page" :page-count="limit" :total="data.total" />
      </div>
    </UCard>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isConfirmOpen">
      <template #content>
        <UCard>
          <div class="p-4 text-center">
            <UIcon name="i-lucide-alert-triangle" class="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Assessment</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete assessment <strong>{{ selectedAssessment?.assessmentNumber }}</strong>? This action cannot be undone.
            </p>
            <div class="mt-6 flex justify-center gap-3">
              <UButton color="neutral" variant="solid" size="lg" @click="isConfirmOpen = false">Cancel</UButton>
              <UButton color="error" size="lg" @click="deleteAssessment" :loading="deleting">Delete</UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const toast = useToast()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const searchInput = ref('')

const { data, pending, refresh } = await useFetch('/api/question-groups', {
  query: { page, limit, search },
  watch: [page, limit, search]
})

const columns: TableColumn<any>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'questions', header: 'Questions', cell: ({ row }) => row.original.questions?.length || 0 },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => h('span', { class: `px-2 py-1 rounded-full text-xs ${row.original.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}` }, row.original.status) },
  { 
    accessorKey: 'actions', 
    header: 'Actions',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
      h(UButton, { color: 'gray', variant: 'ghost', icon: 'i-lucide-pencil', size: 'sm', onClick: () => navigateTo(`/question-groups/edit/${row.original.id}`) }),
      h(UButton, { color: 'red', variant: 'ghost', icon: 'i-lucide-trash-2', size: 'sm', onClick: () => confirmDelete(row.original) })
    ])
  }
]

const isConfirmOpen = ref(false)
const selectedGroup = ref<any>(null)
const deleting = ref(false)

const onSearch = () => {
  search.value = searchInput.value
  page.value = 1
}

const confirmDelete = (row: any) => {
  selectedGroup.value = row
  isConfirmOpen.value = true
}

const deleteGroup = async () => {
  try {
    deleting.value = true
    await $fetch(`/api/question-groups/${selectedGroup.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Question group deleted successfully', color: 'green' })
    isConfirmOpen.value = false
    refresh()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to delete', color: 'red' })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Question Groups</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage assessment question groups and questions.</p>
      </div>
      <div class="mt-4 sm:ml-4 sm:mt-0">
        <UButton icon="i-lucide-plus" color="primary" @click="navigateTo('/question-groups/new')" size="lg">
          Add Group
        </UButton>
      </div>
    </div>

    <UCard>
      <div class="flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <form @submit.prevent="onSearch" class="flex gap-2 w-full max-w-sm">
          <UInput v-model="searchInput" icon="i-lucide-search" placeholder="Search groups..." class="w-full" size="lg" />
          <UButton type="submit" color="primary" variant="solid" size="lg">Search</UButton>
        </form>
      </div>

      <UTable :data="data?.questionGroups || []" :columns="columns" :loading="pending">
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm text-gray-500">No question groups found</span>
            <UButton label="Create Group" color="primary" @click="navigateTo('/question-groups/new')" />
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
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Question Group</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong>{{ selectedGroup?.title }}</strong>? This action cannot be undone.
            </p>
            <div class="mt-6 flex justify-center gap-3">
              <UButton color="gray" variant="ghost" size="lg" @click="isConfirmOpen = false">Cancel</UButton>
              <UButton color="red" size="lg" @click="deleteGroup" :loading="deleting">Delete</UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

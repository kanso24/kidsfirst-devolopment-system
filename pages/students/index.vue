<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')

const toast = useToast()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const searchInput = ref('')

const { data, pending, refresh } = await useFetch('/api/students', {
  query: { page, limit, search },
  watch: [page, limit, search]
})

const columns: TableColumn<any>[] = [
  { accessorKey: 'firstname', header: 'First Name' },
  { accessorKey: 'lastname', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { 
    accessorKey: 'phone', 
    header: 'Phone',
    cell: ({ row }) => row.original.phone || '-'
  },
  { 
    accessorKey: 'createdAt', 
    header: 'Added',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  { 
    accessorKey: 'actions', 
    header: 'Actions',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
      h(UButton, { color: 'gray', variant: 'ghost', icon: 'i-lucide-pencil', size: 'sm', onClick: () => openEdit(row.original) }),
      h(UButton, { color: 'red', variant: 'ghost', icon: 'i-lucide-trash-2', size: 'sm', onClick: () => confirmDelete(row.original) })
    ])
  }
]

const isOpen = ref(false)
const isConfirmOpen = ref(false)
const isEditing = ref(false)
const selectedStudent = ref<any>(null)
const submitting = ref(false)

const formState = reactive({
  id: 0,
  firstname: '',
  lastname: '',
  age: null as number | null,
  address: '',
  phone: ''
})

const onSearch = () => {
  search.value = searchInput.value
  page.value = 1
}

const openCreate = () => {
  isEditing.value = false
  formState.id = 0
  formState.firstname = ''
  formState.lastname = ''
  formState.age = null
  formState.address = ''
  formState.phone = ''
  isOpen.value = true
}

const openEdit = (row: any) => {
  isEditing.value = true
  formState.id = row.id
  formState.firstname = row.firstname
  formState.lastname = row.lastname
  formState.age = row.age
  formState.address = row.address || ''
  formState.phone = row.phone || ''
  isOpen.value = true
}

const confirmDelete = (row: any) => {
  selectedStudent.value = row
  isConfirmOpen.value = true
}

const saveStudent = async () => {
  try {
    submitting.value = true
    const endpoint = isEditing.value ? `/api/students/${formState.id}` : '/api/students'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    await $fetch(endpoint, {
      method,
      body: formState
    })
    
    toast.add({ title: `Student ${isEditing.value ? 'updated' : 'created'} successfully`, color: 'green' })
    isOpen.value = false
    refresh()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to save', color: 'red' })
  } finally {
    submitting.value = false
  }
}

const deleteStudent = async () => {
  try {
    submitting.value = true
    await $fetch(`/api/students/${selectedStudent.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Student deleted successfully', color: 'green' })
    isConfirmOpen.value = false
    refresh()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to delete', color: 'red' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage student records and information.</p>
      </div>
      <div class="mt-4 sm:ml-4 sm:mt-0">
        <UButton icon="i-lucide-plus" color="primary" @click="openCreate">
          Add Student
        </UButton>
      </div>
    </div>

    <UCard>
      <div class="flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <form @submit.prevent="onSearch" class="flex gap-2 w-full max-w-sm">
          <UInput v-model="searchInput" icon="i-lucide-search" placeholder="Search by name or phone..." class="w-full" />
          <UButton type="submit" color="gray" variant="ghost">Search</UButton>
        </form>
      </div>

      <UTable :data="data?.students || []" :columns="columns" :loading="pending">
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm text-gray-500">No students found</span>
            <UButton label="Clear filter" color="gray" variant="ghost" v-if="search" @click="() => { searchInput = ''; onSearch() }" />
          </div>
        </template>
      </UTable>

      <div class="flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700" v-if="data?.total">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Showing <span class="font-medium">{{ (data.page - 1) * data.limit + 1 }}</span> to <span class="font-medium">{{ Math.min(data.page * data.limit, data.total) }}</span> of <span class="font-medium">{{ data.total }}</span> results
        </span>
        <UPagination v-model="page" :page-count="limit" :total="data.total" />
      </div>
    </UCard>

    <!-- Create/Edit Modal -->
    <UModal v-model:open="isOpen">
      <template #content>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ isEditing ? 'Edit Student' : 'Add New Student' }}
            </h3>
          </template>

          <form @submit.prevent="saveStudent" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="First Name" required>
                <UInput v-model="formState.firstname" required />
              </UFormField>
              <UFormField label="Last Name" required>
                <UInput v-model="formState.lastname" required />
              </UFormField>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Age" required>
                <UInput v-model="formState.age" type="number" required />
              </UFormField>
              <UFormField label="Phone">
                <UInput v-model="formState.phone" />
              </UFormField>
            </div>

            <UFormField label="Address">
              <UTextarea v-model="formState.address" :rows="3" />
            </UFormField>
            
            <div class="flex justify-end gap-3 mt-4">
              <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
              <UButton type="submit" color="primary" :loading="submitting">Save</UButton>
            </div>
          </form>
        </UCard>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isConfirmOpen">
      <template #content>
        <UCard>
          <div class="p-4 text-center">
            <UIcon name="i-lucide-alert-triangle" class="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Student</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong>{{ selectedStudent?.firstname }} {{ selectedStudent?.lastname }}</strong>? This action cannot be undone.
            </p>
            <div class="mt-6 flex justify-center gap-3">
              <UButton color="gray" variant="ghost" @click="isConfirmOpen = false">Cancel</UButton>
              <UButton color="red" @click="deleteStudent" :loading="submitting">Delete</UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

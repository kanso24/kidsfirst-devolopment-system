<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const { user } = useAuth()
if (user.value?.role !== 'admin') {
  navigateTo('/')
}

const toast = useToast()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const searchInput = ref('')

const { data, pending, refresh } = await useFetch('/api/users', {
  query: { page, limit, search },
  watch: [page, limit, search]
})

const columns: TableColumn<any>[] = [
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
    header: 'Joined',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  { 
    accessorKey: 'actions', 
    header: 'Actions',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
      h(UButton, { color: 'gray', variant: 'ghost', icon: 'i-lucide-pencil', size: 'sm', onClick: () => openEdit(row.original) }),
      h(UButton, { color: 'red', variant: 'ghost', icon: 'i-lucide-trash-2', size: 'sm', onClick: () => confirmDelete(row.original), disabled: row.original.id === user.value?.id })
    ])
  }
]

const isOpen = ref(false)
const isConfirmOpen = ref(false)
const isEditing = ref(false)
const selectedUser = ref<any>(null)
const submitting = ref(false)

const formState = reactive({
  id: 0,
  firstname: '',
  lastname: '',
  username: '',
  password: '',
  role: 'staff'
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
  formState.username = ''
  formState.password = ''
  formState.role = 'staff'
  isOpen.value = true
}

const openEdit = (row: any) => {
  isEditing.value = true
  formState.id = row.id
  formState.firstname = row.firstname
  formState.lastname = row.lastname
  formState.username = row.username
  formState.password = ''
  formState.role = row.role
  isOpen.value = true
}

const confirmDelete = (row: any) => {
  selectedUser.value = row
  isConfirmOpen.value = true
}

const saveUser = async () => {
  try {
    submitting.value = true
    const endpoint = isEditing.value ? `/api/users/${formState.id}` : '/api/users'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    await $fetch(endpoint, {
      method,
      body: formState
    })
    
    toast.add({ title: `User ${isEditing.value ? 'updated' : 'created'} successfully`, color: 'green' })
    isOpen.value = false
    refresh()
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to save', color: 'red' })
  } finally {
    submitting.value = false
  }
}

const deleteUser = async () => {
  try {
    submitting.value = true
    await $fetch(`/api/users/${selectedUser.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'User deleted successfully', color: 'green' })
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage system users and administrators.</p>
      </div>
      <div class="mt-4 sm:ml-4 sm:mt-0">
        <UButton icon="i-lucide-plus" color="primary" @click="openCreate" size="lg">
          Add User
        </UButton>
      </div>
    </div>

    <UCard>
      <div class="flex items-center justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <form @submit.prevent="onSearch" class="flex gap-2">
          <UInput v-model="searchInput" icon="i-lucide-search" placeholder="Search users..." size="lg" />
          <UButton type="submit" color="primary" variant="solid" size="lg">Search</UButton>
        </form>
      </div>

      <UTable :data="data?.users || []" :columns="columns" :loading="pending">
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm text-gray-500">No users found</span>
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
              {{ isEditing ? 'Edit User' : 'Add New User' }}
            </h3>
          </template>

          <form @submit.prevent="saveUser" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="First Name" required>
                <UInput v-model="formState.firstname" required size="lg" />
              </UFormField>
              <UFormField label="Last Name" required>
                <UInput v-model="formState.lastname" required size="lg" />
              </UFormField>
            </div>
            <UFormField label="Username" required>
              <UInput v-model="formState.username" required size="lg" />
            </UFormField>
            <UFormField label="Password" :required="!isEditing" :help="isEditing ? 'Leave blank to keep current password' : 'At least 6 characters'">
              <UInput v-model="formState.password" type="password" :required="!isEditing" minlength="6" size="lg" />
            </UFormField>
            <UFormField label="Role" required>
              <USelect v-model="formState.role" :options="[{ label: 'Admin', value: 'admin' }, { label: 'Staff', value: 'staff' }]" />
            </UFormField>
            
            <div class="flex justify-end gap-3 mt-4">
              <UButton color="gray" variant="ghost" size="lg" @click="isOpen = false">Cancel</UButton>
              <UButton type="submit" color="primary" :loading="submitting" size="lg">Save</UButton>
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
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete User</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete user <strong>{{ selectedUser?.username }}</strong>? This action cannot be undone.
            </p>
            <div class="mt-6 flex justify-center gap-3">
              <UButton color="gray" variant="ghost" size="lg" @click="isConfirmOpen = false">Cancel</UButton>
              <UButton color="red" size="lg" @click="deleteUser" :loading="submitting">Delete</UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

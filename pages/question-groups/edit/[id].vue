<script setup lang="ts">
const toast = useToast()
const router = useRouter()
const route = useRoute()

const isEditing = ref(false)
const submitting = ref(false)
const loading = ref(true)
const groupId = route.params.id ? parseInt(route.params.id as string) : null

const formState = reactive({
  title: '',
  description: '',
  status: 'active'
})

const questions = ref<any[]>([])

const domains = [
  { label: 'Sensory Exploration', value: 'sensory' },
  { label: 'Visual Cognitive', value: 'visual' },
  { label: 'Gross Motor', value: 'gross_motor' },
  { label: 'Fine Motor', value: 'fine_motor' },
  { label: 'Social & Language', value: 'social_language' }
]

const addQuestion = () => {
  questions.value.push({
    questionText: '',
    description: '',
    minScore: 1.0,
    maxScore: 3.0,
    sortOrder: questions.value.length
  })
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

onMounted(async () => {
  if (groupId) {
    isEditing.value = true
    try {
      const data = await $fetch(`/api/question-groups`)
      const group = data.questionGroups?.find((g: any) => g.id === groupId)
      if (group) {
        formState.title = group.title
        formState.description = group.description || ''
        formState.status = group.status
        questions.value = group.questions || []
      }
    } catch (e) {
      toast.add({ title: 'Error loading group', color: 'red' })
    }
  }
  loading.value = false
})

const saveGroup = async () => {
  try {
    submitting.value = true
    
    const body = {
      ...formState,
      questions: questions.value
    }

    if (isEditing.value) {
      await $fetch(`/api/question-groups/${groupId}`, {
        method: 'PUT',
        body
      })
      toast.add({ title: 'Assessments Group updated successfully', color: 'green' })
    } else {
      await $fetch('/api/question-groups', {
        method: 'POST',
        body
      })
      toast.add({ title: 'Assessments Group created successfully', color: 'green' })
    }
    
    router.push('/question-groups')
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to save', color: 'red' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Assessments Group' : 'Add New Assessments Group' }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ isEditing ? 'Update assessments group details' : 'Create a new assessments group' }}
        </p>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin h-8 w-8 text-gray-400" />
    </div>

    <template v-else>
      <UCard>
        <form @submit.prevent="saveGroup" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Title" required>
              <UInput v-model="formState.title" required size="lg" class="w-full"/>
            </UFormField>
            <UFormField label="Status">
              <USelect v-model="formState.status" :items="[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]" />
            </UFormField>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Description">
            <UTextarea v-model="formState.description" :rows="3" class="w-full" />
          </UFormField>
          </div>

          <div class="border-t pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium">Questions</h3>
              <UButton type="button" size="lg" variant="outline" icon="i-lucide-plus" @click="addQuestion">Add Question</UButton>
            </div>

            <div v-for="(question, index) in questions" :key="index" class="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-start justify-between gap-4 mb-3">
                <span class="text-md font-medium">Question {{ index + 1 }}</span>
                <UButton type="button" size="xs" variant="ghost" color="error" icon="i-lucide-trash-2" @click="removeQuestion(index)" />
              </div>
              <UFormField label="Question Text" required>
                <UInput v-model="question.questionText" required size="lg" class="w-full" />
              </UFormField>
              <UFormField label="Description" class="mt-3">
                <UTextarea v-model="question.description" placeholder="Optional description" size="lg" class="w-full" />
              </UFormField>
              <div class="grid grid-cols-6 gap-2 mt-3">
                <UFormField label="Min Score">
                  <UInput v-model.number="question.minScore" type="number" size="lg" />
                </UFormField>
                <UFormField label="Max Score">
                  <UInput v-model.number="question.maxScore" type="number" size="lg" />
                </UFormField>
              </div>
            </div>

            <div v-if="questions.length === 0" class="text-center py-8 text-gray-500">
              No questions added yet. Click "Add Question" to add questions.
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-4 border-t">
            <UButton color="neutral" variant="outline" size="lg" @click="router.push('/question-groups')">Cancel</UButton>
            <UButton type="submit" color="primary" :loading="submitting" size="lg">{{ isEditing ? 'Update' : 'Save' }}</UButton>
          </div>
        </form>
      </UCard>
    </template>
  </div>
</template>

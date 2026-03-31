<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const page = ref(1)
const limit = ref(100)
const selectedStudentId = ref<string | number>('')
const selectedGroupId = ref<string | number>('')

const getDefaultDates = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const start = `${year}-${month}-01`
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  const end = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}
const startDate = ref(getDefaultDates().start)
const endDate = ref(getDefaultDates().end)

const { data: allAssessmentsData } = await useFetch('/api/assessments', {
  query: { page: 1, limit: 1000, sortBy: 'assessmentDate', sortOrder: 'desc' },
  server: false
})

const { data: groupsData } = await useFetch('/api/question-groups', {
  query: { page: 1, limit: 100 },
  server: false
})

const uniqueStudents = computed(() => {
  const studentMap = new Map()
  allAssessmentsData.value?.assessments?.forEach((a: any) => {
    if (a.student && !studentMap.has(a.student.id)) {
      studentMap.set(a.student.id, a.student)
    }
  })
  return Array.from(studentMap.values())
})

const studentOptions = computed(() => 
  [{ label: 'All Students', value: undefined }, ...uniqueStudents.value.map(s => ({
    label: `${s.firstname} ${s.lastname}`,
    value: s.id
  }))]
)

const groupOptions = computed(() => 
  [{ label: 'All Groups', value: undefined }, ...(groupsData.value?.questionGroups.map(g => ({
    label: g.title,
    value: g.id
  })) || [])]
)

const assessments = ref<any[]>([])
const total = ref(0)
const pending = ref(false)

const fetchAssessments = async () => {
  pending.value = true
  try {
    const params: any = { 
      page: page.value, 
      limit: limit.value, 
      sortBy: 'assessmentDate', 
      sortOrder: 'desc' 
    }
    if (selectedStudentId.value) params.studentId = selectedStudentId.value
    if (selectedGroupId.value) params.questionGroupId = selectedGroupId.value
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    
    const res = await $fetch('/api/assessments', { params })
    assessments.value = res.assessments || []
    total.value = res.total || 0
  } catch (e) {
    assessments.value = []
    total.value = 0
  } finally {
    pending.value = false
  }
}

const onSearch = () => {
  page.value = 1
  fetchAssessments()
}

watch([selectedStudentId, selectedGroupId, startDate, endDate], () => {
  fetchAssessments()
})

onMounted(() => {
  fetchAssessments()
})

const getLevelClass = (level: string) => {
  switch (level) {
    case 'Advanced': return 'bg-purple-100 text-purple-800'
    case 'Proficient': return 'bg-green-100 text-green-800'
    case 'Developing': return 'bg-yellow-100 text-yellow-800'
    case 'Emerging': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const columns: TableColumn<any>[] = [
  { 
    accessorKey: 'student', 
    header: 'Student', 
    cell: ({ row }) => {
      const student = row.original.student
      return h('div', { class: 'flex items-center gap-3' }, [
        h('div', { class: 'h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden border border-violet-100' }, [
          student?.image 
            ? h('img', { src: student.image, class: 'h-full w-full object-cover' })
            : h('span', { class: 'text-lg' }, student?.gender === 'female' ? '👧' : '👦')
        ]),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-bold text-gray-900' }, `${student?.firstname} ${student?.lastname}`),
          h('span', { class: 'text-xs text-gray-500' }, `${student?.age} years • ${student?.gender || '-'}`)
        ])
      ])
    }
  },
  { 
    accessorKey: 'assessmentDate', 
    header: 'Date', 
    cell: ({ row }) => h('div', { class: 'text-sm text-gray-600 font-medium' }, new Date(row.original.assessmentDate).toLocaleDateString())
  },
  { 
    accessorKey: 'domainScores', 
    header: 'Type', 
    cell: ({ row }) => h('div', { class: 'text-xs font-bold text-violet-700 bg-violet-50 px-2 py-1 rounded' }, row.original.domainScores?.[0]?.questionGroup?.title || '-') 
  },
  { 
    accessorKey: 'overallScore', 
    header: 'Score', 
    cell: ({ row }) => h('div', { class: 'font-black text-gray-900' }, row.original.overallScore?.toFixed(2) || '-') 
  },
  { 
    accessorKey: 'overallLevel', 
    header: 'Level', 
    cell: ({ row }) => h('span', { class: `px-2 py-1 rounded-full text-xs font-bold ${getLevelClass(row.original.overallLevel)}` }, row.original.overallLevel || '-') 
  },
  {
    accessorKey: 'recommendation',
    header: 'Recommendations',
    cell: ({ row }) => h('div', { class: 'max-w-xs truncate text-xs text-gray-500 italic' }, row.original.recommendation || 'No recommendations')
  },
  { 
    accessorKey: 'actions', 
    header: '', 
    cell: ({ row }) => h('div', { class: 'flex justify-end' }, [
      h(resolveComponent('UButton') as any, { 
        icon: 'i-lucide-eye', 
        color: 'primary', 
        variant: 'ghost', 
        size: 'sm',
        onClick: () => navigateTo(`/reports/${row.original.id}`) 
      })
    ])
  }
]

useHead({
  title: 'Assessment Report | KidsFirst'
})
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assessment Report</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">View and filter assessment reports.</p>
      </div>
    </div>

    <UCard>
      <div class="flex flex-wrap items-center gap-4 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <USelect v-model="selectedStudentId" :items="studentOptions" placeholder="Select Student" class="w-48" />
        <USelect v-model="selectedGroupId" :items="groupOptions" placeholder="Assessments Group" class="w-48" />
        <UInput v-model="startDate" type="date" placeholder="Start Date" class="w-36" />
        <UInput v-model="endDate" type="date" placeholder="End Date" class="w-36" />
        <UButton color="primary" icon="i-lucide-search" @click="onSearch">Search</UButton>
      </div>

      <UTable :data="assessments" :columns="columns" :loading="pending">
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm text-gray-500">No assessments found</span>
          </div>
        </template>
      </UTable>

      <div v-if="total" class="flex items-center justify-between px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Showing <span class="font-medium">{{ (page - 1) * limit + 1 }}</span> to <span class="font-medium">{{ Math.min(page * limit, total) }}</span> of <span class="font-medium">{{ total }}</span> results
        </span>
        <UPagination v-model="page" :page-count="limit" :total="total" @update:page="fetchAssessments" />
      </div>
    </UCard>
  </div>
</template>

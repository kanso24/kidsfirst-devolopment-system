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
  { accessorKey: 'assessmentDate', header: 'Assessment Date', cell: ({ row }) => new Date(row.original.assessmentDate).toLocaleDateString() },
  { accessorKey: 'student', header: 'Student Name', cell: ({ row }) => `${row.original.student?.firstname} ${row.original.student?.lastname}` },
  { accessorKey: 'domainScores', header: 'Assessments Group', cell: ({ row }) => row.original.domainScores?.[0]?.questionGroup?.title || '-' },
  { accessorKey: 'overallScore', header: 'Overall Score', cell: ({ row }) => row.original.overallScore?.toFixed(2) || '-' },
  { accessorKey: 'overallLevel', header: 'Overall Level', cell: ({ row }) => h('span', { class: `px-2 py-1 rounded-full text-xs ${getLevelClass(row.original.overallLevel)}` }, row.original.overallLevel || '-') },
  { 
    accessorKey: 'actions', 
    header: 'Actions',
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
      h('button', { type: 'button', class: 'p-2 rounded-lg hover:bg-gray-100 text-gray-500', onClick: () => navigateTo(`/reports/${row.original.id}`) }, [
        h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
          h('path', { d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }),
          h('circle', { cx: '12', cy: '12', r: '3' })
        ])
      ])
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

<script setup lang="ts">
import { h } from 'vue'
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const route = useRoute()
const router = useRouter()

const { data, pending } = await useFetch(`/api/assessments/${route.params.id}`)

const assessment = computed(() => data.value?.assessment)

const getLevelClass = (level: string) => {
  switch (level) {
    case 'Advanced': return 'bg-purple-100 text-purple-800'
    case 'Proficient': return 'bg-green-100 text-green-800'
    case 'Developing': return 'bg-yellow-100 text-yellow-800'
    case 'Emerging': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const questionScoresList = computed(() => {
  if (!assessment.value?.domainScores) return []
  const list: any[] = []
  let index = 1
  assessment.value.domainScores.forEach((ds: any) => {
    if (ds.questionScores) {
      ds.questionScores.forEach((qs: any) => {
        list.push({
          index: index++,
          questionText: qs.questionText,
          score: qs.score,
          level: ds.level,
          comment: qs.comment || '-'
        })
      })
    }
  })
  return list
})

const maxScore = computed(() => {
  let max = 3
  questionScoresList.value.forEach((q: any) => {
    if (q.score > max) max = q.score
  })
  return max
})

const chartData = computed(() => {
  if (!questionScoresList.value.length) return null
  
  const scores = questionScoresList.value.map(q => q.score)
  const labels = questionScoresList.value.map((q, i) => `Q${i + 1}`)
  
  return {
    labels,
    datasets: [
      {
        label: 'Current Assessment',
        data: scores,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)'
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      min: 0,
      max: maxScore.value,
      ticks: {
        stepSize: 1,
        callback: (value: any) => value.toFixed(0)
      }
    }
  },
  plugins: {
    legend: { display: false }
  }
}))
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assessment Summary</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ assessment?.assessmentNumber }} - {{ assessment?.student?.firstname }} {{ assessment?.student?.lastname }}
        </p>
      </div>
      <div class="mt-4 sm:ml-4 sm:mt-0 flex gap-2">
        <UButton color="gray" variant="ghost" icon="i-lucide-pencil" @click="router.push(`/assessments/${route.params.id}/edit`)">Edit</UButton>
        <UButton color="gray" variant="ghost" icon="i-lucide-arrow-left" @click="router.push('/assessments')">Back</UButton>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin h-8 w-8 text-gray-400" />
    </div>

    <template v-else-if="assessment">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <UCard>
            <template #header>
              <h3 class="text-base font-semibold">Assessment Information</h3>
            </template>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-sm text-gray-500">Assessment #</p>
                <p class="font-medium">{{ assessment.assessmentNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Student</p>
                <p class="font-medium">{{ assessment.student?.firstname }} {{ assessment.student?.lastname }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Age</p>
                <p class="font-medium">{{ assessment.student?.age }} years</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Assessment Date</p>
                <p class="font-medium">{{ new Date(assessment.assessmentDate).toLocaleDateString() }}</p>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-base font-semibold">Current Assessment Scores</h3>
            </template>
            <UTable :data="questionScoresList" :columns="[
              { accessorKey: 'index', header: '#' },
              { accessorKey: 'questionText', header: 'Question' },
              { accessorKey: 'score', header: 'Score', cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.score) },
              { accessorKey: 'level', header: 'Level', cell: ({ row }) => h('span', { class: `px-2 py-1 rounded-full text-xs ${getLevelClass(row.original.level)}` }, row.original.level) },
              { accessorKey: 'comment', header: 'Comments' }
            ]">
            </UTable>
          </UCard>
        </div>

        <div class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold">Child Development Profile</h3>
                <span :class="['px-2 py-1 rounded-full text-sm', getLevelClass(assessment.overallLevel)]">
                  {{ assessment.overallLevel }}
                </span>
              </div>
            </template>
            
            <div class="text-center mb-4">
              <p class="text-sm text-gray-500">Overall Score</p>
              <p class="text-4xl font-bold text-violet-600">{{ assessment.overallScore?.toFixed(2) }}</p>
            </div>

            <div v-if="chartData" class="aspect-square">
              <Radar :data="chartData" :options="chartOptions" />
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </div>
</template>

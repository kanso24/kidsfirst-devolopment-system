<script setup lang="ts">
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const toast = useToast()
const router = useRouter()

const students = ref<any[]>([])
const allQuestionGroups = ref<any[]>([])
const submitting = ref(false)
const selectedGroupIds = ref<number[]>([])
const selectedGroupId = ref<number | null>(null)

const selectedStudent = computed(() => {
  return students.value.find(s => s.id === formState.studentId)
})

const formState = reactive({
  studentId: null as number | null,
  assessmentDate: new Date().toISOString().slice(0, 10),
  summary: '',
  recommendation: '',
  teacherNotes: ''
})

const domainScores = ref<Record<string, {
  groupId: number
  groupTitle: string
  domain: string
  score: number
  questionGroupId: number | null
  questionGroup: any
  questions: any[]
  questionScores: Record<string, { score: number; comment: string }>
}>>({})

const hasDomainScores = computed(() => Object.keys(domainScores.value).length > 0)
const domainScoresList = computed(() => Object.entries(domainScores.value).map(([key, val]) => ({ key, ...val })))

const getScoreOptions = (minScore: number, maxScore: number) => {
  const options: number[] = []
  for (let i = minScore; i <= maxScore; i++) {
    options.push(i)
  }
  return options
}

const { data: studentsData } = await useFetch('/api/students', {
  query: { limit: 1000 }
})

students.value = studentsData.value?.students || []

const { data: groupsData } = await useFetch('/api/question-groups/active')
if (groupsData.value?.questionGroups) {
  allQuestionGroups.value = groupsData.value.questionGroups
}

const getInitialDomainScore = (groupId: number) => {
  const group = allQuestionGroups.value.find(g => g.id === groupId)
  if (!group) return null
  
  const initial: any = {
    groupId: groupId,
    groupTitle: group.title,
    domain: group.domain,
    score: 2,
    questionGroupId: groupId,
    questionGroup: group,
    questions: group.questions || [],
    questionScores: {}
  }
  
  group.questions?.forEach((q: any) => {
    initial.questionScores[q.id] = { score: q.minScore || 1, comment: '' }
  })
  
  return initial
}

const initializeDomainScores = () => {
  const newDomainScores: any = {}
  selectedGroupIds.value.forEach(groupId => {
    const initial = getInitialDomainScore(groupId)
    if (initial) {
      newDomainScores[`group_${groupId}`] = initial
    }
  })
  domainScores.value = newDomainScores
}

watch(selectedGroupIds, () => {
  initializeDomainScores()
}, { deep: true })

const addGroup = () => {
  if (selectedGroupId.value && !selectedGroupIds.value.includes(selectedGroupId.value)) {
    selectedGroupIds.value.push(selectedGroupId.value)
    selectedGroupId.value = null
  }
}

const removeGroup = (groupId: number) => {
  selectedGroupIds.value = selectedGroupIds.value.filter(id => id !== groupId)
}

const setQuestionScore = (groupKey: string, questionId: number, score: number) => {
  if (domainScores.value[groupKey]?.questionScores?.[questionId]) {
    domainScores.value[groupKey].questionScores[questionId].score = score
  }
}

const setQuestionComment = (groupKey: string, questionId: number, comment: string) => {
  if (domainScores.value[groupKey]?.questionScores?.[questionId]) {
    domainScores.value[groupKey].questionScores[questionId].comment = comment
  }
}

const calculateDomainScore = (groupKey: string) => {
  const ds = domainScores.value[groupKey]
  if (ds?.questionGroup && ds?.questions?.length > 0) {
    const scores = Object.values(ds.questionScores).map((qs: any) => qs.score) as number[]
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      return parseFloat(avg.toFixed(2))
    }
  }
  return ds?.score || 2
}

const getLevel = (score: number): string => {
  const max = maxScore.value || 3
  const third = max / 3
  if (score <= third) return 'Emerging'
  if (score <= third * 2) return 'Developing'
  if (score <= third * 3 - 0.01) return 'Proficient'
  return 'Advanced'
}

const getLevelClass = (level: string) => {
  switch (level) {
    case 'Advanced': return 'bg-purple-100 text-purple-800'
    case 'Proficient': return 'bg-green-100 text-green-800'
    case 'Developing': return 'bg-yellow-100 text-yellow-800'
    case 'Emerging': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getScoreButtonClass = (score: number, currentScore: number | undefined) => {
  const base = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all'
  if (score === currentScore) {
    return `${base} bg-violet-600 text-white`
  }
  return `${base} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900`
}

const questionScoresList = computed(() => {
  const list: { groupTitle: string; questionText: string; score: number; level: string }[] = []
  Object.values(domainScores.value).forEach(ds => {
    ds.questions?.forEach((q: any) => {
      const score = ds.questionScores[q.id]?.score || q.minScore || 1
      list.push({
        groupTitle: ds.groupTitle,
        questionText: q.questionText,
        score: score,
        level: getLevel(score)
      })
    })
  })
  return list
})

const overallScore = computed(() => {
  const allScores = questionScoresList.value.map(qs => qs.score)
  if (allScores.length === 0) return 0
  return parseFloat((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2))
})

const overallLevel = computed(() => getLevel(overallScore.value))

const maxScore = computed(() => {
  let max = 3
  Object.values(domainScores.value).forEach(ds => {
    ds.questions?.forEach((q: any) => {
      if (q.maxScore > max) max = q.maxScore
    })
  })
  return max
})

const chartData = computed(() => {
  const scores = questionScoresList.value.map(qs => qs.score)
  const labels = questionScoresList.value.map(qs => qs.questionText.length > 15 ? qs.questionText.substring(0, 15) + '...' : qs.questionText)
  
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

const saveAssessment = async () => {
  if (!formState.studentId) {
    toast.add({ title: 'Please select a student', color: 'error' })
    return
  }

  if (Object.keys(domainScores.value).length === 0) {
    toast.add({ title: 'Please select at least one question group', color: 'error' })
    return
  }

  try {
    submitting.value = true
    
    const payload = {
      studentId: formState.studentId,
      assessmentDate: formState.assessmentDate,
      summary: formState.summary,
      recommendation: formState.recommendation,
      teacherNotes: formState.teacherNotes,
      domainScores: Object.values(domainScores.value).map(ds => {
        const groupKey = `group_${ds.groupId}`
        const finalScore = ds.questionGroup ? calculateDomainScore(groupKey) : ds.score
        return {
          domain: ds.domain,
          score: finalScore,
          level: getLevel(finalScore),
          questionGroupId: ds.questionGroupId,
          questionScores: Object.entries(ds.questionScores).map(([qId, qs]: [string, any]) => ({
            questionText: ds.questions.find((q: any) => q.id.toString() === qId)?.questionText || '',
            score: qs.score,
            comment: qs.comment || ''
          }))
        }
      })
    }

    const response = await $fetch<any>('/api/assessments', {
      method: 'POST',
      body: payload
    })

    toast.add({ title: 'Assessment saved successfully', color: 'success' })
    
    // The server returns { message, assessment: { id, ... } }
    const newId = response?.assessment?.id || response?.id
    
    if (newId) {
      router.push(`/assessments/${newId}/activities`)
    } else {
      router.push('/assessments')
    }
  } catch (error: any) {
    console.error('Save error:', error)
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to save assessment', color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New Assessment</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new assessment for a student.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Student Information -->
        <UCard>
          <template #header>
            <h3 class="text-base font-semibold">Student Information</h3>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Select Student" required>
              <USelect v-model="formState.studentId" :items="students.map(s => ({ label: `${s.firstname} ${s.lastname}`, value: s.id }))" placeholder="Choose a student" class="w-full" size="lg"/>
            </UFormField>
            <UFormField label="Assessment Date" required>
              <UInput v-model="formState.assessmentDate" type="date" size="lg" class="w-full" />
            </UFormField>
          </div>

          <!-- Selected Student Info Display -->
          <div v-if="selectedStudent" class="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-6">
            <div class="flex-shrink-0">
              <img v-if="selectedStudent.image" :src="selectedStudent.image" class="h-20 w-20 rounded-full object-cover border-2 border-violet-500 shadow-sm" />
              <div v-else class="h-20 w-20 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center border-2 border-dashed border-violet-300 dark:border-violet-700">
                <UIcon name="i-lucide-user" class="h-10 w-10 text-violet-500" />
              </div>
            </div>
            <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Gender</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white capitalize">{{ selectedStudent.gender || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Age</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedStudent.age }} months</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Parent Name</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedStudent.parentName || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Birth Date</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedStudent.birthDate ? new Date(selectedStudent.birthDate).toLocaleDateString() : '-' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <UFormField label="Select Question Groups">
              <div class="flex gap-2">
                <USelect 
                  v-model="selectedGroupId" 
                  :items="allQuestionGroups.map(g => ({ label: `${g.title}`, value: g.id }))"
                  placeholder="Select a question group"
                  class="flex-1"
                />
                <UButton 
                  color="primary" 
                  size="lg"
                  :disabled="!selectedGroupId || selectedGroupIds.includes(selectedGroupId)"
                  @click="addGroup"
                >
                  Select
                </UButton>
              </div>
            </UFormField>
            <div v-if="selectedGroupIds.length > 0" class="mt-3 space-y-2">
              <div 
                v-for="groupId in selectedGroupIds" 
                :key="groupId"
                class="flex items-center justify-between p-3 border border-violet-500 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
              >
                <div>
                  <p class="font-medium">{{ allQuestionGroups.find(g => g.id === groupId)?.title }}</p>
                  <p class="text-sm text-gray-500">{{ allQuestionGroups.find(g => g.id === groupId)?.domain }}</p>
                </div>
                <UButton size="xs" variant="ghost" color="error" icon="i-lucide-x" @click="removeGroup(groupId)" />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Assessment Notes -->
        <UCard>
          <template #header>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Assessment Notes</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Assessment Summary" help="Provide a brief summary of the assessment findings.">
              <UTextarea v-model="formState.summary" placeholder="Enter assessment summary..." class="w-full" size="lg" :rows="3" />
            </UFormField>
            <UFormField label="Assessment Recommendations" help="Provide recommendations based on the assessment.">
              <UTextarea v-model="formState.recommendation" placeholder="Enter recommendations..." class="w-full" size="lg" :rows="3" />
            </UFormField>
            <UFormField label="Teacher Notes" help="Additional notes for the teacher.">
              <UTextarea v-model="formState.teacherNotes" placeholder="Enter teacher notes..." class="w-full" size="lg" :rows="3" />
            </UFormField>
          </div>
        </UCard>

        <!-- Assessment Information -->
        <template v-if="hasDomainScores">
          <UCard v-for="ds in domainScoresList" :key="ds.key">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold">{{ ds.groupTitle }}</h3>
                <span class="text-xs text-gray-500">{{ ds.questions?.length || 0 }} questions</span>
              </div>
            </template>
            
            <div class="space-y-4">
              <div v-if="ds.questions.length > 0" class="space-y-3 mb-4">
                <div v-for="question in ds.questions" :key="question.id" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex items-start justify-between gap-4 mb-2">
                    <p class="text-sm font-medium flex-1">{{ question.questionText }}</p>
                  </div>
                  <p v-if="question.description" class="text-xs text-gray-500 mb-3">{{ question.description }}</p>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <button
                      v-for="score in getScoreOptions(question.minScore || 1, question.maxScore || 3)"
                      :key="score"
                      :class="getScoreButtonClass(score, ds.questionScores[question.id]?.score)"
                      @click="setQuestionScore(ds.key, question.id, score)"
                    >
                      {{ score }}
                    </button>
                  </div>
                  <UInput 
                    v-if="ds.questionScores[question.id]"
                    :model-value="ds.questionScores[question.id].comment" 
                    placeholder="Comments"
                    class="w-full"
                    size="lg"
                    @update:model-value="val => setQuestionComment(ds.key, question.id, val)"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </template>

        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="ghost" size="lg" @click="router.push('/assessments')">Cancel</UButton>
          <UButton color="primary" :loading="submitting" :disabled="Object.keys(domainScores).length === 0" size="lg" @click="saveAssessment">Save Assessment</UButton>
        </div>
      </div>

      <!-- Summary Assessment Scores -->
      <div class="space-y-6">
        <UCard class="sticky top-6">
          <template #header>
            <h3 class="text-base font-semibold">Summary Assessment Scores</h3>
          </template>
          
          <div v-if="hasDomainScores" class="space-y-4">
            <!-- Overall Score -->
            <div class="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="font-semibold">Overall Score:</span>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-bold">{{ overallScore }}</span>
                  <span :class="['px-2 py-1 rounded-full text-sm', getLevelClass(overallLevel)]">{{ overallLevel }}</span>
                </div>
              </div>
            </div>

            <!-- Question Scores -->
            <div>
              <h4 class="text-sm font-medium mb-2">Question Scores</h4>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div v-for="(qs, index) in questionScoresList" :key="index" class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div class="flex-1 min-w-0 mr-2">
                    <p class="text-xs text-gray-500 truncate">{{ qs.groupTitle }}</p>
                    <p class="text-sm truncate">{{ qs.questionText }}</p>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="font-medium">{{ qs.score }}</span>
                    <span :class="['px-1.5 py-0.5 rounded-full text-xs', getLevelClass(qs.level)]">{{ qs.level }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Radar Chart -->
            <div v-if="questionScoresList.length > 0">
              <h4 class="text-sm font-medium mb-2">Development Profile</h4>
              <div class="aspect-square">
                <Radar :data="chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-4 text-gray-500">
            Select question groups to begin
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

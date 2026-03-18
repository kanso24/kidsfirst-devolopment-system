<script setup lang="ts">
import { h, ref } from 'vue'
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { data, pending, error } = await useFetch(`/api/assessments/${route.params.id}`)

const assessment = computed(() => data.value?.assessment)
const printRef = ref<HTMLElement | null>(null)

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

const printPDF = async () => {
  if (!assessment.value || !printRef.value) {
    toast.add({ title: 'Content not ready', color: 'error' })
    return
  }

  try {
    toast.add({ title: 'Generating PDF...', color: 'primary' })
    
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const element = printRef.value
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.body.querySelector('.print-content')
        if (clonedElement) {
          const style = clonedDoc.createElement('style')
          style.textContent = `
            * {
              color: inherit !important;
              background-color: #ffffff !important;
              background: #ffffff !important;
              border-color: #e5e7eb !important;
            }
            .no-print { display: none !important; }
          `
          clonedDoc.head.appendChild(style)
          
          const allElements = clonedElement.querySelectorAll('*')
          allElements.forEach((el: any) => {
            const computed = el.style
            if (computed.backgroundColor && computed.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = '#ffffff'
            }
            if (computed.borderColor && computed.borderColor.includes('oklch')) {
              el.style.borderColor = '#e5e7eb'
            }
            if (computed.color && computed.color.includes('oklch')) {
              el.style.color = '#000000'
            }
          })
        }
      }
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    const pxToMm = 25.4 / 96
    const imgWidthMm = (canvas.width / 2) * pxToMm
    const imgHeightMm = (canvas.height / 2) * pxToMm
    
    const ratio = Math.min(pdfWidth / imgWidthMm, pdfHeight / imgHeightMm)
    const finalWidth = imgWidthMm * ratio
    const finalHeight = imgHeightMm * ratio
    const imgX = (pdfWidth - finalWidth) / 2
    const imgY = 5

    pdf.addImage(imgData, 'JPEG', imgX, imgY, finalWidth, finalHeight)
    
    const pdfBlob = pdf.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `Assessment_Report_${assessment.value.assessmentNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(pdfUrl)

    toast.add({ title: 'PDF downloaded successfully', color: 'green' })
  } catch (err) {
    console.error('PDF Error:', err)
    toast.add({ title: `Failed to generate PDF: ${err}`, color: 'error' })
  }
}

useHead({
  title: `Assessment Report - ${assessment.value?.assessmentNumber || ''} | KidsFirst`
})
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between no-print">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Assessment Summary</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ assessment?.assessmentNumber }} - {{ assessment?.student?.firstname }} {{ assessment?.student?.lastname }}
        </p>
      </div>
      <div class="mt-4 sm:ml-4 sm:mt-0 flex gap-2">
        <UButton color="primary" variant="solid" icon="i-lucide-download" size="lg" @click="printPDF">Print PDF</UButton>
        <UButton color="gray" variant="ghost" icon="i-lucide-arrow-left" size="lg" @click="router.push('/reports')">Back</UButton>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="animate-spin h-8 w-8 text-gray-400" />
    </div>

    <template v-else-if="assessment">
      <div ref="printRef" class="print-content bg-white">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 class="text-base font-semibold mb-4 text-gray-900">Assessment Information</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Assessment #</p>
                  <p class="font-medium text-gray-900">{{ assessment.assessmentNumber }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Student</p>
                  <p class="font-medium text-gray-900">{{ assessment.student?.firstname }} {{ assessment.student?.lastname }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Age</p>
                  <p class="font-medium text-gray-900">{{ assessment.student?.age }} years</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Assessment Date</p>
                  <p class="font-medium text-gray-900">{{ new Date(assessment.assessmentDate).toLocaleDateString() }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 class="text-base font-semibold mb-4 text-gray-900">Current Assessment Scores</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th class="px-4 py-3">#</th>
                      <th class="px-4 py-3">Domain</th>
                      <th class="px-4 py-3">Question</th>
                      <th class="px-4 py-3">Score</th>
                      <th class="px-4 py-3">Level</th>
                      <th class="px-4 py-3">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in assessment.domainScores?.flatMap((ds: any) => 
                      (ds.questionScores || []).map((qs: any, idx: number) => ({
                        index: idx + 1,
                        domain: ds.domain,
                        questionText: qs.questionText,
                        score: qs.score,
                        level: ds.level,
                        comment: qs.comment || '-'
                      }))
                    ) || []" :key="row.index" class="border-b">
                      <td class="px-4 py-3">{{ row.index }}</td>
                      <td class="px-4 py-3">{{ row.domain }}</td>
                      <td class="px-4 py-3">{{ row.questionText }}</td>
                      <td class="px-4 py-3 font-medium">{{ row.score }}</td>
                      <td class="px-4 py-3">
                        <span :class="['px-2 py-1 rounded-full text-xs', getLevelClass(row.level)]">
                          {{ row.level }}
                        </span>
                      </td>
                      <td class="px-4 py-3">{{ row.comment }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-gray-900">Child Development Profile</h3>
                <span :class="['px-2 py-1 rounded-full text-sm', getLevelClass(assessment.overallLevel)]">
                  {{ assessment.overallLevel }}
                </span>
              </div>
              
              <div class="text-center mb-4">
                <p class="text-sm text-gray-500">Overall Score</p>
                <p class="text-4xl font-bold text-violet-600">{{ assessment.overallScore?.toFixed(2) }}</p>
              </div>

              <div v-if="chartData" class="aspect-square">
                <Radar :data="chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Assessment not found</p>
      <UButton color="primary" class="mt-4" @click="router.push('/reports')">Back to Reports</UButton>
    </div>
  </div>
</template>

<style>
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }
  .no-print {
    display: none !important;
  }
  .print-content {
    width: 100%;
  }
}
</style>

<script setup lang="ts">
type DomainKey =
  | 'sensory'
  | 'visual'
  | 'gross_motor'
  | 'fine_motor'
  | 'social_language'

type Level = 'Emerging' | 'Developing' | 'Proficient' | 'Advanced'

interface Student {
  firstname?: string
  lastname?: string
  age?: number
  image?: string
  gender?: string
  parentName?: string
  birthDate?: string | Date
}

interface DomainScore {
  domain: DomainKey | string
  score: number
  level?: Level
}

interface Assessment {
  assessmentNumber: string
  assessmentDate: string
  overallScore: number
  overallLevel: Level
  teacherNotes?: string
  summary?: string
  recommendation?: string
  student?: Student
  domainScores?: DomainScore[]
}

interface AssessmentResponse {
  assessment: Assessment
}

interface DomainMeta {
  label: string
  icon: string
  color: string
  gradient: string
}

interface ActivityConfig {
  goal: string
  frequency: string
  tips: string[]
}

interface DomainCard extends DomainMeta, ActivityConfig {
  domain: string
  score: number
  level: Level
}

const route = useRoute()
const router = useRouter()

const assessmentId = computed(() => String(route.params.id ?? ''))

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap'
    }
  ]
})

const { data, pending, error } = await useFetch<AssessmentResponse>(
  `/api/assessments/${assessmentId.value}`
)

const assessment = computed(() => data.value?.assessment ?? null)
const student = computed(() => assessment.value?.student ?? null)

const currentMonth = computed(() =>
  new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  })
)

const domainMeta: Record<string, DomainMeta> = {
  sensory: {
    label: 'Sensory',
    icon: '✋',
    color: '#8b5cf6',
    gradient: 'from-violet-50 to-purple-50'
  },
  visual: {
    label: 'Visual',
    icon: '👁️',
    color: '#3b82f6',
    gradient: 'from-blue-50 to-sky-50'
  },
  gross_motor: {
    label: 'Gross Motor',
    icon: '🏃',
    color: '#10b981',
    gradient: 'from-emerald-50 to-green-50'
  },
  fine_motor: {
    label: 'Fine Motor',
    icon: '✏️',
    color: '#f59e0b',
    gradient: 'from-amber-50 to-yellow-50'
  },
  social_language: {
    label: 'Social & Language',
    icon: '💬',
    color: '#ec4899',
    gradient: 'from-pink-50 to-rose-50'
  }
}

const fallbackMeta: DomainMeta = {
  label: 'Unknown Domain',
  icon: '📊',
  color: '#8b5cf6',
  gradient: 'from-gray-50 to-slate-50'
}

const fallbackActivity: ActivityConfig = {
  goal: 'Continue current activities',
  frequency: 'Daily',
  tips: ['Keep up the great work!']
}

const activityMap: Record<string, Record<Level, ActivityConfig>> = {
  sensory: {
    Emerging: {
      goal: 'Build basic sensory awareness',
      frequency: 'Daily, 5–10 min',
      tips: [
        'Introduce textured surfaces (soft, rough, bumpy)',
        'Allow supervised play with sand or rice bins',
        'Use gentle massage during bath time'
      ]
    },
    Developing: {
      goal: 'Expand comfort with varied textures',
      frequency: 'Daily, 10–15 min',
      tips: [
        'Sort objects by texture (smooth vs. rough)',
        'Finger painting with different materials',
        'Barefoot walking on various surfaces'
      ]
    },
    Proficient: {
      goal: 'Strengthen sensory discrimination',
      frequency: 'Daily, 15 min',
      tips: [
        'Blindfold touch-and-guess games',
        'Sensory bins with hidden objects',
        'Music and rhythm activities'
      ]
    },
    Advanced: {
      goal: 'Refine multi-sensory integration',
      frequency: '3–4x/week',
      tips: [
        'Complex sensory obstacle courses',
        'Cooking/baking sensory projects',
        'Nature exploration walks'
      ]
    }
  },
  visual: {
    Emerging: {
      goal: 'Develop basic visual tracking',
      frequency: 'Daily, 5 min',
      tips: [
        'Track a slow-moving toy left to right',
        'High-contrast black-and-white patterns',
        'Face-to-face play at close range'
      ]
    },
    Developing: {
      goal: 'Improve visual focus and tracking',
      frequency: 'Daily, 10 min',
      tips: [
        'Guided picture-book reading',
        'Simple puzzles with large pieces',
        'Spot-the-difference activities'
      ]
    },
    Proficient: {
      goal: 'Strengthen visual-spatial skills',
      frequency: 'Daily, 15 min',
      tips: [
        'Pattern building with blocks',
        'Memory card matching games',
        'Drawing shapes and copying patterns'
      ]
    },
    Advanced: {
      goal: 'Develop advanced visual processing',
      frequency: '3–4x/week',
      tips: [
        'Complex jigsaw puzzles (24+ pieces)',
        'Maze activities on paper',
        'Letter/number recognition games'
      ]
    }
  },
  gross_motor: {
    Emerging: {
      goal: 'Strengthen core balance and movement',
      frequency: 'Daily, 10–15 min',
      tips: [
        'Rolling and tumbling on soft mats',
        'Assisted standing and stepping',
        'Tummy-time play'
      ]
    },
    Developing: {
      goal: 'Build coordination and stability',
      frequency: 'Daily, 15–20 min',
      tips: [
        'Walking along a balance beam',
        'Kicking/rolling a large ball',
        'Simple obstacle courses'
      ]
    },
    Proficient: {
      goal: 'Advance agility and body awareness',
      frequency: 'Daily, 20 min',
      tips: [
        'Jumping and hopping games',
        'Tricycle or balance bike riding',
        'Dancing to music'
      ]
    },
    Advanced: {
      goal: 'Develop complex movement sequences',
      frequency: '3–4x/week',
      tips: [
        'Sports skill games (throwing/catching)',
        'Yoga for kids poses',
        'Swimming or gymnastics'
      ]
    }
  },
  fine_motor: {
    Emerging: {
      goal: 'Develop hand strength and grasp',
      frequency: 'Daily, 5–10 min',
      tips: [
        'Squeezing soft play dough',
        'Picking up large beads',
        'Tearing paper strips'
      ]
    },
    Developing: {
      goal: 'Improve pincer grip and hand control',
      frequency: 'Daily, 10–15 min',
      tips: [
        'Threading large beads',
        'Using chunky crayons for coloring',
        'Pouring activities with water'
      ]
    },
    Proficient: {
      goal: 'Strengthen precision and dexterity',
      frequency: 'Daily, 15 min',
      tips: [
        'Cutting with child-safe scissors',
        'Fastening buttons and zippers',
        'Stacking small blocks'
      ]
    },
    Advanced: {
      goal: 'Refine complex hand coordination',
      frequency: '3–4x/week',
      tips: [
        'Writing letters and numbers',
        'Origami (simple folds)',
        'Weaving or bead crafts'
      ]
    }
  },
  social_language: {
    Emerging: {
      goal: 'Encourage early social responses',
      frequency: 'Daily, 10 min',
      tips: [
        'Make eye contact and smile during play',
        'Narrate daily activities',
        'Simple call-and-response songs'
      ]
    },
    Developing: {
      goal: 'Build basic communication skills',
      frequency: 'Daily, 15 min',
      tips: [
        'Read picture books together',
        'Ask simple questions',
        'Encourage imitation of words/sounds'
      ]
    },
    Proficient: {
      goal: 'Develop conversational turn-taking',
      frequency: 'Daily, 15–20 min',
      tips: [
        'Role-play with dolls/figures',
        'Group play with 1–2 peers',
        'Tell-me-about-your-day routine'
      ]
    },
    Advanced: {
      goal: 'Expand language and social thinking',
      frequency: '3–4x/week',
      tips: [
        'Story sequencing activities',
        'Collaborative games (board games)',
        'Show-and-tell presentations'
      ]
    }
  }
}

const levelColors: Record<Level, string> = {
  Emerging: '#f87171',
  Developing: '#fbbf24',
  Proficient: '#34d399',
  Advanced: '#8b5cf6'
}

const domainCards = computed<DomainCard[]>(() => {
  const scores = assessment.value?.domainScores ?? []

  if (scores.length === 0) {
    console.warn('No domain scores found for this assessment')
  }

  return scores.map((item) => {
    const meta = domainMeta[item.domain] ?? {
      ...fallbackMeta,
      label: item.domain
    }

    const level: Level = (item.level as Level) ?? 'Developing'
    const activities = activityMap[item.domain]?.[level] ?? fallbackActivity

    return {
      domain: item.domain,
      score: item.score || 0,
      level,
      ...meta,
      ...activities
    }
  })
})

const overallProgress = computed(() => {
  const score = assessment.value?.overallScore ?? 0
  return Math.round((score / 3) * 100)
})

const activeTab = ref('all')

const tabs = computed(() => [
  { key: 'all', label: 'All Domains' },
  ...domainCards.value.map((card) => ({
    key: card.domain,
    label: card.label
  }))
])

const visibleCards = computed(() => {
  if (activeTab.value === 'all') return domainCards.value
  return domainCards.value.filter((card) => card.domain === activeTab.value)
})

const teacherNotes = ref('')
const parentNotes = ref('')

watch(
  assessment,
  (value) => {
    teacherNotes.value = value?.teacherNotes ?? ''
    parentNotes.value = value?.recommendation ?? ''
  },
  { immediate: true }
)

const radius = 54
const circumference = 2 * Math.PI * radius

const ringOffset = computed(() => {
  return circumference - (overallProgress.value / 100) * circumference
})

const assessmentDateLabel = computed(() => {
  if (!assessment.value?.assessmentDate) return '-'

  return new Date(assessment.value.assessmentDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

function goBackToAssessments() {
  router.push('/assessments')
}

function goToFullReport() {
  router.push(`/assessments/${assessmentId.value}`)
}
</script>

<template>
  <div
    class="activities-page min-h-screen"
    style="font-family: 'DM Sans', sans-serif; background: linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 50%, #f0f9ff 100%);"
  >
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <div class="space-y-4 text-center">
        <div class="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        <p class="font-medium text-violet-600">Generating activities dashboard…</p>
      </div>
    </div>

    <div v-else-if="error" class="flex min-h-screen items-center justify-center px-4">
      <div class="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm border border-red-100">
        <div class="mb-4 text-4xl">⚠️</div>
        <h2 class="mb-2 text-xl font-bold text-gray-800" style="font-family: 'Fraunces', serif;">
          Unable to load assessment
        </h2>
        <p class="mb-6 text-sm text-gray-500">
          Something went wrong while loading this activity dashboard.
        </p>
        <button
          class="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
          @click="goBackToAssessments"
        >
          Back to Assessments
        </button>
      </div>
    </div>

    <div v-else-if="assessment" class="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <button
        class="inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition-colors hover:text-violet-800"
        @click="goBackToAssessments"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M15 19l-7-7 7-7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        Back to Assessments
      </button>

      <div
        class="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl"
        style="background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%);"
      >
        <div class="absolute -right-12 -top-12 h-48 w-48 rounded-full" style="background: rgba(255,255,255,.08)" />
        <div class="absolute -bottom-8 -left-8 h-32 w-32 rounded-full" style="background: rgba(255,255,255,.05)" />

        <div class="relative flex flex-col gap-8 md:flex-row md:items-center">
          <!-- Student Image -->
          <div class="relative flex-shrink-0">
            <img v-if="student?.image" :src="student.image" class="h-28 w-28 rounded-3xl object-cover border-4 border-white/30 shadow-2xl" />
            <div v-else class="h-28 w-28 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-dashed border-white/30 shadow-2xl">
              <UIcon name="i-lucide-user" class="h-12 w-12 text-white/50" />
            </div>
            <div class="absolute -bottom-2 -right-2 transform transition-transform hover:scale-110">
              <div class="bg-white rounded-xl p-1.5 shadow-lg">
                <span class="text-xl">{{ student?.gender === 'female' ? '👧' : '👦' }}</span>
              </div>
            </div>
          </div>

          <div class="flex-1 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">✨</span>
                <span
                  class="text-xs font-bold uppercase tracking-widest"
                  style="color: rgba(255,255,255,.7)"
                >
                  Monthly Activities Plan
                </span>
              </div>

              <h1
                class="text-3xl font-bold leading-tight md:text-5xl"
                style="font-family: 'Fraunces', serif"
              >
                {{ student?.firstname }}'s Activities
              </h1>
            </div>

            <div class="flex flex-wrap gap-4 text-sm" style="color: rgba(255,255,255,.9)">
              <div class="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
                <span class="font-medium text-white">{{ student?.firstname }} {{ student?.lastname }}</span>
              </div>

              <div class="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
                <span class="font-medium text-white">{{ student?.age }} months old</span>
              </div>

              <div class="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
                <span class="font-medium text-white">{{ currentMonth }}</span>
              </div>
            </div>

            <p
              class="max-w-[550px] text-sm italic md:text-lg"
              style="color: rgba(255,255,255,.8)"
            >
              "Supporting the growth of children with personalized developmental goals."
            </p>
          </div>

          <div class="text-right md:flex-shrink-0">
            <div
              class="inline-block rounded-2xl px-5 py-4"
              style="background: rgba(255,255,255,.15); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.2)"
            >
              <p class="text-[10px] font-bold uppercase tracking-widest" style="color: rgba(255,255,255,.7)">Assessment No.</p>
              <p class="text-xl font-black tracking-tight">{{ assessment.assessmentNumber }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
        <div class="flex flex-col items-center gap-8 md:flex-row">
          <div class="relative h-40 w-40 flex-shrink-0">
            <svg class="h-full w-full -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" :r="radius" fill="none" stroke="#ede9fe" stroke-width="10" />
              <circle
                cx="64"
                cy="64"
                :r="radius"
                fill="none"
                stroke="#8b5cf6"
                stroke-linecap="round"
                stroke-width="10"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="ringOffset"
                style="transition: stroke-dashoffset 1s ease"
              />
            </svg>

            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span
                class="text-3xl font-bold text-violet-700"
                style="font-family: 'Fraunces', serif"
              >
                {{ overallProgress }}%
              </span>
              <span class="text-xs font-medium text-gray-400">Overall</span>
            </div>
          </div>

          <div class="flex-1 space-y-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-800" style="font-family: 'Fraunces', serif">
                Monthly Progress Summary
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Based on {{ domainCards.length }} domain{{ domainCards.length !== 1 ? 's' : '' }}
                assessed on {{ assessmentDateLabel }}
              </p>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
              :style="`background: ${levelColors[assessment.overallLevel]}22; color: ${levelColors[assessment.overallLevel]}`"
            >
              <span
                class="h-2 w-2 rounded-full"
                :style="`background: ${levelColors[assessment.overallLevel]}`"
              />
              Overall Level: {{ assessment.overallLevel }}
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="card in domainCards"
                :key="card.domain"
                class="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                :style="`border-color: ${card.color}44; background: ${card.color}11; color: ${card.color}`"
              >
                {{ card.icon }} {{ card.label }}: <em>{{ card.level }}</em>
              </span>
            </div>

            <p class="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {{ assessment?.summary || `🌟 ${student?.firstname} is making wonderful progress! The activities below are carefully chosen to support each development domain this month. Consistency and patience are key — even 10 minutes a day makes a big difference.` }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-6 flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200"
            :class="
              activeTab === tab.key
                ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:text-violet-600'
            "
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="space-y-4">
          <transition-group name="card-fade" tag="div" class="space-y-4">
            <div
              v-for="card in visibleCards"
              :key="card.domain"
              class="overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              :style="`border-color: ${card.color}33`"
            >
              <div class="flex items-center gap-4 px-6 py-4" :class="`bg-gradient-to-r ${card.gradient}`">
                <div
                  class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
                >
                  {{ card.icon }}
                </div>

                <div class="min-w-0 flex-1">
                  <h3 class="text-lg font-bold text-gray-800" style="font-family: 'Fraunces', serif">
                    {{ card.label }}
                  </h3>
                  <p class="truncate text-sm text-gray-500">{{ card.goal }}</p>
                </div>

                <div class="flex flex-shrink-0 flex-col items-end gap-1">
                  <span
                    class="rounded-full px-3 py-0.5 text-xs font-bold"
                    :style="`background: ${levelColors[card.level]}22; color: ${levelColors[card.level]}`"
                  >
                    {{ card.level }}
                  </span>
                  <span class="text-xs text-gray-400">Score {{ card.score?.toFixed(1) }}</span>
                </div>
              </div>

              <div class="space-y-4 px-6 py-5">
                <div class="flex items-center gap-2">
                  <svg
                    class="h-4 w-4 flex-shrink-0"
                    :style="`color: ${card.color}`"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                  <span class="text-sm font-semibold" :style="`color: ${card.color}`">
                    Recommended: {{ card.frequency }}
                  </span>
                </div>

                <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div
                    v-for="(tip, i) in card.tips"
                    :key="i"
                    class="rounded-2xl border p-4 text-sm leading-relaxed text-gray-700"
                    :class="`bg-gradient-to-br ${card.gradient}`"
                    :style="`border-color: ${card.color}22`"
                  >
                    <span class="mr-1 font-bold" :style="`color: ${card.color}`">
                      {{ ['①', '②', '③'][i] }}
                    </span>
                    {{ tip }}
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="space-y-3 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="text-xl">📝</span>
            <h3 class="font-bold text-gray-800" style="font-family: 'Fraunces', serif">
              Teacher Notes
            </h3>
          </div>
          <p class="text-xs text-gray-400">Observations, tips, and next-session focus areas</p>
          <textarea
            v-model="teacherNotes"
            rows="5"
            placeholder="Write your observations and recommendations for the teacher here…"
            class="w-full resize-none rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        <div class="space-y-3 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="text-xl">🏠</span>
            <h3 class="font-bold text-gray-800" style="font-family: 'Fraunces', serif">
              Parent Recommendations
            </h3>
          </div>
          <p class="text-xs text-gray-400">Activities and tips to continue at home</p>
          <textarea
            v-model="parentNotes"
            rows="5"
            placeholder="Write home-based activity suggestions for parents here…"
            class="w-full resize-none rounded-2xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      <div class="flex flex-col justify-end gap-3 pb-8 pt-2 sm:flex-row">
        <button
          class="rounded-full border border-violet-200 px-6 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
          @click="goToFullReport"
        >
          View Full Report
        </button>
        <button
          class="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
          @click="goBackToAssessments"
        >
          Back to Assessments
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.3s ease;
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
<script setup lang="ts">
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface Props {
  data: number[]
  labels: string[]
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#8b5cf6'
})

const chartData = computed<ChartData<'radar'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Assessment Score',
      data: props.data,
      backgroundColor: `${props.color}33`,
      borderColor: props.color,
      borderWidth: 2,
      pointBackgroundColor: props.color,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: props.color,
      fill: true
    }
  ]
}))

const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      suggestedMin: 0,
      suggestedMax: 3,
      ticks: {
        stepSize: 1,
        display: false
      },
      pointLabels: {
        font: {
          family: "'DM Sans', sans-serif",
          size: 11,
          weight: 600
        },
        color: '#6b7280'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `Score: ${context.parsed.r.toFixed(2)}`
      }
    }
  }
}))
</script>

<template>
  <div class="radar-chart-container relative h-full w-full">
    <Radar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.radar-chart-container {
  min-height: 250px;
}
</style>

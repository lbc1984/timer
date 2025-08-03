<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex justify-center items-center px-4 py-6 sm:max-w-full">
    <div class="bg-white rounded-2xl shadow-xl sm:w-[100%] md:w-[100%] lg:w-[50%] p-6 space-y-6 animate-fade-in">
      <h2 class="text-2xl sm:text-4xl lg:text-3xl font-bold text-gray-800 text-center">⏰ Hẹn giờ bật</h2>

      <div v-for="(time, index) in times" :key="index" class="flex sm:flex-row items-center gap-4">
        <div class="flex flex-1 items-center gap-3">
          <label class="block text-gray-600 mb-1 text-xl">Giờ</label>
          <input v-model.number="time.hour" type="number" min="0" max="23" @change="scheduleStart"
            class="flex-1 w-full p-4 text-xl border rounded-lg text-center" />
        </div>
        <div class="flex flex-1 items-center gap-3">
          <label class="block text-gray-600 mb-1 text-xl">Phút</label>
          <input v-model.number="time.minute" type="number" min="0" max="59" @change="scheduleStart"
            class="w-full p-4 text-xl border rounded-lg text-center" />
        </div>
        <button v-if="times.length > 1" @click="removeTime(index)"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xl">
          ✕
        </button>
      </div>

      <div v-if="duplicateMessage" class="text-red-600 text-base text-center">
        {{ duplicateMessage }}
      </div>

      <button @click="addTime"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-xl font-semibold">
        ➕ Thêm giờ bật
      </button>

      <div>
        <label class="block text-xl text-gray-600 mb-1">Tự tắt sau (giây)</label>
        <input v-model.number="autoOffSeconds" type="number" min="1"
          class="w-full p-4 text-xl border rounded-lg text-center" />
      </div>

      <div v-if="scheduledTimes.length" class="text-xl text-gray-800 space-y-2">
        <div v-for="(t, i) in scheduledTimes" :key="i">
          ⏳ Hẹn bật lúc: <strong>{{ t.time }}</strong>, sẽ tắt sau <strong>{{ autoOffSeconds }} giây</strong>
        </div>
      </div>

      <div class="text-xl font-bold text-center">
        ⚙️ Thiết bị:
        <span :class="isOn ? 'text-green-600' : 'text-red-600'">
          {{ isOn ? 'ĐANG BẬT' : 'ĐANG TẮT' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const times = ref([{ hour: 7, minute: 0 }])
const autoOffSeconds = ref(10)
const isOn = ref(false)
const scheduledTimes = ref([])
const duplicateMessage = ref('')

let checkInterval = null
let offTimeout = null

function format24HourTime(d) {
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  return `${hh}:${mm}`
}

function addTime() {
  const newHour = 0
  const newMinute = 0
  const key = `${newHour}:${newMinute}`
  const exists = times.value.some(t => `${t.hour}:${t.minute}` === key)

  if (exists) {
    duplicateMessage.value = `Giờ ${newHour} phút ${newMinute} đã tồn tại. Vui lòng chỉnh lại trước khi thêm.`
    return
  }

  duplicateMessage.value = ''
  times.value.push({ hour: newHour, minute: newMinute })
  scheduleStart()
}

function removeTime(index) {
  times.value.splice(index, 1)
  scheduleStart()
}

function scheduleStart() {
  scheduledTimes.value = []
  const now = new Date()

  const seen = new Set()
  for (const t of times.value) {
    const key = `${t.hour}:${t.minute}`
    if (seen.has(key)) {
      duplicateMessage.value = `Giờ ${t.hour} phút ${t.minute} bị trùng. Vui lòng chỉnh lại.`
      return
    }
    seen.add(key)
  }

  duplicateMessage.value = ''

  const allTimes = times.value.map((t) => {
    const d = new Date()
    d.setHours(t.hour)
    d.setMinutes(t.minute)
    d.setSeconds(0)
    if (d <= now) d.setDate(d.getDate() + 1)
    return d
  })

  scheduledTimes.value = allTimes.map((d) => ({
    time: format24HourTime(d),
    timestamp: d.getTime(),
  }))

  if (checkInterval) clearInterval(checkInterval)
  if (offTimeout) clearTimeout(offTimeout)

  checkInterval = setInterval(() => {
    const current = new Date()
    for (const t of scheduledTimes.value) {
      const d = new Date(t.timestamp)
      if (
        current.getHours() === d.getHours() &&
        current.getMinutes() === d.getMinutes() &&
        current.getSeconds() === d.getSeconds()
      ) {
        isOn.value = true
        offTimeout = setTimeout(() => {
          isOn.value = false
          scheduledTimes.value = []
        }, autoOffSeconds.value * 1000)
        clearInterval(checkInterval)
        break
      }
    }
  }, 1000)
}

onMounted(() => {
  scheduleStart()
})

onUnmounted(() => {
  if (checkInterval) clearInterval(checkInterval)
  if (offTimeout) clearTimeout(offTimeout)
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}
</style>

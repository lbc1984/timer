<template>
    <div class="w-full max-w-1xl lg:p-10 space-y-10 text-xl lg:text-xl">
        <h2 class="text-4xl font-bold text-gray-800 text-center">⏰ {{ props.device.name }}</h2>

        <div v-for="(time, index) in times" :key="index" class="flex flex-row sm:flex-row items-center gap-6">
            <div class="flex flex-1 items-center gap-6">
                <label class="text-gray-600">Giờ</label>
                <input v-model.number="time.hour" type="number" min="0" max="23" @change="scheduleStart"
                    class="w-full p-3 border rounded-2xl text-center text-xl" />
            </div>
            <div class="flex flex-1 items-center gap-6">
                <label class="text-gray-600">Phút</label>
                <input v-model.number="time.minute" type="number" min="0" max="59" @change="scheduleStart"
                    class="w-full p-3 border rounded-2xl text-center text-xl" />
            </div>
            <button v-if="times.length > 1" @click="removeTime(index)"
                class="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl">✕</button>
        </div>

        <div v-if="duplicateMessage" class="text-red-600 text-center">
            {{ duplicateMessage }}
        </div>

        <div class="flex justify-center">
            <button @click="addTime"
                class="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-10 rounded-3xl font-semibold">
                Thêm giờ bật
            </button>
        </div>

        <div class="flex flex-row items-center space-x-5">
            <label class="text-gray-600 lg:whitespace-nowrap" for="autoOffSeconds">Tự tắt sau (giây)</label>
            <input v-model.number="autoOffSeconds" type="number" name="autoOffSeconds" min="1" class="p-3 border rounded-2xl text-center text-xl lg:w-full md:w-[25%]" />
        </div>

        <div v-if="scheduledTimes.length" class="text-gray-800 space-y-4 border-t-2 pt-6 border-gray-300">
            <div v-for="(t, i) in scheduledTimes" :key="i">
                ⏳ Hẹn bật lúc: <strong>{{ t.time }}</strong>, sẽ tắt sau <strong>{{ autoOffSeconds }} giây</strong>
            </div>
        </div>

        <div class="flex justify-center gap-6">
            <button @click="$emit('save', scheduleTime)" class="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-2xl font-semibold">
                💾 Lưu
            </button>
            <button @click="$emit('close')" class="bg-gray-400 hover:bg-gray-500 text-white px-10 py-3 rounded-2xl font-semibold">
                ❌ Hủy
            </button>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const times = ref([{ hour: 7, minute: 0 }])
const autoOffSeconds = ref(10)
const scheduledTimes = ref([])
const duplicateMessage = ref('')
const props = defineProps({
    device: {
        type: Object,
        required: true
    }
})

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
                offTimeout = setTimeout(() => {
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
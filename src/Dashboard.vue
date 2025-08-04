<template>
    <div class="p-6 bg-slate-300 w-screen h-screen">
        <h1 class="text-6xl lg:text-3xl font-bold mb-10">Thiết bị của bạn</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:text-xl text-5xl">
            <div v-for="device in devices" :key="device.mac"
                class="bg-white rounded-3xl shadow-xl p-10 transform transition-transform hover:-translate-y-2 hover:shadow-2xl">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="font-semibold">
                        {{ device.name || device.mac }}
                    </h2>
                    <span class="px-6 py-3 rounded-full" :class="device.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ device.status ? 'Bật' : 'Tắt' }}
                    </span>
                </div>

                <div class="flex items-center justify-between mt-10">
                    <button @click="toggleDevice(device)" class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-3xl">
                        {{ device.status ? 'Tắt' : 'Bật' }}
                    </button>

                    <button @click="openSchedule(device)" class="text-gray-600 hover:underline">
                        Hẹn giờ
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: Schedule -->
        <div v-if="showSchedule" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto overflow-x-hidden">
                <Schedule @save="saveSchedule" @close="showSchedule = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Schedule from './compoment/Schedule.vue'

const devices = ref([
    { mac: 'AA:BB:CC:01', name: 'Đèn phòng khách', status: true },
    { mac: 'AA:BB:CC:02', name: 'Quạt trần', status: false },
    { mac: 'AA:BB:CC:02', name: 'Quạt trần', status: false },
    { mac: 'AA:BB:CC:02', name: 'Quạt trần', status: false },
])

const showSchedule = ref(false)
const selectedDevice = ref(null)
const scheduleTime = ref('')
onMounted(() => {
})

function toggleDevice(device) {
    device.status = !device.status
    // Gửi MQTT hoặc gọi API bật/tắt ở đây
}

function openSchedule(device) {
    selectedDevice.value = device
    showSchedule.value = true
    scheduleTime.value = '' // reset
}

function saveSchedule() {
    console.log('Lưu lịch hẹn giờ:', selectedDevice.value.mac, scheduleTime.value)
    // Lưu schedule lên Firebase hoặc gửi MQTT tùy ý
    showSchedule.value = false
}
</script>

<style scoped>
body {
    background-color: #f8fafc;
}
</style>

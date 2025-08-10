<template>
    <div class="p-6 bg-slate-300 w-screen lg:h-screen">
        <h1 class="text-3xl font-bold mb-10 text-center">Thiết bị của bạn</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:text-xl text-3xl">
            <div v-for="device in devices" :key="device.mac"
                class="bg-white rounded-3xl shadow-xl p-10 transform transition-transform hover:-translate-y-2 hover:shadow-2xl">

                <div class="flex justify-between items-center mb-8">
                    <!-- Nếu đang edit thì hiển thị input -->
                    <div v-if="editingDevice === device.mac" class="w-full">
                        <input v-model="tempName"
                               @keyup.enter="saveName(device)"
                               @blur="saveName(device)"
                               class="border-b border-gray-400 focus:outline-none px-2 w-full" />
                    </div>
                    <!-- Nếu không edit thì hiển thị tên -->
                    <h2 v-else class="font-semibold cursor-pointer" @click="editName(device)">
                        {{ device.name || device.mac }}
                    </h2>
                </div>

                <div class="flex items-center justify-between mt-10">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" :checked="device.status"
                            @change="toggleDevice(device)" />
                        <div class="w-20 h-8 flex items-center rounded-full p-1
                bg-gray-300 peer-checked:bg-green-500
                transition-colors duration-300">
                            <span class="text-sm text-white ml-2" v-if="device.status">ON</span>
                            <span class="text-sm text-white ml-auto mr-2" v-else>OFF</span>
                            <div class="bg-white w-6 h-6 rounded-full shadow-md transform
                    transition-transform duration-300
                    peer-checked:translate-x-[52px]"></div>
                        </div>
                    </label>
                    <button @click="openSchedule(device)" class="text-gray-600 hover:underline">
                        Hẹn giờ
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: Schedule -->
        <div v-if="showSchedule" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div
                class="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto overflow-x-hidden">
                <Schedule @save="saveSchedule" @close="showSchedule = false" :device="selectedDevice"/>
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
    { mac: 'AA:BB:CC:03', name: 'Đèn ngủ', status: false },
    { mac: 'AA:BB:CC:04', name: 'Điều hòa', status: false },
])

const showSchedule = ref(false)
const selectedDevice = ref(null)
const scheduleTime = ref('')

// Biến cho chức năng edit tên
const editingDevice = ref(null)
const tempName = ref("")

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

// Bắt đầu edit
function editName(device) {
    editingDevice.value = device.mac
    tempName.value = device.name
}

// Lưu tên mới
function saveName(device) {
    if (tempName.value.trim()) {
        device.name = tempName.value.trim()
        // Ở đây bạn có thể gọi API lưu tên về server
    }
    editingDevice.value = null
}
</script>

<style scoped>
body {
    background-color: #f8fafc;
}
</style>

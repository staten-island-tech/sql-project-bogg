<template>
  <div class="toggle-switch">
    <button :class="{ active: state === 'left' }" @click="toggleLeft">All</button>
    <button :class="{ active: state === 'middle' }" @click="toggleMiddle">Min/Max</button>
    <button :class="{ active: state === 'right' }" @click="toggleRight">Default</button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch, onMounted } from 'vue'

const emit = defineEmits(['select'])

const state = ref('left')

function toggleLeft() {
  state.value = 'left'
  emit('select', 'all')
}

function toggleMiddle() {
  state.value = 'middle'
  emit('select', 'minMax')
}
function toggleRight() {
  state.value = 'right'
  emit('select', 'default')
}

onMounted(() => {
  emit('select', 'all')
}) 
</script>

<style scoped>
.toggle-switch {
  margin: auto;
  margin-bottom: 10px;
}

button {
  width: 65px;
  padding: 8px 16px;
  border: none;
  outline: none;
  background-color: #555;
  cursor: pointer;
  color: #a7a7a7;
}

button.active {
  background-color: #333;
  color: #fff;
}
</style>

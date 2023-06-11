<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="slider">
      <div class="progress" :style="progressWidth"></div>
    </div>
    <div class="range-input" v-if="maxValue <= 10">
      <input type="range" class="range-min" min="0" :max="totalValue" step="0.1" v-model="minValue" />
      <input type="range" class="range-max" min="0" :max="totalValue" step="0.1" v-model="maxValue" />
      <div class="nums">
        <p>{{ symbol }}{{ genValue(minValue) }}</p>
        <p>{{ symbol }}{{ genValue(maxValue) }}</p>
      </div>
    </div>
    <div class="range-input" v-else>
      <input type="range" class="range-min" min="0" :max="totalValue" step="10" v-model="minValue" />
      <input type="range" class="range-max" min="0" :max="totalValue" step="10" v-model="maxValue" />
      <div class="nums">
        <p>{{ !tempSymbol ? symbol : tempSymbol }}{{ genValue(minValue) }}</p>
        <p>{{ !tempSymbol ? symbol : tempSymbol }}{{ genValue(maxValue) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, computed, watch, onMounted } from 'vue'

const props = defineProps({
  valueList: {
    type: Array,
    required: true
  },
  symbol: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['change'])

const minValue = ref(0)
const maxValue = ref(1000000000000000)
const valueGap = ref(10)
const totalValue = ref(1000000000000000)

function genValue(value) {
  value = parseFloat(value)
  return value > 10000 ? value.toExponential(2) : value
}

const progressWidth = computed(() => {
  return `left: ${(minValue.value / totalValue.value) * 100}%; right: ${100 - (maxValue.value / totalValue.value) * 100
    }%;`
})

const greatestValue = computed(() => {
  minValue.value = 0
  if (Math.max(...props.valueList) < 7) {
    totalValue.value = Math.ceil(Math.max(...props.valueList) * 100) / 100
    valueGap.value = Math.round(totalValue.value * 10) / 100
    maxValue.value = totalValue.value
    return
  } else if (Math.max(...props.valueList) <= 10) {
    totalValue.value = Math.ceil(Math.max(...props.valueList) / 10) * 10
  } else if (Math.max(...props.valueList) < 800) {
    totalValue.value = Math.ceil(Math.max(...props.valueList) / 100) * 100
  } else {
    totalValue.value = Math.ceil(Math.max(...props.valueList) / 1000) * 1000
  }
  if (totalValue.value === 1000000000000000) {
    greatestValue.value
  }
  valueGap.value = Math.round(totalValue.value / 10)
  maxValue.value = totalValue.value
})

watch(() => props.valueList, (newVal, oldVal) => {
  greatestValue.value
}, { deep: true })

watch(minValue, (newVal, oldVal) => {
  if (newVal < 0) minValue.value = 0
  if (newVal > maxValue.value - valueGap.value) minValue.value = maxValue.value - valueGap.value
  emit('change', { max: parseFloat(maxValue.value), min: parseFloat(minValue.value) })
}, { deep: true })

watch(maxValue, (newVal, oldVal) => {
  if (maxValue.value < parseFloat(minValue.value) + valueGap.value)
    maxValue.value = parseFloat(minValue.value) + valueGap.value
  if (newVal > totalValue.value) maxValue.value = totalValue.value
  emit('change', { max: parseFloat(maxValue.value), min: parseFloat(minValue.value) })
}, { deep: true })

</script>
<style scoped>
.wrapper {
  width: 200px;
}

.slider {
  height: 5px;
  position: relative;
  background: #ddd;
  border-radius: 5px;
}

.slider .progress {
  height: 100%;
  left: 25%;
  right: 25%;
  position: absolute;
  border-radius: 5px;
  background: #17a2b8;
}

.range-input {
  position: relative;
}

.range-input input {
  position: absolute;
  width: 100%;
  height: 5px;
  top: -5px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type='range']::-webkit-slider-thumb {
  height: 17px;
  width: 17px;
  border-radius: 50%;
  background: #17a2b8;
  pointer-events: auto;
  -webkit-appearance: none;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}

input[type='range']::-moz-range-thumb {
  height: 17px;
  width: 17px;
  border: none;
  border-radius: 50%;
  background: #17a2b8;
  pointer-events: auto;
  -moz-appearance: none;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}

p {
  display: inline-block;
  font-size: 12px;
}

.nums {
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>

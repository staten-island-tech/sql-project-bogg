<template>
  <h1>Price</h1>
  <NumberSlide :valueList="props.list.price" symbol="$"
    @change="(event) => emit('valueChange', { key: 'price', values: event })" />

  <div class="checkbox-list" v-for="[key, value] in Object.entries(props.list).filter(([key, value]) => key !== 'price')"
    :key="key">
    <h1>
      {{
        key
          .split('_')
          .map((string) =>
            string.match(/rpm|pwm|psu|tdp|gb|cas|ram|dpi|dvd|cd|snr|va/i)
              ? string.toUpperCase()
              : string[0].toUpperCase() + string.substring(1)
          )
          .join(' ')
      }}
    </h1>

    <label v-if="typeof value === 'object' && !Array.isArray(value)">
      <ThreeSwitch @select="
        (event) => {
          active[key] = event
          emit('valueChange', { key: key, current: active[key] })
        }
      " />
      <NumberSlide :valueList="[...value.min, ...value.max, ...value.default]" symbol=""
        @change="(event) => emit('valueChange', { key: key, values: event })" />
    </label>

    <NumberSlide v-else-if="typeof value[0] === 'number'"
      :valueList="value.map((value) => parseFloat(value)).filter((value) => value !== null)"
      @change="(event) => emit('valueChange', { key: key, values: event })" />

    <label v-else-if="value.length <= 5" v-for="item in value.sort()" :key="item">
      <input type="checkbox" name="option3" :value="item" @change="(event) => selectedFilter(event, key, item)" />
      <p>{{ item }}</p>
    </label>

    <div v-else>
      <label v-for="item in active[key] ? value.sort().slice(0, 5) : value.sort()" :key="item">
        <input v-if="item !== null" type="checkbox" name="option3" :value="item"
          @change="(event) => selectedFilter(event, key, item)" />
        <p v-if="item !== null">{{ item }}</p>
      </label>
      <button @click="active[key] = !active[key]" class="show">
        {{ active[key] ? 'Show more' : 'Show less' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import ThreeSwitch from './ThreeSwitch.vue'
import NumberSlide from './NumberSlide.vue'
import { ref, reactive, defineProps, computed, defineEmits, watch, onMounted, inject } from 'vue'

const props = defineProps({
  list: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['filterControl', 'valueChange'])

const active = ref({})
const price = ref(props.list.price)

function selectedFilter(event, key, filter) {
  if (event.target.checked) {
    emit('filterControl', [key, filter, true])
  } else {
    emit('filterControl', [key, filter, false])
  }
}

const activeList = computed(() => {
  return Object.keys(props.list).reduce((acc, key) => {
    if (!Array.isArray(props.list[key])) acc[key] = 'all'
    else acc[key] = true
    return acc
  }, {})
})

watch(
  () => props.list,
  (newVal, oldVal) => {
    active.value = activeList.value
  },
  { deep: true }
)

onMounted(() => {
  active.value = activeList.value
})
</script>
<style scoped>
.checkbox-list label {
  display: block;
  margin-bottom: 10px;
  line-height: 1.5;
  align-items: center;
}

h1 {
  font-size: 25px;
  margin: 0;
}

p {
  display: inline-block;
  font-size: 12px;
}

.checkbox-list input[type='checkbox'] {
  display: inline-block;
  margin-right: 10px;
  top: 1px;
}

.show {
  font-size: 12px;
  border: none;
  background: none;
  color: rgb(113, 113, 230);
  text-decoration: underline;
  cursor: pointer;
}

.small {
  font-size: 15px;
}

.center {
  font-size: 15px;

  text-align: center;
}
</style>

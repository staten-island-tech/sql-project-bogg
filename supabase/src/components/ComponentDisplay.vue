<template>
  <div class="parts-container">
    <h1 class="filterHead">Filters</h1>
    <div class="head">
      <div class="key keym">Add</div>
      <div class="head-container">
        <div v-for="(key, index) in keys" :key="key" class="key" :style="'width: ' + 100 / keys.length + '%;'">
          <p class="key-text">
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
          </p>
        </div>
      </div>
    </div>
    <div class="filters">
      <FilterComponent :list="filtersList" @filterControl="manageFilters" @valueChange="filterValue" />
    </div>
    <ul class="main">
      <li v-for="component in filteredData.slice(0, currentCount)" :key="component">
        <button @click="(event) => emit('addBuild', { item: component, part: props.part })">
          Add to Build
        </button>
        <div class="parent">
          <div class="child-subkey">
            <p v-for="value in keys" class="subkey" :style="'width: ' + 100 / keys.length + '%;'">
              {{ value === 'price' ? '$' : ''
              }}{{ component[value]["0"] === "GB" ? `${component[value]["0"]}:
              ${component[value]["1"]}` : component[value] }}
            </p>
          </div>
        </div>
      </li>
      <div class="showMore">
        <button v-if="currentCount <= filteredData.length" @click="increaseCount">Show More</button>
      </div>
    </ul>
  </div>
</template>

<script setup>
import FilterComponent from './FilterComponent.vue'
import { ref, defineProps, defineEmits, computed, watch, onMounted } from 'vue'

const importedData = ref({ data: [] })
const props = defineProps({
  part: {
    type: String,
    required: true
  },
  filters: {
    type: Array,
    required: false
  }
})

const emit = defineEmits(['addBuild', 'keys'])

const currentCount = ref(200)
const data = ref([])
const filtersList = ref({})
const selectedFilters = ref({})
const keys = ref([])

function manageFilters(filter) {
  if (filter[2]) {
    if (selectedFilters.value[filter[0]] === undefined) {
      selectedFilters.value[filter[0]] = [filter[1]]
    } else selectedFilters.value[filter[0]].push(filter[1])
  } else {
    selectedFilters.value[filter[0]] = selectedFilters.value[filter[0]].filter(
      (existingFilter) => existingFilter !== filter[1]
    )
  }
  if (selectedFilters.value[filter[0]].length === 0) delete selectedFilters.value[filter[0]]
}

const getLength = computed(() => {
  return currentCount.value < filteredData.value.length
})

function filterValue(data) {
  if (selectedFilters.value[data.key] === undefined) {
    if (data.subKey !== undefined) {
      selectedFilters.value[data.key] = { width: {}, height: {} }
    } else if (data.prefix === undefined) {
      selectedFilters.value[data.key] = { values: {} }
    } else {
      selectedFilters.value[data.key] = { values: {}, prefix: data.prefix }
    }
  }
  if (data.values === undefined) {
    selectedFilters.value[data.key].current = data.current
  } else if (data.subKey !== undefined) {
    selectedFilters.value[data.key][data.subKey] = data.values
  } else {
    selectedFilters.value[data.key].values = data.values
  }
}

function increaseCount() {
  if (currentCount.value < data.value.length) currentCount.value += 200
  else currentCount.value = data.value.length
  createData.value
}

const createData = computed(() => {
  let excluded = []
  data.value = importedData.value.data.map((data) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          value[0] === 'USD' ? (value = parseFloat(value[1])) : (value = parseFloat(value[0]))
        } else {
          let find = false;
          if (!excluded.includes(key) && value === null) {
            value = importedData.value.data.find(obj => obj[key] !== null)
            if (value !== undefined) value = value[key]
            find = true
          }
          if (value !== undefined && value !== null && typeof value === 'object') {
            if (find) {
              if (Object.keys(value).length === 1) {
                value = { key: 0 }
              } else if (Object.keys(value).length === 2) {
                value = { width: 0, height: 0 }
              } else {
                value = { default: 0, min: null, max: null }
              }
            }
            if (value.width !== undefined) {
              value = value
            } else if (value.default === null) {
              value = { min: value.min, max: value.max }
            } else if (value.min === null && value.max === null) {
              value = { default: value.default }
            } else {
              value = Object.values(value)[0]
              if (typeof value === 'number' && value > 999999999) {
                value = ['GB', Math.round(value / 10000000) / 100]
              } else {
                value = ['GB', 0]
              }
            }
          } else {
            excluded.push(key)
            value = "None"
          }
        }
      }
      acc[key] = value
      return acc
    }, {})
  })
})

const filteredData = computed(() => {
  return data.value.filter((data) => {
    for (const [key, value] of Object.entries(selectedFilters.value)) {
      let dataValue = data[key]

      if (typeof value === 'object' && value.current !== undefined) {
        if (value.current === 'minMax') {
          if (
            dataValue.min === undefined ||
            dataValue.min < value.values.min ||
            dataValue.max > value.values.max
          )
            return false
        } else if (value.current === 'default') {
          if (
            dataValue.default === undefined ||
            dataValue.default < value.values.min ||
            dataValue.default > value.values.max
          )
            return false
        } else {
          if (dataValue.default === undefined) {
            if (dataValue.min < value.values.min || dataValue.max > value.values.max) return false
          } else {
            if (dataValue.default < value.values.min || dataValue.default > value.values.max) return false
          }
        }
      } else if (value.width !== undefined) {
        if (dataValue.width < value.width.min || dataValue.width > value.width.max || dataValue.height < value.height.min || dataValue.height > value.height.max) return false
      } else if (typeof value === 'object' && value.prefix === undefined && !Array.isArray(value)) {
        if (dataValue === 'None') dataValue = 0
        if (dataValue < value.values.min || dataValue > value.values.max) return false
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        if (dataValue["1"] < value.values.min || dataValue["1"] > value.values.max) return false
      } else {
        if (!value.includes(dataValue)) return false
      }
    }
    return true
  }).slice(0, currentCount.value)
})

const convertList = computed(() => {
  filtersList.value = Object.entries(data.value[0]).reduce((acc, [key, value]) => {
    let set = []
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (value.width !== undefined) {
        value = {
          width: Array.from(new Set(data.value.map(obj => obj[key].width))),
          height: Array.from(new Set(data.value.map(obj => obj[key].height)))
        }
        acc[key] = value
      } else {
        set = data.value.reduce(
          (acc, obj) => {
            if (obj[key].min !== undefined && obj[key].max !== undefined) {
              acc.min.add(obj[key].min)
              acc.max.add(obj[key].max)
            } else if (obj[key].default !== undefined) {
              acc.default.add(obj[key].default)
            }
            return acc
          },
          { default: new Set(), min: new Set(), max: new Set() }
        )
        if (set.min.size + set.max.size + set.default.size === 0) return acc
        acc[key] = {
          default: Array.from(set.default),
          min: Array.from(set.min),
          max: Array.from(set.max)
        }
      }
    } else if (Array.isArray(value)) {
      acc[key] = ['GB', Array.from(new Set(data.value.map(array => array[key][1]))).filter(value => value !== undefined && value !== null)]
    } else {
      set = new Set(data.value.map((obj) => (typeof obj[key] === 'object' ? undefined : obj[key])))
      set.delete(undefined)
      set = Array.from(set)
      if (set.find(item => typeof item === 'number')) set = set.filter(value => value !== 'None')
      if (set.length !== 1 && set[0] !== null) {
        acc[key] = set
      }
    }
    return acc
  }, {})

  keys.value = Object.keys(filtersList.value).filter(
    (data) => Array.isArray(filtersList.value[data]) && data.length < 17
  )
})

watch(
  () => props.part,
  async (newVal, oldValue) => {
    importedData.value = {}
    importedData.value = await fetch(`https://gnxlyuryauoscxoqyjcz.supabase.co/storage/v1/object/public/componentData/data/${props.part}.json`).then(data => data.json())
    createData.value
    selectedFilters.value = {}
    keys.value = []
    convertList.value
    currentCount.value = 200
  },
  { deep: true }
)

onMounted(async () => {
  if (props.part !== undefined) {
    importedData.value = await fetch(`https://gnxlyuryauoscxoqyjcz.supabase.co/storage/v1/object/public/componentData/data/${props.part}.json`)
      .then(data => data.json())
  } else {
    importedData.value = await fetch(`https://gnxlyuryauoscxoqyjcz.supabase.co/storage/v1/object/public/componentData/data/caseFan.json`).then(data => data.json())

  }
  createData.value
  convertList.value

})
</script>
<style scoped>
@import '../assets/base.css';

.parts-container {
  left: 20rem;
  top: 0rem;
  width: calc(100vw - 40rem);
  overflow-y: auto;
  padding: 1rem;
  border: 0.75rem solid var(--color-display);
  border-radius: 5rem;
  width: 130rem;
  height: 85rem;
  overflow-y: auto;
  display: grid;
  grid-template:
    'build head'
    'filter list';
  grid-template-rows: 8rem 1fr;
  grid-template-columns: 20rem 1fr;
  padding-top: 0;
}

.filterHead {
  position: absolute;
  grid-area: build;
  padding: 3rem;
  font-size: 2.5rem;
  width: 20rem;
  padding-top: 0;
  display: flex;
  justify-content: space-around;
  background-color: var(--color-background);
  z-index: 1;
  height: 8rem;
  border-top-left-radius: 23px;
  border-bottom: solid 1px var(--color-display);
}

.head {
  width: 106.8rem;
  position: absolute;
  grid-area: head;
  padding-top: 0;
  padding-left: 6.5rem;
  left: 20rem;
  display: flex;
  justify-content: space-around;
  background-color: var(--color-background);
  z-index: 1;
  height: 8rem;
  border-top-right-radius: 20px;
  border-bottom: solid 1px var(--color-display);
}

.parent {
  width: 90%;
  height: 6rem;
  display: inline-block;
}

.child-subkey {
  display: flex;
}

.subkey {
  top: 0;
  vertical-align: center;
  align-items: center;
  font-size: 1.5rem;
  text-align: center;
  height: 7rem;
  overflow: hidden;
  white-space: wrap;
}

.head-container {
  width: 90%;
  display: flex;
}

.key {
  height: 8rem;
  align-items: center;
}

.keym {
  width: 10%;
  font-size: 2rem;
  text-align: center;
}

.key-text {
  margin: auto;
  font-size: 2rem;
  text-align: center;
  vertical-align: middle;
}

.filters {
  grid-area: filter;
  height: 100%;
  width: 20rem;
}

.main {
  width: 100%;
  grid-area: list;
  list-style-type: decimal;
  padding: 0.75rem 0 3rem 4.5rem;
}

.parts-container::-webkit-scrollbar {
  background-color: rgba(0, 0, 0, 0);
  width: 1.2rem;
}

.parts-container::-webkit-scrollbar-track {
  margin: 35px;
}

.parts-container::-webkit-scrollbar-thumb {
  background-color: rgb(70, 70, 70);
  border-radius: 20px;
}

li {
  margin-bottom: 0.5rem;
  font-size: 2rem;
  color: var(--color-text);
}

button {
  width: 10%;
  background-color: rgba(0, 0, 0, 0);
  font-size: 1.5rem;
  color: var(--color-text);
  border: 0.25rem solid var(--color-text);
  border-radius: 1rem;
}

button:hover {
  background-color: var(--color-hover-1);
}

.showMore {
  text-align: center;
}
</style>

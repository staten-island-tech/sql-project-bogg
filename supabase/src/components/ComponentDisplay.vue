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
        <button @click="(event) => $emit('addBuild', { item: component, part: part })">
          Add to Build
        </button>
        <div class="parent">
          <div class="child-subkey">
            <p v-for="(value, index) in keys" class="subkey" :style="'width: ' + 100 / keys.length + '%;'">
              {{ JSON.stringify(component[value]) !== "{}" ? component[value] : "None" }}
            </p>
          </div>
        </div>
      </li>
      <div class="showMore">
        <button v-if="currentCount < filteredData.length" @click="increaseCount">Show More</button>
      </div>
    </ul>
  </div>
</template>

<script>
import FilterComponent from './FilterComponent.vue'
import * as data from '../data/index.js'

export default {
  name: 'about',
  emits: ['addBuild', 'keys'],
  components: {
    FilterComponent
  },
  props: {
    part: {
      type: String,
      required: true
    },
    filters: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      currentCount: 200,
      data: [],
      filtersList: {},
      selectedFilters: {},
      keys: []
    }
  },
  methods: {
    addToBuild(part) {
      this.$emit('addBuild', part)
    },
    manageFilters(filter) {
      if (filter[2]) {
        if (this.selectedFilters[filter[0]] === undefined) {
          this.selectedFilters[filter[0]] = [filter[1]]
        } else this.selectedFilters[filter[0]].push(filter[1])
      } else {
        this.selectedFilters[filter[0]] = this.selectedFilters[filter[0]].filter(
          (existingFilter) => existingFilter !== filter[1]
        )
      }
      if (this.selectedFilters[filter[0]].length === 0) delete this.selectedFilters[filter[0]]
    },
    filterValue(data) {
      let newObj = this.selectedFilters
      if (data.objKey !== undefined) {
        if (newObj[data.key] === undefined) {
          newObj[data.key] = { all: {}, min: {}, max: {}, default: {}, current: '' }
        }
        newObj[data.key][data.objKey] = data.values
        newObj[data.key].current = data.objKey
      } else {
        newObj[data.key] = data.values
      }
      this.selectedFilters = newObj
    },
    increaseCount() {
      if (this.currentCount < this.data.length) this.currentCount += 200
      else this.currentCount = this.data.length
    }
  },
  computed: {
    showLoadMoreButton() {
      return this.currentPage * this.itemsPerPage < this.filteredData.length
    },
    createData() {
      this.data = data[this.part].data.map((data) => {
        return Object.entries(data).reduce((acc, [key, value]) => {
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              value[0] === 'USD' ? (value = parseFloat(value[1])) : (value = parseFloat(value[0]))
            } else {
              if (value === null) {
                value = {}
              } else if (value.default === null) {
                value = { min: value.min, max: value.max }
              } else if (value.min === null && value.max === null) {
                value = { default: value.default }
              } else {
                value = Object.values(value)[0]
              }
            }
          }
          acc[key] = value
          return acc
        }, {})
      })
    },
    filteredData() {
      return this.data.filter((data) => {
        for (const [key, value] of Object.entries(this.selectedFilters)) {
          const dataValue = data[key]

          if (typeof value === 'object' && value.all !== undefined) {
            if (value.current === 'min' || value.current === 'max') {
              if (
                dataValue.min === undefined ||
                dataValue.min < value.min.min ||
                dataValue.min > value.min.max ||
                dataValue.max < value.max.min ||
                dataValue.max > value.max.max
              )
                return false
            } else if (value.current === 'default') {
              if (
                dataValue.default === undefined ||
                dataValue.default < value.default.min ||
                dataValue.default > value.default.max
              )
                return false
            } else {
              if (dataValue.default === undefined) {
                if (dataValue.min < value.all.min || dataValue.max > value.all.max) return false
              } else {
                if (dataValue.default < value.all.min || dataValue.default > value.all.max)
                  return false
              }
            }
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            if (dataValue < value.min || dataValue > value.max) return false
          } else {
            if (!value.includes(dataValue)) return false
          }
        }
        return true
      })
    },
    convertList() {
      this.filtersList = Object.entries(this.data[0]).reduce((acc, [key, value]) => {
        let set = []
        if (typeof value === 'object') {
          set = this.data.reduce(
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
        } else {
          set = new Set(
            this.data.map((obj) => (typeof obj[key] === 'object' ? undefined : obj[key]))
          )
          set.delete(undefined)
          set = Array.from(set)
          if (set.length !== 1 && set[0] !== null) {
            acc[key] = set
          }
        }
        return acc
      }, {})

      this.keys = Object.keys(this.filtersList).filter(
        (data) => Array.isArray(this.filtersList[data]) && data.length < 17
      )
    }
  },
  watch: {
    part(newValue, oldValue) {
      this.createData
      this.convertList
      this.selectedFilters = {}
      this.currentCount = 200
    },
    filtersList(newValue, oldValue) {
      this.filteredData
    }
  },
  mounted() {
    this.createData
    this.convertList
  }
}
</script>
<style scoped>
@import "../assets/base.css";

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

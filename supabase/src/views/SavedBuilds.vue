<template>
  <div class="new">
    <RouterLink :to="userSession.session ? '/account/' + userSession.session.user.id : '/account/123'" class="home">Home
    </RouterLink>
    <div class="header">
      <button class="arrow" id="left" @click="changeValue(-1)"></button>
      <h2>
        {{
          dataList[selectedValue]
            .split(/(?=[A-Z])/)
            .map((string) =>
              string.match(/cpu|ups/i)
                ? string.toUpperCase()
                : string[0].toUpperCase() + string.substring(1)
            )
            .join(' ')
        }}

        Selection
      </h2>
      <button class="arrow" id="right" @click="changeValue(1)"></button>
    </div>
    <div class="display">
      <ComponentDisplay @addBuild="updateBuild" class="display" :part="dataList[selectedValue]"
        :filters="activeFilters" />
    </div>
    <div class="build-display">
      <BuildComp :buildList="computerBuild" :current="selectedValue" :name="name"
        @changeDisplay="(event) => (selectedValue = event)" />
    </div>
  </div>
</template>

<script setup>
import BuildComp from '../components/BuildComponent.vue'
import ComponentDisplay from '../components/ComponentDisplay.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { userSessionStore } from '../stores/userSession'
import { supabase } from '../lib/supabaseClient'

const dataList = ref([
  'caseFan',
  'case',
  'cpu',
  'cpuCooler',
  'externalHardDrive',
  'fanController',
  'headphones',
  'internalHardDrive',
  'keyboard',
  'memory',
  'monitor',
  'motherboard',
  'mouse',
  'opticalDrive',
  'powerSupply',
  'soundCard',
  'speakers',
  'thermalPaste',
  'ups',
  'videoCard',
  'wiredNetworkCard',
  'wirelessNetworkCard'
])
const userSession = userSessionStore()
const route = useRoute()
const activeFilters = ref([])
const computerBuild = reactive(
  dataList.value.reduce((acc, item) => {
    acc[item] = ''
    return acc
  }, {})
)
const selectedValue = ref(0)
const name = ref('')

function changeValue(num) {
  selectedValue.value += num
  if (selectedValue.value === -1) selectedValue.value = dataList.value.length - 1
  else if (selectedValue.value === dataList.value.length) selectedValue.value = 0
  activeFilters.value = []
}

function updateBuild(part) {
  changeValue(1)

  computerBuild[part.part] = part.item
}

onMounted(async () => {
  if (route.name !== 'new') {
    let { data: info, error } = await supabase
      .from('builds')
      .select('name, info')
      .eq('id', route.params.build)
    Object.assign(computerBuild, info[0].info)
    name.value = info[0].name
  }
})
</script>

<style scoped>
@import '../assets/base.css';

* {
  font-size: 16px;
}

.new {
  display: grid;
  grid-template:
    'home home'
    'header build'
    'display build';
  margin: 10px;
}

.home {
  grid-area: home;
  font-size: 20px;
  display: block;
  width: 5.5rem;
}

.header {
  grid-area: header;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
  width: 130rem;
  height: 2rem;
}

.header h2 {
  font-size: 25px;
  margin: 0;
  width: 50rem;
  text-align: center;
}

.arrow {
  background-color: rgba(0, 0, 0, 0);
  border: solid var(--color-arrow);
  border-width: 0 10px 10px 0;
  display: inline-block;
  padding: 3px;
}

#right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

#left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.display {
  grid-area: display;
  position: static;
}

.build-display {
  grid-area: build;
}
</style>

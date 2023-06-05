<template>
  <div class="new">
    <div class="header">
      <button class="arrow" id="left" @click="changeValue(-1)"></button>
      <h2>
        {{
          this.dataList[this.selectedValue]
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
      <ComponentDisplay @addBuild="updateBuild" class="display" :part="this.dataList[this.selectedValue]"
        :filters="this.activeFilters" />
    </div>
    <div class="build-display">
      <BuildComp :buildList="computerBuild" :current="selectedValue"
        @changeDisplay="(event) => (selectedValue = event)" />
    </div>
  </div>
</template>

<script>
import BuildComp from '../components/BuildComponent.vue'
import ComponentDisplay from '../components/ComponentDisplay.vue'

export default {
  name: 'Build',
  data() {
    return {
      activeFilters: [],
      build_name: '',
      computerBuild: [],
      selectedValue: 0,
      dataList: [
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
      ]
    }
  },
  components: {
    ComponentDisplay,
    BuildComp
  },
  methods: {
    changeValue(num) {
      this.selectedValue += num
      if (this.selectedValue === -1) this.selectedValue = this.dataList.length - 1
      else if (this.selectedValue === this.dataList.length) this.selectedValue = 0
      this.activeFilters = []
    },
    updateBuild(part) {
      this.changeValue(1)

      this.computerBuild[part.part] = part.item
    }
  },
  mounted() {
    this.computerBuild = this.dataList.reduce((acc, item) => {
      acc[item] = ''
      return acc
    }, {})
    if (this.$route.name !== 'new') {
      this.computerBuild = JSON.parse(localStorage.getItem('builds')).filter(
        (obj) => obj.name === this.$route.params.build
      )[0].build
    }
  }
}
</script>

<style scoped>
@import "../assets/base.css";

* {
  font-size: 16px;
}

.new {
  display: grid;
  grid-template:
    'header build'
    'display build';
  margin: 10px;
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

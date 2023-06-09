<template>
  <div class="build-container">
    <h2 v-if="route.name === 'new'">
      New Build
    </h2>


    <h2 v-else>Build:
      <input :placeholder="currentName" v-model="buildName" class="name-top" />
    </h2>
    <div class="save-div" v-if="route.name !== 'new'" v-show="buildName !== currentName && buildName.length > 0">
      <button class="saveName" @click="editName">{{ loadingName }}</button>
    </div>
    <h2>Total Price: ${{ props.buildList === undefined ? 0 : totalPrice.toFixed(2) }}</h2>

    <ul>
      <li v-for="([component, item], index) in Object.entries(buildList)" :key="component">
        <button @click="$emit('changeDisplay', index)" :class="current === index ? 'selected' : 'none'">
          <p class="component">
            {{
              component
                .split(/(?=[A-Z])/)
                .map((string) =>
                  string.match(/cpu|ups/i)
                    ? string.toUpperCase()
                    : string[0].toUpperCase() + string.substring(1)
                )
                .join(' ')
            }}
          </p>
          :
          <p v-if="item !== ''">{{ item.brand }} {{ item.model }} - ${{ item.price }}</p>
        </button>
      </li>
    </ul>
    <div class="name extra" v-if="route.name === 'new'">
      <p class="save-text">Save As:</p>
      <input placeholder="Name of Build" v-model="buildName" />
    </div>
    <button class="commit extra" @click="commit">{{ save }}</button>
    <button v-if="route.name !== 'new'" class="remove extra" @click="remove">Remove</button>
  </div>
</template>
<script setup>
import { ref, reactive, defineProps, defineEmits, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { userSessionStore } from '../stores/userSession'

const props = defineProps({
  buildList: {
    type: Object,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['changeDisplay'])

const route = useRoute()
const save = ref('Save Build')
const buildName = ref('')
const userSession = userSessionStore()
const loadingName = ref('Save')
const currentName = ref('')

const totalPrice = computed(() => {
  return Object.values(props.buildList).reduce(
    (sum, component) => (component === '' ? sum : sum + component.price),
    0
  )
})

async function commit() {
  save.value = 'Saving'
  if (route.name === 'new') {
    let { data: createdBuilds, pullError } = await supabase
      .from('builds')
      .select('name')
      .eq('user_id', userSession.session.user.id)
    createdBuilds = createdBuilds.map((build) => build.name)
    if (createdBuilds.includes(buildName.value)) {
      alert('One of your builds already has this name. Please pick another one.')
    } else if (buildName.value === '') {
      alert('Please input a name for your build.')
    } else {
      const { data, error } = await supabase.from('builds').insert({
        user_id: userSession.session.user.id,
        name: buildName.value,
        info: props.buildList
      })
      if (error) {
        console.log(error)
      }
    }
  } else {
    const { data, error } = await supabase
      .from('builds')
      .update({ info: props.computerBuild })
      .eq('id', route.params.build)
  }
  save.value = 'Saved'
}

async function editName() {
  loadingName.value = "Saving"
  const { data, error } = await supabase
    .from('builds')
    .update({ name: buildName.value })
    .eq('id', route.params.build)
  if (error) {
    console.log(error)
  }
  loadingName.value = "Save"
  currentName.value = buildName.value
}
async function remove() {
  if (window.confirm('Are you sure you want to delete this build?')) {
    const { data: data, error } = await supabase
      .from('builds')
      .delete()
      .eq('id', route.params.build)

    if (error) {
      console.log(error)
    } else {
      window.location.href = window.location.href.split(/\/build|\/new/)[0]
    }
  }
}

watch(
  props.buildList,
  (newVal, oldVal) => {
    save.value = 'Save Build'
  },
  { deep: true }
)

watch(() => props.name, (newval, oldVal) => {
  buildName.value = props.name
  currentName.value = props.name
})
onMounted(async () => {
  if (route.name !== 'new') {
    buildName.value = props.name
    currentName.value = props.name
  }
})
</script>

<style scoped>
@import '../assets/base.css';

p {
  display: inline-block;
}

h2 {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-left: 1rem;
}

ul {
  list-style-type: none;
}

button {
  background-color: rgba(0, 0, 0, 0);
  color: var(--color-text);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  width: 50rem;
  text-align: left;
}

.selected {
  background-color: var(--color-button-background);
  color: rgb(255, 255, 255);
}

button:hover {
  background-color: var(--color-button-background);
  color: rgb(255, 255, 255);
}

p {
  font-size: 1.5rem;
}

.component {
  width: 16.5rem;
}

.commit {
  font-size: 2.5rem;
  background-color: var(--color-button-background);
  color: rgb(255, 255, 255);
}

.commit:hover,
.remove:hover {
  background-color: var(--color-button-hover);
}

.extra {
  margin-left: 4rem;
  text-align: center;
}

.name {
  padding: 0;
  font-size: 0;
  width: 50rem;
  text-align: center;
  text-align: center;
  border: solid 2px rgb(0, 0, 0);
  margin-bottom: 0.5rem;
  padding-bottom: 4px;
}

.remove {
  font-size: 2rem;
  background-color: var(--color-button-background);
  color: rgb(255, 255, 255);
}

.save-text {
  margin: 0;
  margin-right: 0.5rem;
}

input {
  font-size: 13px;
  border-radius: 4px;
  line-height: 1.5;
  padding: 5px 10px;
  transition: box-shadow 100ms ease-in, border 100ms ease-in, background-color 100ms ease-in;
  border: 2px solid #dee1e2;
  color: rgb(14, 14, 16);
  background: #dee1e2;
  height: 25px;
}

input:hover {
  border-color: #ccc;
}

input:focus {
  border-color: #9147ff;
  background: #fff;
}

.name-top {
  top: -0rem;
  width: 20rem;
  font-size: 30px;
  border-radius: 4px;
  line-height: 1.5;
  padding: 5px 10px;
  transition: box-shadow 100ms ease-in, border 100ms ease-in, background-color 100ms ease-in;
  border: 2px solid #dee1e2;
  color: rgb(14, 14, 16);
  background: #dee1e2;
  height: 35px;

}

.saveName {
  appearance: none;
  background-color: #2ea44f;
  border: 1px solid rgba(27, 31, 35, .15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 6px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  width: 10rem;
  margin: auto;
}

.saveName:focus:not(:focus-visible):not(.focus-visible) {
  box-shadow: none;
  outline: none;
}

.saveName:hover {
  background-color: #2c974b;
}

.saveName:focus {
  box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
  outline: none;
}

.saveName:disabled {
  background-color: #94d3a2;
  border-color: rgba(27, 31, 35, .1);
  color: rgba(255, 255, 255, .8);
  cursor: default;
}

.saveName:active {
  background-color: #298e46;
  box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
}

.save-div {
  text-align: center;
}
</style>

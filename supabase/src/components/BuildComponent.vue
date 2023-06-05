<template>
  <div class="build-container">
    <h2 v-if="$route.name === 'new'">New Build</h2>
    <h2 v-else>Build: {{ $route.params.name }}</h2>
    <h2>Total Price: ${{ totalPrice.toFixed(2) }}</h2>

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
    <div class="name extra" v-if="$route.name === 'new'">
      <p class="save-text">Save As:</p>
      <input placeholder="Name of Build" v-model="input" />
    </div>
    <button class="commit extra" @click="commit">{{ save }}</button>
    <button v-if="$route.name !== 'new'" class="remove extra" @click="remove">Remove</button>
  </div>
</template>
<script>
export default {
  name: 'Build',
  emits: ['changeDisplay'],
  data() {
    return {
      save: 'Save Build',
      input: '',
    }
  },
  props: {
    buildList: {
      type: Object,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  },
  computed: {
    totalPrice() {
      return Object.values(this.buildList).reduce(
        (sum, component) => (component === '' ? sum : sum + component.price),
        0
      )
    },
    fullList() {
      return this.components
    },
    commit() {
      this.save = "Saved"
      let current = JSON.parse(localStorage.getItem('builds'))
      localStorage.removeItem('builds')
      if (current === undefined || current === null) {
        current = []
      }
      if (this.$route.name === 'new') {
        if (this.input === '') {
          this.input = Math.round(Math.random() * 999999).toString()
        }
        this.input = this.input.replaceAll(' ', '')
        current.push({ name: this.input, build: this.buildList })
      } else {
        current = current.filter((obj) => obj.name !== this.$route.params.name)
        current.push({ name: this.$route.params.name, build: this.buildList })
      }
      localStorage.setItem('builds', JSON.stringify(current))
    },
    remove() {
      let current = JSON.parse(localStorage.getItem('builds'))
      localStorage.removeItem('builds')
      if (window.confirm('Are you sure you want to delete this build?')) {
        current = current.filter((value) => value.name !== this.$route.params.name)
        localStorage.setItem('builds', JSON.stringify(current))
        window.location.href = window.location.href.split(/\/build|\/new/)[0]
      } else {
        localStorage.setItem('builds', JSON.stringify(current))
      }
    }
  },
  watch: {
    buildList: {
      handler(newVal, oldVal) {
        this.save = "Save Build"
      },
      deep: true
    }
  }
}
</script>

<style scoped>
@import "../assets/base.css";

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
</style>

<template>
  <div class="toggle-switch">
    <button :class="{ active: state === 'left' }" @click="toggleLeft">All</button>
    <button :class="{ active: state === 'middle' }" @click="toggleMiddle">Min/Max</button>
    <button :class="{ active: state === 'right' }" @click="toggleRight">Default</button>
  </div>
</template>

<script>
export default {
  emits: ['select'],
  data() {
    return {
      state: 'left'
    }
  },
  methods: {
    toggleLeft() {
      this.state = 'left'
      this.$emit('select', 'all')
    },
    toggleMiddle() {
      this.state = 'middle'
      this.$emit('select', 'minMax')
    },
    toggleRight() {
      this.state = 'right'
      this.$emit('select', 'default')
    }
  },
  mounted() {
    this.$emit('select', 'all')
  }
}
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

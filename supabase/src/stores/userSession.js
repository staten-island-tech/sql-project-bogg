import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userSessionStore = defineStore({
  id: 'userSession',
  state: () => ({
    session: null
  })
})

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })

// export const useStore = defineStore('store', {
//   state: () => {
//     return {
//       name: 'Eduardo',
//       isAdmin: true,
//       items: [],
//       hasChanged: true,
//       signedIn: false
//     }
//   }
// })

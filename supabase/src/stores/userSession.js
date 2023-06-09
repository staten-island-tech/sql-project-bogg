import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userSessionStore = defineStore({
  id: 'userSession',
  state: () => ({
    session: null
  })
})

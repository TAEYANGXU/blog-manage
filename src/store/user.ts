// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const token = ref('')
  const userInfo = ref<any>(null)

  const setUser = (user: any) => {
    // const { username, avatar ,role,id} = user;
    name.value = user.username
    // token.value = token
    userInfo.value = user
  }
  const clearUser = () => {
    name.value = ''
    token.value = ''
    userInfo.value = null
  }

  return {
    name,
    token,
    userInfo,
    setUser,
    clearUser
  }
}, {
  persist: true // 开启持久化
})
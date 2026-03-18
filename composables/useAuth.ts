export const useAuth = () => {
  const user = useState<any | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'staff') // schema uses 'staff' for non-admin

  const fetchUser = async () => {
    try {
      const headers = useRequestHeaders(['cookie']) as HeadersInit
      const data = await $fetch('/api/auth/me', { headers })
      if (data && data.user) {
        user.value = data.user
      }
    } catch (e) {
      user.value = null
    }
  }

  const login = async (credentials: any) => {
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      if (data && data.user) {
        user.value = data.user
        return true
      }
      return false
    } catch (e: any) {
      throw new Error(e.data?.statusMessage || 'Login failed')
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      navigateTo('/login')
    } catch (e) {
      console.error(e)
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isTeacher,
    fetchUser,
    login,
    logout
  }
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser, isAdmin, isTeacher } = useAuth()
  
  // Try fetching user if no user is set (e.g., initial page load)
  if (!user.value) {
    await fetchUser()
  }

  // If still no user, redirect to login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If user exists and tries to access login, redirect to dashboard
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }

  // Role-based access control
  if (user.value) {
    const teacherAllowed = ['/assessments', '/reports']
    const isTeacherAllowed = teacherAllowed.some(prefix => to.path === prefix || to.path.startsWith(prefix + '/'))

    if (isTeacher.value && !isTeacherAllowed) {
      return navigateTo('/assessments')
    }
  }
})

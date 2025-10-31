export default defineNuxtRouteMiddleware((to) => {
  // This middleware runs only on the client since auth relies on localStorage
  if (import.meta.server) return

  const authRoutes = ['/login'] // Routes only for unauthenticated users
  const publicRoutes = ['/inbox'] // Routes accessible by everyone

  const authStore = useAuthStore()

  // Allow access to public routes for everyone
  if (publicRoutes.includes(to.path)) {
    return
  }

  // If user is logged in and trying to access auth routes (like login), redirect to home
  if (authRoutes.includes(to.path) && authStore.isLoggedIn) {
    return navigateTo('/')
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!authStore.isLoggedIn && !authRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})

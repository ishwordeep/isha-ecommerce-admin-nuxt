// plugins/axios.client.ts
import { setBaseUrl } from '~/services/axios.service'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  setBaseUrl(config.public.apiUrl)
})

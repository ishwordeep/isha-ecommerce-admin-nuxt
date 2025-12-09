import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AboutInterface } from '~/services/about.service'
import AboutService from '~/services/about.service'

// 1. Define the form interface (exact shape you'll use in forms)
export interface AboutForm {
  hero: {
    mainTitle: string
    subtitle: string
    buttonText: string
    stats: { number: string; label: string }[]
  }
  statements: {
    icon: string
    iconBackgroundColor: string
    title: string
    description: string
  }[]
  productStory: {
    year: string
    milestoneTitle: string
    description: string
  }[]
  team: {
    name: string
    titleRole: string
    shortBio: string
    imageUrl: string
  }[]
  coreValues: {
    icon: string
    color: string
    title: string
    description: string
  }[]
}

// 2. Empty form factory
const emptyAboutForm = (): AboutForm => ({
  hero: {
    mainTitle: '',
    subtitle: '',
    buttonText: '',
    stats: [],
  },
  statements: [],
  productStory: [],
  team: [],
  coreValues: [],
})

// 3. Mapper: AboutInterface → AboutForm
const mapAboutToForm = (about: AboutInterface | null): AboutForm => {
  if (!about) return emptyAboutForm()
  return {
    hero: {
      mainTitle: about.hero.mainTitle ?? '',
      subtitle: about.hero.subtitle ?? '',
      buttonText: about.hero.buttonText ?? '',
      stats:
        about.hero.stats?.map((stat) => ({
          number: stat.number ?? '',
          label: stat.label ?? '',
        })) ?? [],
    },
    statements:
      about.statements?.map((s) => ({
        icon: s.icon ?? '',
        iconBackgroundColor: s.iconBackgroundColor ?? '',
        title: s.title ?? '',
        description: s.description ?? '',
      })) ?? [],
    productStory:
      about.productStory?.map((p) => ({
        year: p.year ?? '',
        milestoneTitle: p.milestoneTitle ?? '',
        description: p.description ?? '',
      })) ?? [],
    team:
      about.team?.map((t) => ({
        name: t.name ?? '',
        titleRole: t.titleRole ?? '',
        shortBio: t.shortBio ?? '',
        imageUrl: t.imageUrl ?? '',
      })) ?? [],
    coreValues:
      about.coreValues?.map((cv) => ({
        icon: cv.icon ?? '',
        color: cv.color ?? '',
        title: cv.title ?? '',
        description: cv.description ?? '',
      })) ?? [],
  }
}

export const useAboutStore = defineStore('about', () => {
  const about = ref<AboutInterface | null>(null)
  const states = {
    isFetching: false,
    isUpdating: false,
  }
  const formInputs = reactive<AboutForm>(emptyAboutForm())

  const initializeForm = async () => {
    states.isFetching = true
    try {
      const res = await fetchAbout()
      const about = res?.data?.data ?? null
      if (about) Object.assign(formInputs, mapAboutToForm(about))
    } finally {
      states.isFetching = false
    }
  }

  const setAbout = (data: AboutInterface) => {
    about.value = data
  }

  const clearAbout = () => {
    about.value = null
  }

  const fetchAbout = async () => {
    states.isFetching = true
    try {
      // Simulate an API call to fetch about information
      const response = await AboutService.fetchAbout()
      if (response.data?.success) {
        setAbout(response.data.data as AboutInterface)
      }
      return response
    } catch (error) {
      console.error('Failed to fetch about information:', error)
    } finally {
      states.isFetching = false
    }
  }

  const updateAbout = async (payload: Partial<AboutInterface>) => {
    states.isUpdating = true
    try {
      // Simulate an API call to update about information
      const response = await AboutService.updateAbout(payload)
      if (response.data?.success) {
        setAbout(response.data.data as AboutInterface)
      }
      return response
    } catch (error) {
      console.error('Failed to update about information:', error)
    } finally {
      states.isUpdating = false
    }
  }

  return {
    about,
    setAbout,
    clearAbout,
    fetchAbout,
    updateAbout,
    states,
    initializeForm,
    formInputs,
    emptyAboutForm,
  }
})

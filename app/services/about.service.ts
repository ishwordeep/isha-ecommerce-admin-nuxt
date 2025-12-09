import AxiosService from '~/services/axios.service'

export interface AboutInterface {
  hero: Hero
  statements: Statement[]
  productStory: ProductStory[]
  team: Team[]
  coreValues: CoreValue[]
}

export interface CoreValue {
  icon: string
  color: string
  title: string
  description: string
}

export interface Team {
  name: string
  titleRole: string
  shortBio: string
  imageUrl: string
}

export interface ProductStory {
  year: string
  milestoneTitle: string
  description: string
}

export interface Statement {
  icon: string
  iconBackgroundColor: string
  title: string
  description: string
}

export interface Hero {
  mainTitle: string
  subtitle: string
  buttonText: string
  stats: Stat[]
}

export interface Stat {
  number: string
  label: string
}

interface AboutResponse {
  data: AboutInterface | null
  message: string
  success: boolean
}

interface AboutServiceResponse<T> {
  data?: T
  error?: any
}

class AboutService {
  async fetchAbout(): Promise<AboutServiceResponse<AboutResponse>> {
    return await AxiosService.get<AboutResponse>('/setting/about')
  }

  async updateAbout(
    payload: Partial<AboutInterface>
  ): Promise<AboutServiceResponse<AboutResponse>> {
    return await AxiosService.put('/setting/about', payload)
  }
}

export default new AboutService()

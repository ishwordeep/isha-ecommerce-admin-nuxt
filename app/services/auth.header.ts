interface AuthHeaders {
  Authorization?: string
  'X-Authorization'?: string
}

export default function AuthHeader(): AuthHeaders {
  let accessToken: string | null = ''
  let xAccessToken: string | null = ''

  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken')
    xAccessToken = localStorage.getItem('xAccessToken')
  }

  return {
    ...(accessToken && {
      Authorization: 'Bearer ' + accessToken,
    }),
    ...(xAccessToken && {
      'X-Authorization': 'Bearer ' + xAccessToken,
    }),
  }
}

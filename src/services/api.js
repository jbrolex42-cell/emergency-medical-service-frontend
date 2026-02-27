import axios from 'axios'
const api = axios.create({
  baseURL: 'https://emergency-medical-backend-2450.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {

    try {

      const storage = localStorage.getItem('ems-auth-storage')

      if (storage) {
        const parsed = JSON.parse(storage)

        if (parsed?.state?.token) {
          config.headers.Authorization =
            `Bearer ${parsed.state.token}`
        }
      }

    } catch (error) {
      console.error("Auth storage parse error:", error)
    }

    return config
  },
  (error) => Promise.reject(error)
)


api.interceptors.response.use(
  response => response,

  error => {

    if (error.response?.status === 401) {
      localStorage.removeItem('ems-auth-storage')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
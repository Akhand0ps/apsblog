import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchMe, login } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function bootstrap() {
      try {
        const { data } = await fetchMe()
        if (isMounted) {
          setUser(data)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      isMounted = false
    }
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await fetchMe()
      setUser(data)
    } catch (err) {
      setUser(null)
      throw err
    }
  }, [])

  const handleLogin = useCallback(
    async (credentials) => {
      setLoading(true)
      setError(null)
      try {
        const response = await login(credentials)
        await refreshUser()
        return response
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [refreshUser],
  )

  const logout = useCallback(() => {
    // server uses HTTP-only cookies; clearing requires backend endpoint.
    // For now, we clear local state to reflect logged-out view.
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, error, login: handleLogin, logout, refreshUser }),
    [user, loading, error, handleLogin, logout, refreshUser],
  )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  }

  // The consumer hook lives alongside the provider to keep usage ergonomic.
  // eslint-disable-next-line react-refresh/only-export-components
  export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

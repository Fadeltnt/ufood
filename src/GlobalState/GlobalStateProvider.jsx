import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { getTokenInfo } from '../api/User'
import { useQuery } from '@tanstack/react-query'
import { GlobalStateContext } from './GlobalStateContext'

export const GlobalStateProvider = ({ children }) => {
  const navigate = useNavigate()
  const tokenQuery = useQuery({
    queryKey: ['token'],
    queryFn: async () => {
      const token = Cookies.get('token') || null
      if (!token) {
        return null
      }
      return await getTokenInfo(token)
    },
  })

  const [globalState, setGlobalState] = useState({
    email: null,
    userId: null,
    name: null,
    isLogged: false,
    token: Cookies.get('token') || null,
  })

  useEffect(() => {
    if (tokenQuery.isSuccess) {
      const tokenInfo = tokenQuery.data
      if (tokenInfo) {
        setGlobalState({
          email: tokenInfo.email,
          userId: tokenInfo.id,
          name: tokenInfo.name,
          token: tokenInfo.token,
          isLogged: true,
        })
      }
    }
  }, [tokenQuery.data, tokenQuery.isSuccess])

  useEffect(() => {
    if (tokenQuery.isError) {
      Cookies.remove('token')
      setGlobalState({
        ...globalState,
        userId: null,
        name: null,
        token: null,
        isLogged: false,
      })
      navigate('/login')
    }
  }, [tokenQuery.isError, navigate, globalState])

  const setStateLogin = (data) => {
    const cookiesOptions = {
      expires: 7,
    }
    Cookies.set('token', data.token, cookiesOptions)
    setGlobalState({
      email: data.email,
      userId: data.id,
      name: data.name,
      token: data.token,
      isLogged: true,
    })
    navigate('/')
  }

  const setStateRegister = (data) => {
    setGlobalState({
      ...globalState,
      email: data.email,
      userId: data.id,
      name: data.name,
    })
    navigate('/login')
  }

  const setStateLogout = () => {
    Cookies.remove('token')
    setGlobalState({
      ...globalState,
      userId: null,
      name: null,
      token: null,
      isLogged: false,
    })
    navigate('/')
  }

  return (
    <GlobalStateContext.Provider
      value={{ globalState, setStateLogin, setStateRegister, setStateLogout }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

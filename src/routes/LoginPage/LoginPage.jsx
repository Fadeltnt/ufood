import { Link } from 'react-router-dom'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import classes from './LoginPage.module.css'
import { login } from '../../api/User'
import { useMutation } from '@tanstack/react-query'
import { useGlobalState } from '../../GlobalState/GlobalStateContext.js'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { signup } from '../../api/User'

export default function LoginPage() {
  const { globalState, setStateLogin } = useGlobalState()

  const navigate = useNavigate()
  useEffect(() => {
    if (globalState.isLogged) {
      navigate('/')
    }
  }, [globalState, navigate])

  const { mutate, isSuccess, isLoading, isError, data, error } = useMutation({
    mutationFn: login,
  })

  const onSubmit = (event) => {
    event.preventDefault()
    const email = event.target['email-login'].value
    const password = event.target['password-login'].value
    const user = {
      email: email,
      password: password,
    }
    mutate(user)
  }

  useEffect(() => {
    if (isSuccess && data) {
      setStateLogin(data)
    }
  }, [isSuccess, data, setStateLogin])

  const onGoogleSuccess = (response) => {
    console.log(response)

    const userData = jwtDecode(response.credential)
    const user = {
      email: userData.email,
      password: userData.sub,
    }

    login(user)
      .then((data) => {
        setStateLogin(data)
      })
      .catch(() => {
        const signupData = {
          name: userData.name,
          email: userData.email,
          password: userData.sub,
        }

        signup(signupData).then(() => {
          const user = {
            email: userData.email,
            password: userData.sub,
          }

          login(user).then((data) => {
            setStateLogin(data)
          })
        })
      })
  }

  const onGoogleError = (error) => {
    console.log(error)
  }

  return (
    <>
      <NavigationBar />
      <div className={classes.Page}>
        <div className={classes.Onclick}>
          <div className={classes.OnclickHeader}>
            <div className={classes.Title}>Sign in</div>
          </div>
          <div className={classes.Content}>
            <form onSubmit={onSubmit} className={classes.LoginWrapper}>
              <div className={classes.UsernameWrapper}>
                <input
                  placeholder='Email'
                  className={classes.Username}
                  id='email-login'
                  required
                  defaultValue={globalState.email || ''}
                ></input>
              </div>
              <div className={classes.PasswordWrapper}>
                <input
                  placeholder='Password'
                  className={classes.Password}
                  id='password-login'
                  type='password'
                  required
                ></input>
              </div>
              {isError && <div style={{ color: 'red' }}>{error.message}</div>}
              <button
                className={classes.Submit}
                disabled={isLoading ? true : false}
              >
                {isLoading ? '...' : 'Submit'}
              </button>
            </form>

            {/* Google sign in */}
            <div className={classes.GoogleLoginSection}>
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

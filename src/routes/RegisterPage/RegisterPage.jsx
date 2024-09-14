import classes from './RegisterPage.module.css'
import { useMutation } from '@tanstack/react-query'
import { signup, login } from '../../api/User.js'
import { useGlobalState } from '../../GlobalState/GlobalStateContext.js'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import NavigationBar from '../../components/NavigationBar/NavigationBar.jsx'

export default function RegisterPage() {
  const { globalState, setStateRegister, setStateLogin } = useGlobalState()

  const navigate = useNavigate()
  useEffect(() => {
    if (globalState.isLogged) {
      navigate('/')
    }
  }, [globalState, navigate])

  const { mutate, isSuccess, isLoading, isError, data, error } = useMutation({
    mutationFn: signup,
  })

  const onSubmit = async (event) => {
    event.preventDefault()
    const signupData = {
      name: event.target['name-signup'].value,
      email: event.target['email-signup'].value,
      password: event.target['password-signup'].value,
    }
    mutate(signupData)
  }

  useEffect(() => {
    if (isSuccess && data) {
      setStateRegister(data)
    }
  }, [isSuccess, data, setStateRegister])

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
          login(user)
            .then((data) => {
              setStateLogin(data)
            })
            .catch((e) => {
              console.error(e)
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
            <div className={classes.Title}>SignUp</div>
          </div>
          <div className={classes.Content}>
            <form onSubmit={onSubmit} className={classes.LoginWrapper}>
              <div className={classes.UsernameWrapper}>
                <input
                  placeholder='Name'
                  className={classes.Username}
                  id='name-signup'
                  required
                ></input>
              </div>
              <div className={classes.PasswordWrapper}>
                <input
                  placeholder='Email'
                  className={classes.Password}
                  required
                  id='email-signup'
                ></input>
              </div>
              <div className={classes.PasswordWrapper}>
                <input
                  className={classes.Password}
                  placeholder='Password'
                  type='password'
                  id='password-signup'
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

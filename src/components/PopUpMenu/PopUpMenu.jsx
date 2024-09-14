import { Link } from 'react-router-dom'
import classes from '../NavigationBar/NavigationBar.module.css'
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import { useState } from 'react'
import {
  AiOutlineClose,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineUser,
} from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { FaHome, FaUser } from 'react-icons/fa'
import { HomePage } from '../../routes/HomePage/HomePage.jsx'

import { FaRegUserCircle } from 'react-icons/fa'

function PopUpMenu() {
  const [inputValue, setInputValue] = useState('')
  const [loggedIn, setLoggedIn] = useState(true)
  const [nav, setNav] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [accountText, setAccountText] = useState('Account')
  const [LoginText, setLoginText] = useState('Login')

  const handleSearchClick = () => {
    setShowSearchBar(!showSearchBar)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }
  const handleHomeClick = () => {
    // Recharge la page lorsqu'on clique sur le bouton Home
    window.location.home
    //window.location.reload();
  }

  const handleProfileClick = () => {
    // Recharge la page lorsqu'on clique sur le bouton Home
    window.location.reload()
    //window.location.reload();
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setInputValue(e.target.value)
  }
  const handleLoginClick = () => {
    // Mettez ici votre logique de connexion
    // ...
    setLoggedIn(true)
    setLoginText('Rami Safi')
  }

  const handleLogoutClick = () => {
    // Mettez ici votre logique de déconnexion
    // ...
    setLoggedIn(false)
    setLoginText('Login')
  }
  const handleBypassLoginClick = () => {
    // Mettez ici votre logique pour "By-pass login"
    // ...
    setLoggedIn(true)
    setLoginText('Rami Safi')
  }

  return (
    <div className={`${classes.navcontainer} ${classes.fixedTop}`}>
      <div
        className={'max-w-[1640px] mx-auto flex justify-between items-center'}
      >
        <div className={'flex items-center'}>
          <div onClick={() => setNav(!nav)} className={'cursor-pointer'}>
            <AiOutlineMenu size={30} />
          </div>
          <div className={classes.logocontainer}>
            <Link to='/' onClick={handleHomeClick}>
              <img
                className={`${classes.logo} ${classes.smallLogo}`}
                src={logo}
                alt='logo'
              />
            </Link>
          </div>
          {/* Search bar */}
          <div
            className={
              'bg-white rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[1000px]'
            }
          ></div>
          {/* Mobile menu */}
          {nav ? (
            <div
              className={'bg-black/80 fixed w-full h-screen z-10 top-0 left-0'}
            ></div>
          ) : (
            ''
          )}
          {/* Side drawer Menu */}
          <div
            className={
              nav
                ? 'fixed top-0 left-0 w-[300px] h-screen bg-black z-10 duration-500 transition-all'
                : 'fixed top-0 left-[-100%] w-[300px] h-screen bg-gray-800 z-10 duration-300'
            }
          >
            <AiOutlineClose
              onClick={() => setNav(!nav)}
              size={30}
              className={'absolute right-4 top-4 cursor-pointer'}
            />
            <h2 className={'text-2xl p-4'}>
              <Link to='/' onClick={handleHomeClick}>
                <img
                  className={`${classes.logo} ${classes.smallLogo}`}
                  src={logo}
                  alt='logo'
                />
              </Link>
            </h2>
            <nav>
              <ul className={'flex flex-col p-4 text-white'}>
                <li
                  className={
                    'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                  }
                ></li>

                <li
                  className={
                    'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                  }
                >
                  <Link
                    to='/'
                    onClick={handleHomeClick}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AiIcons.AiFillHome size={25} className={'mr-4'} />
                    Home
                  </Link>
                </li>

                {loggedIn ? (
                  <>
                    {/* Si connecté */}

                    <li
                      className={
                        'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                      }
                    >
                      <AiOutlineUser size={25} className={'mr-4'} />
                      <Link to='/user'>{'Test User'}</Link>
                    </li>
                    <li
                      className={
                        'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                      }
                    >
                      <Link
                        to='/login'
                        onClick={handleLogoutClick}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <AiOutlineLogout size={25} className={'mr-4'} />
                        Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    {/* Si non connecté */}
                    <li
                      className={
                        'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                      }
                    >
                      <Link
                        to='/login'
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <AiOutlineLogin size={25} className={'mr-4'} />
                        {LoginText}
                      </Link>
                    </li>
                    <li
                      className={
                        'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                      }
                    >
                      <Link
                        to=''
                        onClick={handleBypassLoginClick}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <AiOutlineLogin size={25} className={'mr-4'} />
                        {'Bypass login'}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopUpMenu

import { Link } from 'react-router-dom'
import classes from './NavigationBar.module.css'
import logo from '../../assets/logo.png'
import './search-result.css'
import './results-list.css'
import { useState } from 'react'
import { useGlobalState } from '../../GlobalState/GlobalStateContext.js'
import { TbLogin2 } from "react-icons/tb";
import { TbLogout2 } from "react-icons/tb";
import { BiHomeAlt2 } from "react-icons/bi";
import { GrSearchAdvanced } from "react-icons/gr";
import md5 from 'md5';

import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineUser,
} from 'react-icons/ai'

import { SearchResultsList } from './SearchResultsList.jsx'
import useHistoryNavigation from '../../hooks/useRouterNavigation.js'
import { fetchRestaurantsWithMaxLimit } from '../../api/Restaurants.js'
import { fetchUsersWithMaxLimit } from '../../api/User.js'

const fetchFilteredRestaurants = async (value) =>
  await fetchRestaurantsWithMaxLimit()
    .then((response) =>
      response
        .filter((restaurant) => {
          return (
            value &&
            restaurant &&
            ((restaurant.name &&
              restaurant.name.toLowerCase().includes(value.toLowerCase())) ||
              (restaurant.address &&
                restaurant.address.toLowerCase().includes(value.toLowerCase())))
          )
        })
        .map((restaurant) => {
          return {
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            isResto: true,
          }
        }),
    )
    .catch((error) => console.error('Fetch error:', error))

const fetchFilteredUsers = async (value) =>
  await fetchUsersWithMaxLimit()
    .then((response) =>
      response
        .filter((user) => {
          return (
            value &&
            user &&
            ((user.name &&
              user.name.toLowerCase().includes(value.toLowerCase())) ||
              (user.email &&
                user.email.toLowerCase().includes(value.toLowerCase())))
          )
        })
        .map((user) => {
          return {
            id: user.id,
            name: user.name,
            address: user.email,
            isResto: false,
          }
        }),
    )
    .catch((error) => console.error('Fetch error:', error))

function NavigationBar() {
  const { globalState, setStateLogout } = useGlobalState()
  const [inputValue, setInputValue] = useState('')
  const [nav, setNav] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const fetchData = async (value) => {
    try {
      const fetchRestaurantsPromise = fetchFilteredRestaurants(value).then(
        (filteredRestaurants) => {
          setSearchResults((prev) => prev.concat(filteredRestaurants))
          return filteredRestaurants
        },
      )

      const fetchUsersPromise = globalState.isLogged
        ? fetchFilteredUsers(value).then((filteredUsers) => {
            setSearchResults((prev) => prev.concat(filteredUsers))
            return filteredUsers
          })
        : Promise.resolve([])

      await Promise.race([fetchRestaurantsPromise, fetchUsersPromise])
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const goToPage = useHistoryNavigation()

  const handleResultClick = (result) => {
    setInputValue('')
    setSearchResults([])
    if (result.isResto) {
      goToPage(`/restaurant/${result.id}`)
    } else {
      goToPage(`/user/${result.id}`)
    }
  }

  const handleInputChange = async (value) => {
    setInputValue(value)
    setSearchResults([])
    if (value.trim() !== '') await fetchData(value)
  }

  const handleLogoutClick = () => {
    setStateLogout()
  }
  const userIconUrl = globalState.isLogged ? `https://www.gravatar.com/avatar/${md5(globalState.email)}?d=identicon` : '';

  return (
    <div className={`${classes.navcontainer} ${classes.fixedTop}`}>
      <div
        className={'max-w-[1640px] mx-auto flex justify-between items-center'}
      >
        <div className={'flex items-center'}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div onClick={() => setNav(!nav)} className={'cursor-pointer'}>
            <AiOutlineMenu size={30} />
          </div>
          <div className={classes.logocontainer}>
            <Link to='/'>
              <img
                className={`${classes.logo} ${classes.smallLogo}`}
                src={logo}
                alt='logo'
              />
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Search bar */}
            <div className='bg-white rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[1000px]'>
              <GrSearchAdvanced size={25} color={'black'} />
              <input
                className='bg-transparent p-2 w-full focus:outline-none text-black'
                type='text'
                placeholder='Search on Ufood'
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </div>

            {/* Liste des résultats de recherche */}
            <div
              className='search-results-list'
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: '0',
                zIndex: '1000',
                width: '100%',
              }}
            >
              <SearchResultsList
                results={searchResults}
                onResultClick={handleResultClick}
              />
            </div>
          </div>
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
              <Link to='/'>
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
                >
                  <div
                    className={
                      'bg-white rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[300px]'
                    }
                  >
                    <SearchMenu
                      handleInputChange={handleInputChange}
                      inputValue={inputValue}
                    />
                  </div>
                </li>

                <li
                  className={
                    'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                  }
                >
                  <Link
                    to='/'
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <BiHomeAlt2 size={25} className={'mr-4'} />
                    Home
                  </Link>
                </li>

                {globalState.isLogged ? (
                  <>
                    {/* Si connecté */}

                    <li
                      className={
                        'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                      }
                    >
                      <img src={userIconUrl} alt="User" style={{ width: '25px', height: '25px', borderRadius: '50%' }}
                           className={'mr-4'} />
                      <Link to="/user">{globalState.name}</Link>
                    </li>
                    <li
                      className={
                        'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                      }
                    >
                      <Link
                        to=''
                        onClick={handleLogoutClick}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <TbLogout2  size={25} className={'mr-4'} />
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
                        <TbLogin2 size={25} className={'mr-4'} />
                        {'Login'}
                      </Link>
                    </li>
                    <li
                      className={
                        'text-xl py-4 flex items-center cursor-pointer border-b border-gray-300 hover:opacity-70 transition-all'
                      }
                    >
                      <Link
                        to='/register'
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <TbLogin2 size={25} className={'mr-4'} />
                        {'Register'}
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

const SearchMenu = ({ handleInputChange, inputValue }) => {
  return (
    <>
      <AiOutlineSearch size={25} color={'black'} />
      <input
        className={'bg-transparent p-2 w-full focus:outline-none text-black'}
        type={'text'}
        placeholder={'Search on Ufood'}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </>
  )
}

export default NavigationBar

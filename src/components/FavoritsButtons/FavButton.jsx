import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import classes from './FavButton.module.css'
import { useState, useEffect } from 'react'
import {
  addRestaurantToFavorites,
  getFavoritesListsOfUserOfRestaurant,
  removeRestaurantFromFavorites,
} from '../../api/User'
import { useMutation } from '@tanstack/react-query'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'
import { useNavigate } from 'react-router-dom'

export default function FavButton({ restaurant_id }) {
  const [favorites, setFavorites] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const { globalState } = useGlobalState()
  const navigate = useNavigate()

  const { mutate: addFavorite } = useMutation({
    mutationFn: addRestaurantToFavorites,
    onSuccess: (updatedFavorites) => {
      setFavorites(updatedFavorites)
    },
    onError: (error) => {
      console.error('Error adding restaurant to favorite:', error)
    },
  })

  const { mutate: removeFromFavorites } = useMutation({
    mutationFn: removeRestaurantFromFavorites,
    onSuccess: (updatedFavorites) => {
      setFavorites(updatedFavorites)
    },
    onError: (error) => {
      console.error('Error removing restaurant from favorite:', error)
    },
  })

  useEffect(() => {
    if (!globalState.isLogged) {
      return
    }
    const fetchFavorites = async () => {
      try {
        const favs = await getFavoritesListsOfUserOfRestaurant(
          restaurant_id,
          globalState.userId,
        )
        setFavorites(favs)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      }
    }
    fetchFavorites()
  }, [restaurant_id, globalState.userId, globalState.isLogged])

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    if (!globalState.isLogged) {
      navigate('/login')
      return
    }
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleFavoriteSubmit = (favId) => {
    const isLiked = favorites.find((fav) => fav.id === favId).isLiked
    if (!isLiked) {
      addFavorite({
        restaurantId: restaurant_id,
        favoriteId: favId,
        userId: globalState.userId,
      })
    } else {
      removeFromFavorites({
        restaurantId: restaurant_id,
        favoriteId: favId,
        userId: globalState.userId,
      })
    }
    handleClose()
  }

  return (
    <>
      <div className={classes.favorite}>
        <Button
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <span>{'🤍'}</span>
        </Button>
      </div>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {favorites.map((fav, index) => (
          <MenuItem
            onClick={() => handleFavoriteSubmit(fav.id)}
            key={index}
            className={`${fav.isLiked && classes.selected}`}
          >
            <div>{fav.name}</div>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

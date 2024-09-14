import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  getRestaurantIdVisitedOfUsers,
  deleteFavoriteList,
  fetchRestaurantsByIds,
  getFavoriteListById,
} from '../../api/User.js'
import { GalleryItem } from './GalleryItem.jsx'
import ModifyName from '../FavoritsButtons/ModifyName.jsx'
import { useGlobalState } from '../../GlobalState/GlobalStateContext.js'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  @media only screen and (max-width: 735px) {
    gap: 3px;
  }
`
const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: red;
  border: 2px solid red;
  border-radius: 5px;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darkred;
    color: white;
  }
`

const NoRestaurant = styled.div`
  display: flex;
  justify-content: center;
  margin: 10vh;
`

const GoToHome = styled.u`
  color: blue;
`

export function Gallery({ favoriteListId, userId }) {
  const [restaurants, setRestaurants] = useState([])
  const { globalState } = useGlobalState()

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!userId) return
      try {
        if (favoriteListId === 'visited') {
          const visitedRestaurantsData =
            await getRestaurantIdVisitedOfUsers(userId)
          const visitedRestaurants = await fetchRestaurantsByIds(
            visitedRestaurantsData,
          )
          console.log('visited', visitedRestaurants)
          setRestaurants(visitedRestaurants)
        } else if (favoriteListId) {
          // Fetch favorite restaurants for a specific list ID
          const data = await getFavoriteListById(favoriteListId)
          const restaurants = await fetchRestaurantsByIds(
            data.restaurants.map((r) => r.id),
          )
          setRestaurants(restaurants)
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      }
    }
    fetchRestaurants()
  }, [userId, favoriteListId])

  if (!userId || !globalState.userId) return <div>loading...</div>

  const shouldShowDeleteButton =
    favoriteListId !== 'visited' && globalState.userId === userId

  return (
    <>
      {shouldShowDeleteButton && (
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <StyledButton
            onClick={() => deleteFavoriteList(favoriteListId)}
            style={{ marginRight: '10px', color: 'white' }}
          >
            Delete list
          </StyledButton>
          {/* Assurez-vous de passer listId et onSuccess comme props au composant ModifyName */}
          <ModifyName
            listId={favoriteListId}
            onSuccess={() => {
              /* logique après succès */
            }}
          />
        </div>
      )}
      {restaurants.length > 0 ? (
        <Grid>
          {restaurants.map((restaurant, index) => (
            <GalleryItem
              key={index}
              idRestaurant={restaurant.id}
              name={restaurant.name}
              imagePath={restaurant.pictures[0]}
            />
          ))}
        </Grid>
      ) : (
        <NoRestaurant>No restaurants found.</NoRestaurant>
      )}
    </>
  )
}

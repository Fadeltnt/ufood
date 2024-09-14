import axios from 'axios'
import Cookies from 'js-cookie'
import { apiUrl, secureApiUrl } from './api'

const fetchRestaurantById = async (restaurantId) =>
  await axios
    .get(`${secureApiUrl}/restaurants/${restaurantId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error fetching restaurant with ID ${restaurantId}:`, error)
      return null // Return null to filter this out later
    })

export async function fetchRestaurantsByIds(restaurantIds) {
  const results = await Promise.all(
    restaurantIds.map((id) => fetchRestaurantById(id)),
  )
  return results.filter((res) => res) // Filter out null results
}

export const getUserInformation = async (id) =>
  await fetch(`${secureApiUrl}/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookies.get('token'),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('data', data)
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        rating: data.rating,
        followers: data.followers,
        following: data.following,
      }
    })
    .catch((error) => {
      console.error('Error fetching user information:', error)
    })

export const getFavoriteListById = async (id) =>
  await axios
    .get(`${secureApiUrl}/favorites/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    })
    .then((response) => response.data)

export const addListToFavorite = async ({ name, owner }) =>
  await axios.post(
    `${secureApiUrl}/favorites/`,
    JSON.stringify({ name, owner }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    },
  )

export const deleteFavoriteList = async (listId) =>
  await axios
    .delete(`${secureApiUrl}/favorites/${listId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    })
    .then(() => {
      alert('Liste supprimée avec succès.')
      window.location.href = '/user'
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression de la liste :', error)
      alert('La suppression de la liste a échoué.')
    })

export const modifyFavoriteListName = async ({ name, owner }, listId) =>
  await axios.put(
    `${secureApiUrl}/favorites/${listId}`,
    JSON.stringify({ name, owner }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    },
  )

export const getRestaurantIdVisitedOfUsers = async (id) =>
  await fetch(`${secureApiUrl}/users/${id}/restaurants/visits`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookies.get('token'),
    },
  })
    .then((response) => response.json())
    .then((data) => data.items.map((restaurant) => restaurant.restaurant_id))
    .catch((error) => {
      console.error('Error fetching user visits list:', error)
      return []
    })

export const getAllRestaurantsFavoritesOfUser = async (id) =>
  await fetch(`${secureApiUrl}/users/${id}/favorites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookies.get('token'),
    },
  })
    .then((response) => response.json())
    .then((data) => data.items)
    .catch((error) => {
      console.error('Error fetching user favorites list:', error)
    })

export const getFavoritesListsOfUser = async (id) =>
  await getAllRestaurantsFavoritesOfUser(id).then((favorites) =>
    favorites.map((favList) => {
      return {
        name: favList.name,
        id: favList.id,
      }
    }),
  )

export const getFavoritesListsOfUserOfRestaurant = async (
  restaurant_id,
  userId,
) => {
  const favorites = await getAllRestaurantsFavoritesOfUser(userId)
  return favorites.map((favList) => {
    let isLiked = false
    for (const restaurant of favList.restaurants) {
      if (restaurant.id === restaurant_id) {
        isLiked = true
      }
    }
    return {
      name: favList.name,
      id: favList.id,
      isLiked: isLiked,
    }
  })
}

export const addRestaurantToFavorites = async ({
  restaurantId,
  favoriteId,
  userId,
}) => {
  try {
    const response = await axios.post(
      `${secureApiUrl}/favorites/${favoriteId}/restaurants`,
      JSON.stringify({ id: restaurantId }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get('token'),
        },
      },
    )
    console.log('response', response)
    return await getFavoritesListsOfUserOfRestaurant(restaurantId, userId)
  } catch (error) {
    throw new Error(
      error.response.data.message || 'Error creating restaurant visit',
    )
  }
}

export const removeRestaurantFromFavorites = async ({
  restaurantId,
  favoriteId,
  userId,
}) => {
  try {
    const response = await axios.delete(
      `${secureApiUrl}/favorites/${favoriteId}/restaurants/${restaurantId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get('token'),
        },
      },
    )
    console.log('response', response)
    return await getFavoritesListsOfUserOfRestaurant(restaurantId, userId)
  } catch (error) {
    throw new Error(
      error.response.data.message || 'Error creating restaurant visit',
    )
  }
}

export const login = async ({ email, password }) => {
  try {
    const params = new URLSearchParams()
    params.append('email', email)
    params.append('password', password)
    const response = await axios.post(`${secureApiUrl}/login`, params)
    return response.data
  } catch (error) {
    throw new Error(error.response.data || 'Unexpected error')
  }
}

export const logout = async () => {
  try {
    const response = await axios.post(`${secureApiUrl}/logout`)
    console.log('response', response)
  } catch (error) {
    console.error('logout-error:', error)
    throw new Error(error.response.data.message || 'Unexpected error')
  }
}

export const signup = async ({ name, email, password }) => {
  try {
    const params = new URLSearchParams()
    params.append('name', name)
    params.append('email', email)
    params.append('password', password)
    const response = await axios.post(`${secureApiUrl}/signup`, params)
    return response.data
  } catch (error) {
    console.error('signup-error:', error)
    throw new Error(error.response.data || 'Unexpected error')
  }
}

export const getTokenInfo = async (token) => {
  try {
    const response = await axios.get(`${secureApiUrl}/tokenInfo`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
    console.log('response', response)
    return response.data
  } catch (error) {
    console.error('tokenInfo-error:', error)
    throw new Error(error.response.data.message || 'Unexpected error')
  }
}

const fetchUserMaxLimit = async () =>
  await axios.get(`${apiUrl}/users`).then((res) => res.data.total)

export const fetchUsersWithMaxLimit = async () => {
  const maxLimit = await fetchUserMaxLimit()
  return await axios
    .get(`${apiUrl}/users?limit=${maxLimit}`)
    .then((res) => res.data.items)
}

export const followUser = async (friendUserId) =>
  await axios
    .post(`${secureApiUrl}/follow`, JSON.stringify({ id: friendUserId }), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error following user:', error)
      throw new Error(error.response.data.message || 'Unexpected error')
    })

export const unfollowUser = async (friendUserId) =>
  await axios
    .delete(`${secureApiUrl}/follow/${friendUserId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error unfollowing user:', error)
      throw new Error(error.response.data.message || 'Unexpected error')
    })

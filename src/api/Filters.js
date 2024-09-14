import axios from 'axios'
import { apiUrl } from './api'

export const fetchRestaurants = async ({ genres, rating, price, orderBy }) => {
  let url = `${apiUrl}/restaurants`

  const params = new URLSearchParams()

  params.append('limit', 200)

  if (genres[0] !== 'all') {
    params.append('genres', genres.join(','))
  }

  const queryString = params.toString()
  url += queryString ? `?${queryString}` : ''

  try {
    const response = await axios.get(url)
    let restaurants = response.data.items

    if (price) {
      if (!price.to) {
        restaurants = restaurants.filter((restaurant) => {
          return restaurant.price_range === price.from
        })
      } else {
        restaurants = restaurants.filter(
          (restaurant) =>
            restaurant.price_range >= price.from &&
            restaurant.price_range <= price.to,
        )
      }
    }

    if (rating) {
      if (!rating.to) {
        restaurants = restaurants.filter((restaurant) => {
          return restaurant.rating === rating.from
        })
      } else {
        restaurants = restaurants.filter(
          (restaurant) =>
            restaurant.rating >= rating.from && restaurant.rating <= rating.to,
        )
      }
    }

    if (orderBy && (price || rating)) {
      const key = price ? 'price_range' : 'rating'
      restaurants = restaurants.sort((a, b) => {
        let aValue = a[key]
        let bValue = b[key]
        return orderBy === 'asc' ? aValue - bValue : bValue - aValue
      })
    }

    return restaurants
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const fetchRestaurantsMap = async ({
  genres,
  rating,
  price,
  searchValue,
}) => {
  let url = `https://ufoodapi.herokuapp.com/unsecure/restaurants`

  const params = new URLSearchParams()

  params.append('limit', 200)

  if (genres[0] !== 'all') {
    params.append('genres', genres.join(','))
  }

  const queryString = params.toString()
  url += queryString ? `?${queryString}` : ''

  try {
    const response = await axios.get(url)
    let restaurants = response.data.items

    if (price) {
      if (!price.to) {
        restaurants = restaurants.filter((restaurant) => {
          return restaurant.price_range === price.from
        })
      } else {
        restaurants = restaurants.filter(
          (restaurant) =>
            restaurant.price_range >= price.from &&
            restaurant.price_range <= price.to,
        )
      }
    }

    if (rating) {
      if (!rating.to) {
        restaurants = restaurants.filter((restaurant) => {
          return restaurant.rating === rating.from
        })
      } else {
        restaurants = restaurants.filter(
          (restaurant) =>
            restaurant.rating >= rating.from && restaurant.rating <= rating.to,
        )
      }
    }

    if (searchValue !== '') {
      restaurants = restaurants.filter((restaurant) => {
        return restaurant.name.toLowerCase().includes(searchValue.toLowerCase())
      })
    }

    return restaurants
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

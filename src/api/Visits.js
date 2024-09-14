import axios from 'axios'
import { secureApiUrl, apiUrl } from './api.js'
import Cookies from 'js-cookie'

export const createRestaurantVisit = async ({ userId, visitData }) =>
  await axios
    .post(
      `${secureApiUrl}/users/${userId}/restaurants/visits`,
      JSON.stringify(visitData),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get('token'),
        },
      },
    )
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(
        error.response.data.message || 'Error creating restaurant visit',
      )
    })

export const getVisitModal = async (idRestaurant, userId) =>
  await fetch(
    `${secureApiUrl}/users/${userId}/restaurants/${idRestaurant}/visits`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    },
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error fetching modal information:', error)
    })

export const getAllRestaurantReviews = async (restaurantId) =>
  await axios
    .get(`${apiUrl}/restaurants/${restaurantId}/visits?limit=200`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('token'),
      },
    })
    .then((response) => response.data.items.reverse())
    .catch((error) => {
      console.error('Error fetching reviews:', error)
      throw new Error('Error fetching reviews')
    })

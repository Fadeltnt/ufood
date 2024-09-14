import axios from 'axios'
import { apiUrl } from './api.js'

const fetchRestaurantMaxLimit = async () =>
  await axios.get(`${apiUrl}/restaurants`).then((res) => res.data.total)

export const fetchRestaurantsWithMaxLimit = async () => {
  const maxLimit = await fetchRestaurantMaxLimit()
  return await axios
    .get(`${apiUrl}/restaurants?limit=${maxLimit}`)
    .then((res) => res.data.items)
}

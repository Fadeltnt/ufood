import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchMaxLimit = async () => {
  const response = await axios.get(
    'https://ufoodapi.herokuapp.com/unsecure/restaurants',
  )
  return response.data.total
}

const fetchRestaurantsWithLimit = async (maxLimit) => {
  const response = await axios.get(
    `https://ufoodapi.herokuapp.com/unsecure/restaurants?limit=${maxLimit}`,
  )
  return response.data.items
}

export const useRestosGenres = () => {
  return useQuery({
    queryKey: ['restosWithMaxLimit'],
    queryFn: async () => {
      const maxLimit = await fetchMaxLimit()
      return fetchRestaurantsWithLimit(maxLimit)
    },
  })
}

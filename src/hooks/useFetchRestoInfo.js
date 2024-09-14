import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useFetchRestoInfo = (id) => {
  return useQuery({
    queryKey: [`restaurant-${id}`],
    queryFn: async () =>
      await axios
        .get(`https://ufoodapi.herokuapp.com/unsecure/restaurants/${id}`)
        .then((res) => res.data),
  })
}

import GenreFilter from '../../components/Header/GenreFilter'
import { useEffect, useState } from 'react'
import HomeMap from './HomeMap.jsx'
import { MapFilters } from '../InfiniteCarousel/CarouselFilters.jsx'
import { fetchRestaurantsMap } from '../../api/Filters'

const getGenres = (data) => {
  let genresList = []
  data.forEach((restaurant) => {
    restaurant.genres.forEach((genre) => {
      if (!genresList.includes(genre)) {
        genresList.push(genre)
      }
    })
  })
  return genresList
}

export function HomePageMap() {
  const [options, setOptions] = useState(['all'])
  const [restaurants, setRestaurants] = useState([])
  const [restoError, setRestoError] = useState(false)
  const [filters, setFilters] = useState({
    genres: options,
    price: null,
    rating: null,
    searchValue: '',
  })

  const handleInputChange = (e) => {
    setFilters((prev) => ({ ...prev, searchValue: e.target.value }))
  }

  useEffect(() => {
    setFilters((prev) => ({ ...prev, genres: options }))
  }, [options])

  useEffect(() => {
    const fetchData = async () =>
      await fetchRestaurantsMap(filters)
        .then((response) => {
          setRestaurants(response)
          setRestoError(false)
        })
        .catch((error) => {
          setRestoError(true)
          console.error(error)
        })
    fetchData()
  }, [filters])

  if (restoError) return <h1>Restaurants could not be fetched</h1>

  return (
    <div className='flex justify-center translate-y-[-115%]'>
      <div className={`w-[50dvw]`}>
        <div className='flex flex-row justify-between m-3 ml-0'>
          <GenreFilter
            genreList={getGenres(restaurants)}
            setOptions={setOptions}
          />
          <div className='flex flex-col justify-end '>
            <MapFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>
        <HomeMap restaurants={restaurants} />
        <input
          type='search'
          value={filters.searchValue}
          onChange={handleInputChange}
          placeholder='Search...'
          className='w-[50%] h-10 m-3 ml-0 p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
        />
      </div>
    </div>
  )
}

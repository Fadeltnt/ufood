import InfiniteCarousel from '../../components/InfiniteCarousel/InfiniteCarousel.jsx'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const getItemsPerScreen = () => {
  if (window.innerWidth < 500) {
    return 2
  } else if (window.innerWidth < 800) {
    return 3
  } else if (window.innerWidth < 1100) {
    return 4
  } else if (window.innerWidth < 1400) {
    return 5
  } else {
    return 6
  }
}

export default function HomePageContent() {
  const [restoGenres, setRestoGenres] = useState([])
  const [itemsPerScreen, setItemsPerScreen] = useState(getItemsPerScreen())

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerScreen = getItemsPerScreen()
      setItemsPerScreen(newItemsPerScreen)
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const restosGenresQuery = useQuery({
    queryKey: ['restosGenres'],
    queryFn: async () =>
      await axios
        .get('https://ufoodapi.herokuapp.com/unsecure/restaurants?limit=130')
        .then((res) => res.data),
  })

  useEffect(() => {
    if (restosGenresQuery.isSuccess) {
      const restaurants = restosGenresQuery.data.items
      const restosByGenre = initializeRestaurantsByGenres(restaurants)
      setRestoGenres(restosByGenre)
    }
  }, [restosGenresQuery.data, restosGenresQuery.isSuccess])

  if (restosGenresQuery.isLoading) {
    return <h1>Loading...</h1>
  }
  if (restosGenresQuery.isError) {
    return <pre>{JSON.stringify(restosGenresQuery.error)}</pre>
  }

  return (
    <>
      <NavigationBar />
      {restosGenresQuery.isSuccess &&
        Object.entries(restoGenres).map(([genre, restaurants], index) => (
          <InfiniteCarousel
            key={index}
            genre={genre}
            restaurants={restaurants}
            itemsPerScreen={itemsPerScreen}
          />
        ))}
    </>
  )
}

const aggregateGenresCounts = (obj) => {
  const counts = {}
  for (let key in obj) {
    if (key.includes(',')) {
      key.split(',').forEach((k) => {
        if (!counts[k]) counts[k] = 0
        counts[k] += obj[key].length
      })
    } else {
      if (!counts[key]) counts[key] = 0
      counts[key] += obj[key].length
    }
  }
  return counts
}

const initializeGenres = (restaurants) => {
  const genres = new Array()
  const categories = Object.groupBy(restaurants, (resto) => resto.genres)

  const counts = aggregateGenresCounts(categories)

  const sortableArray = new Array()
  for (let category in counts) {
    sortableArray.push({ key: category, count: counts[category] })
  }

  const sortedCategories = sortableArray.sort((a, b) => a.count - b.count)
  for (const cat in sortedCategories) {
    genres.unshift(sortedCategories[cat].key)
  }
  return genres
}

const initializeRestaurantsByGenres = (restaurants) => {
  const genres = initializeGenres(restaurants)
  const genreRestaurants = {}
  genres.forEach((genre) => {
    genreRestaurants[genre] = new Array()
    restaurants.forEach((resto) => {
      resto.genres.includes(genre) && genreRestaurants[genre].push(resto)
    })
  })
  return genreRestaurants
}

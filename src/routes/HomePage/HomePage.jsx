import classes from './HomePage.module.css'
import GenresHeader from '../../components/Header/GenresHeader.jsx'
import { useRestosGenres } from '../../hooks/useRestosGenres'
import { useItemsPerScreen } from '../../hooks/useItemsPerScreen'
import InfiniteCarousel from '../../components/InfiniteCarousel/InfiniteCarousel.jsx'
import { initializeRestaurantsByGenres } from '../../utils/initializeRestaurantsByGenres'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import GenreFilter from '../../components/Header/GenreFilter'
import { useState } from 'react'
import { HomePageMap } from '../../components/Map/HomePageMap.jsx'

const GenresCarousels = ({ data, itemsPerScreen }) => {
  return Object.entries(initializeRestaurantsByGenres(data)).map(
    ([genre, restaurants], index) => (
      <div className={classes.homeCarousel} key={index}>
        <InfiniteCarousel
          genres={[genre]}
          restaurants={restaurants}
          itemsPerScreen={itemsPerScreen}
        >
          <div className='text-[1.7rem] text-orange-500 tracking-widest whitespace-nowrap'>
            {genre}
          </div>
        </InfiniteCarousel>
      </div>
    ),
  )
}

const MainCarousel = ({ restaurants, itemsPerScreen, genreList }) => {
  const [options, setOptions] = useState(['all'])
  return (
    <div className={classes.homeCarousel}>
      <InfiniteCarousel
        genres={options}
        restaurants={restaurants}
        itemsPerScreen={itemsPerScreen}
      >
        <div className='z-0 hover:z-50 mb-8'>
          <GenreFilter genreList={genreList} setOptions={setOptions} />
        </div>
      </InfiniteCarousel>
    </div>
  )
}

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

const HomePageContent = ({ isMap }) => {
  const itemsPerScreen = useItemsPerScreen()

  const { data, isLoading, isError, error, isSuccess } = useRestosGenres()

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <pre>{JSON.stringify(error)}</pre>

  return (
    isSuccess && (
      <div className={`${classes.Homepagecontent} ${isMap && 'hidden'}`}>
        <MainCarousel
          restaurants={data}
          itemsPerScreen={itemsPerScreen}
          genreList={getGenres(data)}
        />
        <GenresCarousels data={data} itemsPerScreen={itemsPerScreen} />
      </div>
    )
  )
}

export function HomePage() {
  const [isMap, setIsMap] = useState(false)
  return (
    <div className={classes.content}>
      <NavigationBar />
      <GenresHeader isMap={isMap} setIsMap={setIsMap} />
      <HomePageContent isMap={isMap} />
      {isMap && <HomePageMap />}
    </div>
  )
}

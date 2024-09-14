import classes from './RestoPage.module.css'
import { useParams } from 'react-router-dom'
import { useFetchRestoInfo } from '../../hooks/useFetchRestoInfo'
import RestoMap from '../../components/Map/RestoMap'
import { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import RestoCarousel from '../../components/InfiniteCarousel/RestoCarousel.jsx'
import RestaurantReviews from '../../components/RestaurantReviews/RestaurantReviews'
import Typography from '@mui/material/Typography'
import FavButton from '../../components/FavoritsButtons/FavButton'
import ReviewsButton from '../../components/ReviewsButton/ReviewsButton'

export default function RestoPage() {
  let { id } = useParams()
  const { data, isLoading, isError, error, isSuccess } = useFetchRestoInfo(id)
  const [restoLocation, setRestoLocation] = useState(null)
  const [showOpeningHours, setShowOpeningHours] = useState(false)

  useEffect(() => {
    if (data && data.location && !restoLocation && isSuccess) {
      setRestoLocation(data.location.coordinates.reverse())
    }
  }, [data, restoLocation, isSuccess])

  const toggleOpeningHours = () => {
    setShowOpeningHours(prevState => !prevState);
  };


  // Convert price range to dollar representation
  const getPriceRangeInDollars = (priceRange) => {
    return '$'.repeat(priceRange)
  }

  // Convert the Rating to stars
  const getRatingInStars = (rating) => {
    return '*'.repeat(rating)
  }

  // Function to format opening hours
  const formatOpeningHours = (openingHours) => {
    if (!openingHours) {
      return 'closed'
    }

    const hours = openingHours.split('-')
    const openingHour = hours[0]
    const closingHour = hours[1]
    return `${openingHour} - ${closingHour}`
  }

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <pre>{JSON.stringify(error)}</pre>
  return (
    isSuccess &&
    restoLocation && (
      <>
        <NavigationBar />
        <div className={classes.Page}>
          <div className={classes.Onclick}>
            <div className={classes.OnclickTitle}>
              <div className={classes.TitleContent}>
                <div className={classes.Title}>{data.name}</div>
              </div>
              <FavButton restaurant_id={data.id} />
            </div>
            <div className={classes.Carousel}>
              <RestoCarousel images={data.pictures} />
            </div>
            <div className={classes.content}>
              <div className={classes.InfoResto}>
                  <Typography variant='body1'>
                    Phone Number : {data.tel}
                  </Typography>

                  <Typography variant='body1'>
                    Food Type : {data.genres}
                  </Typography>

                  <Typography variant='body1'>
                    Rating : {getRatingInStars(data.rating)}
                  </Typography>

                  <Typography variant='body1'>
                    Price Range : {getPriceRangeInDollars(data.price_range)}
                  </Typography>
              </div>
              <div className={classes.Heureouvertureweekly}>
                <button className={classes.textButton} onClick={toggleOpeningHours}>
                  <div className={classes.cardLike}>
                    Horaire d ouvertures
                  </div>
                </button>
                {/* Opening hours are conditionally rendered based on the state */}
                {showOpeningHours && (
                  <div className={classes.cardLike}> {/* Add a wrapping div with card-like styling */}
                    <div className={classes.Heureouvertureday}>Monday {formatOpeningHours(data.opening_hours.monday)}</div>
                    <div className={classes.Heureouvertureday}>Tuesday {formatOpeningHours(data.opening_hours.tuesday)}</div>
                    <div className={classes.Heureouvertureday}>Wednesday {formatOpeningHours(data.opening_hours.wednesday)}</div>
                    <div className={classes.Heureouvertureday}>Thursday {formatOpeningHours(data.opening_hours.thursday)}</div>
                    <div className={classes.Heureouvertureday}>Friday {formatOpeningHours(data.opening_hours.friday)}</div>
                    <div className={classes.Heureouvertureday}>Saturday {formatOpeningHours(data.opening_hours.saturday)}</div>
                    <div className={classes.Heureouvertureday}>Sunday Closed</div>
                  </div>
                )}
              </div>
            </div>
            <div className={classes.footer}>
              {isSuccess && restoLocation && <RestoMap geocode={restoLocation} popUp={data.address} />}
            </div>
            <ReviewsButton data={data} isHome={false} />
            <div>
              <RestaurantReviews restaurantId={data.id} />
            </div>
            <div className={classes.Onclickend}></div>
          </div>
        </div>
      </>
    )
  );
}

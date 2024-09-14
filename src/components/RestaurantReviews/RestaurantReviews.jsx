import { useState, useEffect } from 'react'
import Review from './Review'
import styles from './RestaurantReviews.module.css'
import { getAllRestaurantReviews } from '../../api/Visits'

const RestaurantReviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      await getAllRestaurantReviews(restaurantId)
        .then((response) => setReviews(response))
        .catch((error) => setIsError(error))
        .finally(() => setIsLoading(false))
    }

    fetchReviews()
  }, [restaurantId])

  if (isLoading) return <p>Loading reviews...</p>

  if (isError) return <p>Error fetching reviews: {isError.message}</p>

  if (!reviews.length) return <p>No reviews found for this restaurant.</p>

  return (
    <div className={styles.reviewsContainer}>
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  )
}

export default RestaurantReviews

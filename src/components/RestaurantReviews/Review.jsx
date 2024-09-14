import styles from './Review.module.css'

const Review = ({ review }) => {
  const date = new Date(review.date)
  const formattedDate = date.toLocaleDateString()

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <p className={styles.reviewDate}>{formattedDate}</p>
        <p className={styles.reviewRating}>
          {review.rating > -1 ? '*'.repeat(review.rating) : ''}
        </p>
      </div>
      {review.comment && (
        <p className={styles.reviewComment}>{review.comment}</p>
      )}
    </div>
  )
}

export default Review

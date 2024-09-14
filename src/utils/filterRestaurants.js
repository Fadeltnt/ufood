export const sortRestaurantsByPrice =
  (asc = true) =>
  (restaurants) =>
    asc
      ? restaurants.sort((a, b) => a.price_range - b.price_range)
      : restaurants.sort((a, b) => b.price_range - a.price_range)

export const filterRestaurantsByPriceRange = (priceRanges) => (restaurants) => {
  return restaurants.filter((restaurant) =>
    priceRanges.includes(restaurant.price_range),
  )
}

export const sortRestaurantsByRating = (asc) => (restaurants) =>
  asc
    ? restaurants.sort((a, b) => a.rating - b.rating)
    : restaurants.sort((a, b) => b.rating - a.rating)

export const filterRestaurantsByRating = (rating) => (restaurants) =>
  restaurants.filter((restaurant) => restaurant.rating >= rating)

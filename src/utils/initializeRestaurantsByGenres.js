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

export const initializeRestaurantsByGenres = (restaurants) => {
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

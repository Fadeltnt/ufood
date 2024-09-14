import { useState, useEffect } from 'react'

const useCurrentLocation = (options = {}) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null })
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords
      setLocation({ latitude, longitude })
      setLocationError(null)
    }

    const handleError = (error) => {
      setLocation({ latitude: null, longitude: null }) // Clear location state
      setLocationError(error.message)
    }

    const watcher = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options,
    )
    return () => navigator.geolocation.clearWatch(watcher)
  }, [options])

  return { location, locationError }
}

export default useCurrentLocation

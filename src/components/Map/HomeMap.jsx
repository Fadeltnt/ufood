import { useEffect, useRef, useState } from 'react'
import './RestoMap.css'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import restoIcon from '../../assets/resto-icon.png'
import userIcon from '../../assets/user-icon.png'
import { Icon } from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import useCurrentLocation from '../../hooks/useCurrentLocation'
import { Link } from 'react-router-dom'

const usericon = new Icon({
  iconUrl: userIcon,
  iconSize: [38, 38],
})

const restoicon = new Icon({
  iconUrl: restoIcon,
  iconSize: [38, 38],
})

export default function HomeMap({ restaurants }) {
  const mapRef = useRef(null)

  const { location, locationError } = useCurrentLocation({
    timeout: 5000,
    maximumAge: 0,
  })

  const [userPosition, setUserPosition] = useState(null)

  useEffect(() => {
    if (
      !locationError &&
      location.latitude &&
      location.longitude &&
      !userPosition
    ) {
      setUserPosition([location.latitude, location.longitude])
    }
  }, [location, locationError, userPosition])

  useEffect(() => {
    const attribution = document.querySelector('.leaflet-control-attribution')
    if (attribution) {
      attribution.style.display = 'none'
    }
  }, [])

  useEffect(() => {
    if (!userPosition) {
      console.log('No user position')
    }
    if (userPosition) {
      console.log('User position:', userPosition)
    }
  }, [userPosition])

  return (
    <div className='h-[50dvh] w-[50dvw]'>
      <MapContainer
        center={
          userPosition
            ? userPosition.reverse()
            : restaurants.lenght > 0
              ? [...restaurants[0].location.coordinates].reverse()
              : [46.7828736, -71.3097216]
        }
        ref={mapRef}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        zoom={13}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        {restaurants.map((resto) => (
          <Marker
            key={resto.id}
            position={[...resto.location.coordinates].reverse()}
            icon={restoicon}
            eventHandlers={{
              click: () => {
                console.log('Marker clicked:', resto)
              },
            }}
          >
            <Popup
              eventHandlers={{
                click: () => {
                  console.log('Popup clicked:', resto)
                },
              }}
            >
              <ul className='mb-5'>
                <li>{resto.name}</li>
                <li>{resto.address}</li>
              </ul>
              <Link to={`/restaurant/${resto.id}`}>Voir le restaurant</Link>
            </Popup>
          </Marker>
        ))}

        {userPosition && (
          <Marker position={userPosition} icon={usericon}>
            <Popup>Votre position</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

import { useEffect, useRef, useState, useCallback } from 'react'
import './RestoMap.css'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import restoIcon from '../../assets/resto-icon.png'
import userIcon from '../../assets/user-icon.png'
import classes from '../../routes/RestoPage/RestoPage.module.css'
import { Icon, divIcon, point } from 'leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import useCurrentLocation from '../../hooks/useCurrentLocation'

const CustomButtonItineraire = ({ title, handleItineraireClick }) => {
  const map = useMap()

  useEffect(() => {
    const titleControl = L.control({ position: 'bottomleft' })

    titleControl.onAdd = function () {
      var div = L.DomUtil.create('div', 'map-itineraire')
      var button = L.DomUtil.create('button', 'itineraireButton', div)
      button.innerHTML = title

      L.DomEvent.on(button, 'click', function (e) {
        L.DomEvent.stop(e)
        handleItineraireClick()
      })

      return div
    }

    titleControl.addTo(map)

    return () => {
      titleControl.remove()
    }
  }, [map, title, handleItineraireClick])

  return null
}

const CustomToastItineraireNonDispo = ({ title }) => {
  const map = useMap()

  useEffect(() => {
    const titleControl = L.control({ position: 'bottomleft' })

    titleControl.onAdd = function () {
      var div = L.DomUtil.create('div', 'map-itineraire-non-dispo')
      div.innerHTML = `<h2>${title}</h2>`
      return div
    }

    titleControl.addTo(map)

    return () => titleControl.remove()
  }, [map, title])

  return null
}

const CustomLegend = ({ lat, long, position = 'bottomright' }) => {
  const map = useMap()

  useEffect(() => {
    const legend = L.control({ position })

    legend.onAdd = function () {
      var div = L.DomUtil.create('div', classes.Legende)
      div.innerHTML = `<div class="${classes.GeoY}">Longitude: ${long}</div>`
      div.innerHTML += `<div class="${classes.GeoX}">Latitude: ${lat}</div>`

      return div
    }

    legend.addTo(map)

    return () => legend.remove()
  }, [map, position, lat, long])

  return null
}

const CustomTitle = ({ title }) => {
  const map = useMap()

  useEffect(() => {
    const titleControl = L.control({ position: 'topleft' })

    titleControl.onAdd = function () {
      var div = L.DomUtil.create('div', 'map-title')
      div.innerHTML = `<h3>${title}</h3>`
      return div
    }

    titleControl.addTo(map)

    return () => titleControl.remove()
  }, [map, title])

  return null
}

const MapExtras = ({ geocode, popUp }) => {
  if (!geocode) return null

  return (
    <>
      <CustomTitle title={popUp} />
      <CustomLegend lat={geocode[0]} long={geocode[1]} />
    </>
  )
}

const usericon = new Icon({
  iconUrl: userIcon,
  iconSize: [38, 38],
})

const restoicon = new Icon({
  iconUrl: restoIcon,
  iconSize: [38, 38],
})

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: point(33, 33, true),
  })
}

function calculateMidpoint(coord1, coord2) {
  const midLongitude = (coord1[0] + coord2[0]) / 2
  const midLatitude = (coord1[1] + coord2[1]) / 2

  return [midLongitude, midLatitude]
}

function FitBounds({ geocode, userPosition }) {
  const map = useMap()

  useEffect(() => {
    if (userPosition && geocode) {
      const bounds = L.latLngBounds(userPosition, geocode)
      map.fitBounds(bounds, { padding: [50, 50] })
      map.zoomOut(1)
    }
  }, [map, geocode, userPosition])

  return null
}

const Routing = ({ start, end }) => {
  const map = useMap()

  useEffect(() => {
    if (!start || !end || !map) return

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4 }],
      },
      createMarker: (i, waypoint, numberOfWaypoints) => {
        if (i === 0) {
          return L.marker(waypoint.latLng, { icon: usericon })
        } else if (i === numberOfWaypoints - 1) {
          return L.marker(waypoint.latLng, { icon: restoicon })
        }
      },
    }).addTo(map)

    return () => {
      if (map && routingControl) {
        routingControl.remove(map)
      }
    }
  }, [map, start, end])

  return null
}

export default function RestoMap({ geocode, popUp }) {
  const mapRef = useRef(null)

  const { location, locationError } = useCurrentLocation({
    enableHighAccuracy: true, // Request high accuracy
    timeout: 5000, // Maximum time allowed to try obtaining a position (milliseconds)
    maximumAge: 0, // Maximum age of a cached position that's acceptable to return (milliseconds)
  })
  const [userPosition, setUserPosition] = useState(null)
  const [showItineraire, setShowItineraire] = useState(false)

  const handleItineraireClick = useCallback(() => {
    if (showItineraire) {
      console.log('Remove routing')
    } else {
      console.log('Add routing')
    }
    setShowItineraire((prev) => !prev)
  }, [showItineraire])

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
    <div className={classes.MapBackground}>
      <MapContainer
        center={
          userPosition && showItineraire
            ? calculateMidpoint(userPosition, geocode)
            : geocode
        }
        ref={mapRef}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        zoom={13}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          <Marker position={geocode} icon={restoicon}>
            <Popup>{popUp}</Popup>
          </Marker>

          {userPosition && (
            <Marker position={userPosition} icon={usericon}>
              <Popup>Votre position</Popup>
            </Marker>
          )}
          {userPosition && showItineraire && mapRef.current && (
            <Routing start={userPosition} end={geocode} />
          )}
        </MarkerClusterGroup>
        {!showItineraire && <MapExtras geocode={geocode} popUp={popUp} />}
        {userPosition && (
          <FitBounds geocode={geocode} userPosition={userPosition} />
        )}
        {userPosition && mapRef.current ? (
          <CustomButtonItineraire
            title='Itinéraire'
            handleItineraireClick={handleItineraireClick}
          />
        ) : (
          <CustomToastItineraireNonDispo title='Itinéraire non disponible, position introuvable...' />
        )}
      </MapContainer>
    </div>
  )
}

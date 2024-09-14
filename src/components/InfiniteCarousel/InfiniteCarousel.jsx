import './styles.css'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dollars, Stars } from '../Header/HomePageHeader'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import CarouselFilters from './CarouselFilters'
import { fetchRestaurants } from '../../api/Filters'
import ReviewsButton from '../ReviewsButton/ReviewsButton'
import { useNavigate } from 'react-router-dom'

const Restaurant = ({ resto }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/restaurant/${resto.id}`)
  }

  const [errorCount, setErrorCount] = useState(
    resto.pictures.length > 1 ? 1 : 0,
  )

  const handleError = () => {
    setErrorCount((prevCount) =>
      prevCount >= resto.pictures.length - 1 ? 0 : prevCount + 1,
    )
  }

  return (
    <div className='ImageWrapper'>
      <div className='Vanish'>
        <img
          alt={resto.name}
          className='VanishHeader'
          src={resto.pictures[errorCount]}
          onError={handleError}
        />
      </div>
      <div className={`OnHover`}>
        <img
          alt='img'
          className='OnHoverHeader'
          src={resto.pictures[errorCount]}
          onClick={handleClick}
          role='button'
          tabIndex='0'
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleClick()
            }
          }}
        />

        <div className='Buttons'>
          <ReviewsButton data={resto} isHome={true} />
        </div>
        <div className='OnHoverFooter'>
          <div id='Description'>
            <div className='Distance'>
              <Dollars number={parseInt(resto.price_range)} />
            </div>
            <div className='ml-3 pt-2 Distance'>
              <Stars number={parseInt(resto.rating)} />
            </div>
            <div className='Name'>{resto.name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProgressBar = ({ slideTotal, progressBarIndex }) => {
  return (
    <div className={`${'progress_bar'}`}>
      {[...Array(slideTotal)].map((_, i) => (
        <div
          key={i}
          className={`${'progress_item'} ${
            i === progressBarIndex ? 'item_active' : ''
          }`}
        ></div>
      ))}
    </div>
  )
}

const ImageSlider = ({
  restoGroup,
  itemsPerScreen,
  sliderStyle,
  isInfinite,
  index,
}) => {
  return (
    <div
      className={`ImageSlider ${!isInfinite && index === 0 ? 'hideSlider' : ''}`}
      style={sliderStyle}
    >
      {restoGroup.map((resto, index) => (
        <Restaurant key={`restaurant-${index}`} resto={resto} />
      ))}

      {itemsPerScreen - restoGroup.length !== 0 &&
        [
          ...Array(
            itemsPerScreen - restoGroup.length > 0
              ? itemsPerScreen - restoGroup.length
              : 0,
          ),
        ].map((_, index) => (
          <div key={`empty-${index}`} className='EmptyDiv'></div>
        ))}
    </div>
  )
}

const ImageSliders = ({
  restoGroups,
  itemsPerScreen,
  isInfinite,
  sliderStyle,
}) => {
  return (
    <>
      {restoGroups.map((restoGroup, index) => (
        <React.Fragment key={`group-${index}`}>
          {index === 0 && (
            <ImageSlider
              key={`first-slider-${index}`}
              restoGroup={[...restoGroups[restoGroups.length - 1]]}
              itemsPerScreen={itemsPerScreen}
              sliderStyle={sliderStyle}
              isInfinite={isInfinite}
              index={index}
            />
          )}
          <ImageSlider
            key={`image-slider-${index}`}
            restoGroup={restoGroup}
            itemsPerScreen={itemsPerScreen}
            sliderStyle={sliderStyle}
            isInfinite={isInfinite}
            index={index + 1}
          />
          {index === restoGroups.length - 1 && (
            <ImageSlider
              key={`last-slider-${index}`}
              restoGroup={[...restoGroups[0]]}
              itemsPerScreen={itemsPerScreen}
              sliderStyle={sliderStyle}
              isInfinite={isInfinite}
              index={index + 2}
            />
          )}
        </React.Fragment>
      ))}
    </>
  )
}

const LeftSideOfCarousel = ({
  handleArrowClickLeft,
  isInfinite,
  isDisabled,
  slideWidth,
}) => {
  return (
    <button
      disabled={isDisabled}
      className={`LeftSideOfCarousel ${!isInfinite ? 'hideSlider' : ''}`}
      onClick={handleArrowClickLeft}
      style={{ width: slideWidth }}
    >
      <FontAwesomeIcon icon={faAngleLeft} className='sideArrow' />
    </button>
  )
}

const RightSideOfCarousel = ({
  handleArrowClickRight,
  isDisabled,
  slideWidth,
}) => {
  return (
    <button
      disabled={isDisabled}
      className='RightSideOfCarousel'
      onClick={handleArrowClickRight}
      style={{ width: slideWidth }}
    >
      <FontAwesomeIcon icon={faAngleRight} className='sideArrow' />
    </button>
  )
}

const chunkArray = (array, chunkSize) => {
  let result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

const getSlidesWidth = (itemsPerScreen) => {
  if (itemsPerScreen === 2) return `15%`
  else if (itemsPerScreen === 3) return `10%`
  else if (itemsPerScreen === 4) return `5.15%`
  else if (itemsPerScreen === 5) return `3%`
  else if (itemsPerScreen >= 6) return `2.93%`
}

export default function InfiniteCarousel({
  genres,
  restaurants,
  itemsPerScreen,
  children,
}) {
  const [sliderIndex, setSliderIndex] = useState(1)
  const [slideWidth, setSlideWidth] = useState(`2.93%`)
  const [isInfinite, setisInfinite] = useState(false)
  const [progressBarIndex, setProgressBarIndex] = useState(0)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [error, setError] = useState(false)
  const [restos, setRestos] = useState(restaurants)
  const [filters, setFilters] = useState({
    genres: genres,
    rating: null,
    price: null,
    orderBy: null,
  })

  const [restoGroups, setRestoGroups] = useState(
    chunkArray(restos, itemsPerScreen),
  )
  const delay = 600

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRestaurants(filters)
        setRestos(response)
      } catch (error) {
        setError(true)
      }
    }
    fetchData()
    console.log(filters)
  }, [filters])

  useEffect(() => {
    setFilters((prev) => {
      return { ...prev, genres: genres }
    })
  }, [genres])

  useEffect(() => {
    setSlideWidth(getSlidesWidth(itemsPerScreen))
  }, [itemsPerScreen])

  const getPercentage = (idx) =>
    `translateX(calc(${-(idx * 100 + 0.42 * idx)}% + ${slideWidth}))`

  const [sliderStyle, setSliderStyle] = useState({
    transform: getPercentage(sliderIndex),
    transition: 'transform 0.6s ease-out',
  })

  const handleSliderStyleLeft = (prevIndex) => {
    setSliderStyle({
      transition: 'transform 0.6s ease-out',
      transform: getPercentage(prevIndex - 1),
    })
    if (prevIndex === 1) {
      setTimeout(() => {
        setSliderStyle({
          transition: 'none',
          transform: getPercentage(restoGroups.length),
        })
      }, delay)
      return restoGroups.length
    }
    return prevIndex - 1
  }

  const handleSliderStyleRight = (prevIndex) => {
    setSliderStyle({
      transition: 'transform 0.6s ease-out',
      transform: getPercentage(prevIndex + 1),
    })
    if (prevIndex === restoGroups.length) {
      setTimeout(() => {
        setSliderStyle({
          transition: 'none',
          transform: getPercentage(1),
        })
      }, delay)
      return 1
    }
    return prevIndex + 1
  }

  const handleArrowClickLeft = () => {
    setIsButtonDisabled(true)
    setSliderIndex((prevIndex) => handleSliderStyleLeft(prevIndex))
    setProgressBarIndex((prevIndex) => {
      let newIndex = prevIndex - 1
      if (newIndex < 0) newIndex = restoGroups.length - 1
      return newIndex
    })
    setTimeout(() => setIsButtonDisabled(false), delay)
  }

  const handleArrowClickRight = () => {
    setIsButtonDisabled(true)
    setSliderIndex((prevIndex) => handleSliderStyleRight(prevIndex))
    setProgressBarIndex((prevIndex) => {
      let newIndex = prevIndex + 1
      if (newIndex >= restoGroups.length) newIndex = 0
      return newIndex
    })
    if (!isInfinite) setTimeout(() => setisInfinite(true), delay)
    setTimeout(() => setIsButtonDisabled(false), delay)
  }

  useEffect(() => {
    const updatedRestaurants = chunkArray(restos, itemsPerScreen)
    setRestoGroups(updatedRestaurants)
  }, [restos, itemsPerScreen])

  if (error) {
    return <h1>Error</h1>
  }

  return (
    <div className='App'>
      <div className='CarouselContainer'>
        <div className='CarouselHeader'>
          <div className='InfoWrapper'>
            {children}
            {itemsPerScreen > 2 && (
              <CarouselFilters filters={filters} setFilters={setFilters} />
            )}
          </div>
          <ProgressBar
            slideTotal={restoGroups.length}
            progressBarIndex={progressBarIndex}
          />
        </div>
        <div className='Carousel'>
          <LeftSideOfCarousel
            isInfinite={isInfinite}
            handleArrowClickLeft={handleArrowClickLeft}
            isDisabled={isButtonDisabled}
            slideWidth={slideWidth}
          />
          <ImageSliders
            restoGroups={restoGroups}
            itemsPerScreen={itemsPerScreen}
            isInfinite={isInfinite}
            sliderStyle={sliderStyle}
          />
          <RightSideOfCarousel
            handleArrowClickRight={handleArrowClickRight}
            isDisabled={isButtonDisabled}
            slideWidth={slideWidth}
          />
        </div>
      </div>
    </div>
  )
}

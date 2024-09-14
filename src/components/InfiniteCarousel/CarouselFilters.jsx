import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Dollars, Stars } from '../Header/HomePageHeader'
import classes from './CarouselFilters.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

export const StarsFilter = ({ filters, setFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleStarsFilter = (star) => {
    if (!filters.rating) {
      setFilters({ ...filters, price: null, rating: { from: star, to: null } })
      return
    }

    const { from, to } = filters.rating

    if (from === star && to === null) {
      setFilters({ ...filters, rating: null })
      return
    }

    if (from === star && to !== null) {
      setFilters({ ...filters, rating: { from: to, to: null } })
      return
    }

    if (to === star) {
      setFilters({ ...filters, rating: { from: from, to: null } })
      return
    }

    if (star > from) {
      setFilters({ ...filters, rating: { from: from, to: star } })
      handleClose()
      return
    }

    if (star < from) {
      setFilters({ ...filters, rating: { from: star, to: from } })
      handleClose()
      return
    }
  }

  const isWithinRange = (star) => {
    if (!filters.rating) return false
    if (!filters.rating.to) return star === filters.rating.from
    return star >= filters.rating.from && star <= filters.rating.to
  }

  return (
    <>
      <div className={classes.filterType}>
        <Button
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Stars number={1} />
        </Button>
      </div>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {[...Array(5)].map((_, index) => (
          <MenuItem
            onClick={() => handleStarsFilter(index + 1)}
            key={index}
            className={isWithinRange(index + 1) ? classes.selected : ''}
          >
            <div className='FilterType'>
              <Stars number={index + 1} />
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export const PriceFilter = ({ filters, setFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePriceFilter = (price) => {
    if (!filters.price) {
      setFilters({ ...filters, rating: null, price: { from: price, to: null } })
      return
    }

    const { from, to } = filters.price

    if (from === price && to === null) {
      setFilters({ ...filters, price: null })
      return
    }

    if (from === price && to !== null) {
      setFilters({ ...filters, price: { from: to, to: null } })
      return
    }

    if (to === price) {
      setFilters({ ...filters, price: { from: from, to: null } })
      return
    }

    if (price > from) {
      setFilters({ ...filters, price: { from: from, to: price } })
      handleClose()
      return
    }

    if (price < from) {
      setFilters({ ...filters, price: { from: price, to: from } })
      handleClose()
      return
    }
  }

  const isWithinRange = (price) => {
    if (!filters.price) return false
    if (!filters.price.to) return price === filters.price.from
    return price >= filters.price.from && price <= filters.price.to
  }

  return (
    <>
      <div className={classes.filterType}>
        <Button
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Dollars number={1} />
        </Button>
      </div>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {[...Array(5)].map((_, index) => (
          <MenuItem
            onClick={() => handlePriceFilter(index + 1)}
            key={index}
            className={isWithinRange(index + 1) ? classes.selected : ''}
          >
            <div className='FilterType'>
              <Dollars number={index + 1} />
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export const OrderByFilter = ({ filters, setFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAscOrder = () => {
    setFilters({ ...filters, orderBy: 'asc' })
    handleClose()
  }

  const handleDscOrder = () => {
    setFilters({ ...filters, orderBy: 'dsc' })
    handleClose()
  }

  return (
    <>
      <div className={classes.filterType}>
        <Button
          id='basic-button'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <div className={classes.orderFilter}>
            <FontAwesomeIcon icon={faArrowUp} />
            <span>asc</span>
          </div>
        </Button>
      </div>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={handleAscOrder}
          className={`${filters.orderBy === 'asc' && classes.selected}`}
        >
          <div className={classes.orderFilter}>
            <FontAwesomeIcon icon={faArrowUp} />
            <span>asc</span>
          </div>
        </MenuItem>
        <MenuItem
          onClick={handleDscOrder}
          className={`${filters.orderBy === 'dsc' && classes.selected}`}
        >
          <div className={classes.orderFilter}>
            <FontAwesomeIcon icon={faArrowDown} />
            <span>dsc</span>
          </div>
        </MenuItem>
      </Menu>
    </>
  )
}

export function MapFilters({ filters, setFilters }) {
  return (
    <div className='flex flex-row'>
      <StarsFilter filters={filters} setFilters={setFilters} />
      <PriceFilter filters={filters} setFilters={setFilters} />
    </div>
  )
}

export default function CarouselFilters({ filters, setFilters }) {
  return (
    <div className={classes.carouselFilters}>
      <StarsFilter filters={filters} setFilters={setFilters} />
      <PriceFilter filters={filters} setFilters={setFilters} />
      <OrderByFilter filters={filters} setFilters={setFilters} />
    </div>
  )
}

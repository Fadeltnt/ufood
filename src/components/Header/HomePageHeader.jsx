import classes from './HomePageHeader.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faDollarSign } from '@fortawesome/free-solid-svg-icons'

export const Stars = ({ number }) => {
  return (
    <>
      {[...Array(number)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStar} />
      ))}
    </>
  )
}

export const Dollars = ({ number }) => {
  return (
    <>
      {[...Array(number)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={faDollarSign} />
      ))}
    </>
  )
}

const Genre = ({ genresList }) => {
  return (
    <div className={classes.genre}>
      <div className={classes.genretitle}>Genre</div>
      <div className={classes.genrefiltre}>
        {genresList.map((genre, index) => (
          <div key={index} className={classes.filtretype}>
            <div className={classes.genrePastille}>
              <span>{genre}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Price = () => {
  return (
    <div className={classes.genre}>
      <div className={classes.genretitle}>Price</div>
      <div className={classes.genrefiltre}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={classes.filtretype}>
            <Dollars number={index + 1} />
          </div>
        ))}
      </div>
    </div>
  )
}

const Rating = () => {
  return (
    <div className={classes.genre}>
      <div className={classes.genretitle}>Rating</div>
      <div className={classes.genrefiltre}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className={classes.filtretype}>
            <Stars number={index + 1} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePageHeader({ genresList }) {
  return (
    <div className={classes.container}>
      <header>
        <nav>
          <Link>Home</Link>
          <Link>Contacts</Link>
          <Link>Info</Link>
        </nav>
      </header>

      <div className={classes.carousel}>
        <div className={classes.list}>
          <div className={classes.item}>
            <img
              src='https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg'
              alt='img'
            />

            <div className={classes.content}>
              <div className={classes.author}>
                <span>UFOOD</span>
              </div>

              <div className={classes.filtrewrapper}>
                <div className={classes.title}>FILTER</div>
                <div className={classes.searchbar}></div>
                <Genre genresList={genresList} />
                <Price />
                <Rating />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

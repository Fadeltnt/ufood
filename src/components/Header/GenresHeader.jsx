import classes from './GenresHeader.module.css'

export default function GenresHeader({ isMap, setIsMap }) {
  return (
    <div className={classes.container}>
      <header />

      <div className={classes.carousel}>
        <img
          src='https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg'
          alt='img'
        />
        <div className={classes.content}>
          <div
            className={`${classes.filtrewrapper} flex justify-center items-center`}
          >
            <div className={classes.title}>UFOOD</div>
            <div role='tablist' className='tabs tabs-boxed'>
              <button
                role='tab'
                className={`tab ${!isMap && 'tab-active'}`}
                onClick={() => setIsMap(false)}
              >
                List
              </button>
              <button
                role='tab'
                className={`tab ${isMap && 'tab-active'}`}
                onClick={() => setIsMap(true)}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

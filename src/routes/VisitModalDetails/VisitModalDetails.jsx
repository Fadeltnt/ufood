import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GalleryItem } from '../../components/RestaurantVisited/GalleryItem.jsx'
import styles from './VisitModalDetails.module.css'
import { useGlobalState } from '../../GlobalState/GlobalStateContext.js'
import { getVisitModal } from '../../api/Visits.js'

export const VisitModalDetails = () => {
  const { idRestaurant, name } = useParams()
  const [modalOfVisit, setModalOfVisit] = useState(null)
  const { globalState } = useGlobalState()

  useEffect(() => {
    const fetchModalOfVisit = async () =>
      await getVisitModal(idRestaurant, globalState.userId).then((result) =>
        setModalOfVisit(result),
      )
    if (!globalState.userId) return
    fetchModalOfVisit()
  }, [globalState.userId, idRestaurant])

  if (!modalOfVisit) {
    return <div>loading ...</div>
  }

  return (
    <div>
      <div className={styles.restoName}>{name}</div>
      {modalOfVisit.items.map((modal, index) => (
        <div key={index} className={styles.visits}>
          <p>Comment : {modal.comment}</p>
          <p>Notes : {modal.rating}</p>
          <p>Date : {modal.date}</p>
        </div>
      ))}
    </div>
  )
}

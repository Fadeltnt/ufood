import './ReviewsButton.css'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'
import { useNavigate } from 'react-router-dom'
import VisitModalPopUp from '../VisitModal/VisitModalPopUp'

export default function ReviewsButton({ data, isHome }) {
  const { globalState } = useGlobalState()
  const navigate = useNavigate()
  const handleModalOpen = () => {
    if (!globalState.isLogged) {
      navigate('/login')
      return
    }
    const dialog = document.getElementById(`visit-modal-${data.id}`)
    dialog.open ? dialog.close() : dialog.showModal()
  }
  return (
    <div>
      <div className={`${isHome && 'reviewContainer'}`}>
        <div className={`review-button ${isHome && 'home'}`}>
          <button
            type='button'
            className='btn btn-primary btn-lg'
            onClick={handleModalOpen}
          >
            Review
          </button>
        </div>
      </div>
      <VisitModalPopUp
        restaurant_id={data.id}
        handleModalOpen={handleModalOpen}
        name={data.name}
      />
    </div>
  )
}

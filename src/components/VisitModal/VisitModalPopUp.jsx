import './VisitModal.css'

import { useMutation } from '@tanstack/react-query'
import { createRestaurantVisit } from '../../api/Visits'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'

export default function VisitModalPopUp({
  restaurant_id,
  handleModalOpen,
  name,
}) {
  const { globalState } = useGlobalState()
  const { mutate, isLoading, isError, data, error } = useMutation({
    mutationFn: createRestaurantVisit,
    onSuccess: () => {
      handleModalOpen()
      alert('Visit Created successfully!')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const enteredDate = new Date(e.target.date.value)
    const currentDate = new Date()
    if (enteredDate > currentDate) {
      alert('Please enter a date that is not in the future.')
      return // Prevent form submission if date is invalid
    }

    const formData = {
      restaurant_id: restaurant_id,
      comment: e.target.comment.value,
      rating: parseInt(e.target.rating.value, 10),
      date: e.target.date.value,
    }

    mutate({ userId: globalState.userId, visitData: formData })
    e.target.reset()
  }

  if (isLoading) return <div>Submitting...</div>
  if (isError) return <div>An error occurred: {error.message}</div>

  return (
    <DialogModal restaurant_id={restaurant_id} restaurant_name={name}>
      <form onSubmit={handleSubmit} className=''>
        <div className='mt-6'>
          <label htmlFor='date'>
            Date de visite:
            <input
              className='bg-black'
              type='datetime-local'
              name='date'
              id='date'
              required
            ></input>
          </label>
        </div>
        <div className='coteresto mt-6'>
          <label htmlFor='rating'>
            Rating:
            <input
              className='bg-black'
              type='number'
              name='rating'
              min='1'
              max='5'
              id='rating'
              required
            />
            / 5
          </label>
        </div>
        <div className='commentaire mt-6'>
          <label htmlFor='comment'>
            Commentaire:
            <textarea
              className='commentbox bg-black'
              name='comment'
              id='comment'
              required
            ></textarea>
          </label>
        </div>
        <button type='submit' className='btn btn-info modal-action'>
          Submit
        </button>
        {data && <div>Visit Created successfully!</div>}
      </form>
    </DialogModal>
  )
}

const DialogModal = ({ children, restaurant_id, restaurant_name }) => {
  return (
    <dialog id={`visit-modal-${restaurant_id}`} className='modal'>
      <div className='modal-box bg-[#18191a]'>
        <div className='flex flex-row justify-between'>
          <h3 className='font-bold text-lg'>{restaurant_name}</h3>
          <div>
            <form method='dialog'>
              <button className='btn btn-error'>Close</button>
            </form>
          </div>
        </div>
        {children}
      </div>
    </dialog>
  )
}

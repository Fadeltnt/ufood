import './VisitModal.css'

import { useMutation } from '@tanstack/react-query'
import { createRestaurantVisit } from '../../api/Visits'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'

export default function VisitModal({
  restaurant_id,
  handleModalOpen,
  isModalOpen,
  isHome,
}) {
  const { globalState } = useGlobalState()
  const { mutate, isLoading, isError, data, error } = useMutation({
    mutationFn: createRestaurantVisit,
    onSuccess: handleModalOpen,
  })

  const handleSubmit = (e) => {
    e.preventDefault()

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
    <div className={`page ${!isModalOpen && 'hidden'} ${isHome && 'home'}`}>
      <form onSubmit={handleSubmit} className='modalcontainer'>
        <div className='flex items-end justify-end w-[100%]'>
          <button
            type='button'
            className='p-2 bg-red-500 text-white rounded-full'
            onClick={handleModalOpen}
            aria-label='Close'
          >
            {' '}
            X{' '}
          </button>
        </div>
        <div className='datevisite'>
          <label htmlFor='date'>
            Date de visite:
            <input type='datetime-local' name='date' id='date' required></input>
          </label>
        </div>
        <div className='coteresto'>
          <label htmlFor='rating'>
            Rating:
            <input
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
        <div className='commentaire'>
          <label htmlFor='comment'>
            Commentaire:
            <textarea
              className='commentbox'
              name='comment'
              id='comment'
              required
            ></textarea>
          </label>
        </div>
        <button type='submit'>Submit</button>
        {data && <div>Visit Created successfully!</div>}
      </form>
    </div>
  )
}

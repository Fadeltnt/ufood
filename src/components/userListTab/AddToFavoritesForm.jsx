import { useState } from 'react'
import { addListToFavorite } from '../../api/User'
import styled from 'styled-components'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'

// Styled input avec le style spécifié
const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 100%;
`

// Styled submit button avec le style spécifié
const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`
function AddToFavoritesForm({ onSuccess }) {
  const [name, setName] = useState('')
  const { globalState } = useGlobalState()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!globalState.email) {
      alert('User email is not available.')
      return
    }

    const payload = {
      name: name,
      owner: globalState.email,
    }

    await addListToFavorite(payload)
      .then(() => {
        alert('Favorite added successfully!')
        onSuccess()
        setName('')
      })
      .catch((error) => {
        console.error('Error adding favorite:', error)
        alert('Failed to add favorite.')
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='name'>Name:</label>
        {/* Utilisation du composant StyledInput pour l'input */}
        <StyledInput
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          type='text'
          required
        />
      </div>
      {/* Utilisation du composant SubmitButton pour le bouton */}
      <SubmitButton type='submit'>Add to Favorites</SubmitButton>
    </form>
  )
}

export default AddToFavoritesForm

import { useState } from 'react'
import styled from 'styled-components'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'
import { modifyFavoriteListName } from '../../api/User'

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 100%;
`

const Button = styled.button`
  padding: 10px 20px;
  background-color: blue;
  border: 2px solid blue;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darkblue;
    color: white;
  }
`

function ModifyName({ listId, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const { globalState } = useGlobalState()

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: newName,
      owner: globalState.email,
    }

    await modifyFavoriteListName(payload, listId)
      .then(() => {
        alert('Nom de la liste modifié avec succès!')
        onSuccess()
        setIsEditing(false)
        setNewName('')
        window.location.reload()
      })
      .catch((error) => {
        console.error(
          'Erreur lors de la modification du nom de la liste:',
          error,
        )
        alert('La modification a échoué.')
      })
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <StyledInput
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder='New list name'
          required
        />
        <Button type='submit'>Confirm</Button>
      </form>
    )
  } else {
    return <Button onClick={handleEdit}>Change name</Button>
  }
}

export default ModifyName

import { useEffect, useState } from 'react'
import './UserPage.module.css'
import styled from 'styled-components'
import { getFavoritesListsOfUser } from '../../api/User'
import { Profile } from '../../components/profile/Profile.jsx'
import { Tabs } from '../../components/userListTab/UserListTab.jsx'
import { Gallery } from '../../components/RestaurantVisited/RestaurantPictures.jsx'
import AddToFavoritesForm from '../../components/userListTab/AddToFavoritesForm.jsx'
import ModifyName from '../../components/FavoritsButtons/ModifyName.jsx'
import NavigationBar from '../../components/NavigationBar/NavigationBar.jsx'
import { useGlobalState } from '../../GlobalState/GlobalStateContext.js'
import { useNavigate } from 'react-router-dom'

const AddListButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
    
`

// Styled component for the select container
const SelectContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 20px;
    background-color: ${({ theme }) => (theme === 'light' ? '#ffffff' : '#333333')};
    color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
    border: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#555')};
`

// Styled component for the select element
const StyledSelect = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
    background-color: ${({ theme }) => (theme === 'light' ? '#ffffff' : '#333333')};
    color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
    border: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#555')};
    


`

// Styled component for each option in the select
const StyledOption = styled.option`
  padding: 10px;
  cursor: pointer;
    background-color: ${({ theme }) => (theme === 'light' ? '#ffffff' : '#333333')};
    color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
    border: 1px solid ${({ theme }) => (theme === 'light' ? '#ccc' : '#555')};
`

const Main = styled.main`

    padding: 90px 20px 0px 20px;
    min-height: 100vh;
    max-width: 935px;
    margin: 0 auto;
  @media only screen and (max-width: 735px) {
    padding: 80px 0px;
    

  }
`

export default function UserPage() {
  const [favoriteLists, setFavoriteLists] = useState([])
  const [selectedFavoriteListId, setSelectedFavoriteListId] =
    useState('visited')
  const [showForm, setShowForm] = useState(false)
  const { globalState } = useGlobalState()
  const navigate = useNavigate()
  const theme = globalState.mode; // 'light' ou 'dark'

  useEffect(() => {
    if (!globalState.isLogged) {
      navigate('/login')
    }
    const fetchFavoritesLists = async () =>
      setFavoriteLists([...(await getFavoritesListsOfUser(globalState.userId))])
    fetchFavoritesLists()
  }, [globalState.userId, globalState.isLogged, navigate])

  const addToFavoritesSuccess = async () => {
    setFavoriteLists([...(await getFavoritesListsOfUser(globalState.userId))])
    setShowForm(false)
  }

  return (
    <div>
      <NavigationBar />
      <Main>
        <Profile userId={globalState.userId} />
        {/* Utilisation du bouton stylisé */}
        <AddListButton onClick={() => setShowForm(!showForm)}>
          Add List
        </AddListButton>
        {/* Affichage du formulaire si showForm est vrai */}
        {showForm && <AddToFavoritesForm onSuccess={addToFavoritesSuccess} />}
        <SelectContainer>
          <StyledSelect
            value={selectedFavoriteListId}
            onChange={(e) => setSelectedFavoriteListId(e.target.value)}
          >
            <StyledOption value='visited'>Visited</StyledOption>
            {favoriteLists.map((list) => (
              <StyledOption key={list.id} value={list.id}>
                {list.name}
              </StyledOption>
            ))}
          </StyledSelect>
        </SelectContainer>

        <Gallery
          favoriteListId={selectedFavoriteListId}
          userId={globalState.userId}
        />
      </Main>
    </div>
  )
}

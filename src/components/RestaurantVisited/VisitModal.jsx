import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getVisitModal } from '../../api/Visits'
import { Link } from 'react-router-dom'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`
const ModalContent = styled.div`
  background-color: black;
  padding: 20px;
  z-index: 1000;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  font-family: 'Poppins', sans-serif;
  line-height: 2;
`

const ModalContente = styled.div`
  background-color: black;
  padding: 20px;
  z-index: 1000;
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`

const buttonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 20px',
  cursor: 'pointer',
  marginTop: '5%',
}

export const VisitModal = ({ idRestaurant, name, isOpen, onClose }) => {
  const [modalOfVisit, setModalOfVisit] = useState(null)
  const { globalState } = useGlobalState()

  useEffect(() => {
    const fetchModalOfVisit = async () =>
      await getVisitModal(idRestaurant, globalState.userId).then((result) => {
        console.log(result)
        setModalOfVisit(result)
      })
    if (globalState.userId) fetchModalOfVisit()
  }, [globalState.userId, idRestaurant])

  if (!isOpen) return null

  if (!modalOfVisit) {
    return <div>Loading...</div>
  }
  if (modalOfVisit.empty) {
    return null
  }

  const handleOnClick = (idRestaurant, name) => {
    const url = `/VisitModalDetails/${idRestaurant}/${name}`
    window.location.href = url
  }

  return (
    <ModalOverlay onClick={onClose}>
      {modalOfVisit.items.total !== 0 ? (
        <ModalContent>
          <h2>VISIT DETAILS</h2>
          <p>Name of Restaurant: {name}</p>
          <p>Date: {modalOfVisit.items[0].date}</p>
          <p>Notes: {modalOfVisit.items[0].rating}</p>
          <p>Comment: {modalOfVisit.items[0].comment}</p>
          <p>Number of visits: {modalOfVisit.total}</p>
          <button
            style={buttonStyle}
            onClick={() => handleOnClick(idRestaurant, name)}
          >
            Plus de détails
          </button>
          <CloseButton onClick={onClose}>close</CloseButton>
        </ModalContent>
      ) : (
        <ModalContent>No visits</ModalContent>
      )}
    </ModalOverlay>
  )
}

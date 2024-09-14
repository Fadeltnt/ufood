import {VisitModal} from './VisitModal.jsx'
import styled from 'styled-components'
import { useState } from 'react'

const Wrap = styled.div`
    position: relative;
`;
const Img = styled.img`
  width: 100%;
  display: block;
`;



export function GalleryItem({ imagePath, idRestaurant, name}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false );
  };

  const link = `/restaurant/${idRestaurant}`;
  return (
    <div>
      <Wrap>
        <a href={link}>
          <Img alt="gallery-post" src={imagePath} />
        </a>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>{name}</div>
          <div onClick={handleModalOpen} style={{ cursor: 'pointer' }}>details</div>
        </div>
        {isModalOpen && (
          <VisitModal idRestaurant={idRestaurant} name={name} isOpen={isModalOpen} onClose={handleModalClose} />)}
      </Wrap>
    </div>

  );
}

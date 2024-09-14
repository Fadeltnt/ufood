import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import md5 from 'md5';

const ProfileDetailLi = styled.li`
    font-size: 16px;
    font-weight: 400;
    margin-right: 40px;
    list-style-type: none;
    @media only screen and (max-width: 735px) {
        font-size: 14px;
        font-weight: 400;
        color: rgb(142, 142, 142);
        line-height: 18px;
        text-align: center;
        margin-right: 0;
    }
`;

const ProfileDetailSpan = styled.span`
    font-weight: 600;
    @media only screen and (max-width: 735px) {
        font-weight: 600;
        color: var(--ins-content-primary);
        display: block;
    }
`;

const FollowerLinkItem = styled.li`
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    align-items: center;

    &:last-child {
        border-bottom: none;
    }

    @media only screen and (max-width: 735px) {
        padding-bottom: 8px;
        margin-bottom: 8px;
    }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;
const Modal = styled.dialog`
 
  background-color: transparent; // Couleur de fond fixe
  color: #000000; // Couleur du texte fixe
  
`;

const ModalBox = styled.div`
    background-color: #18191a;
    color: white;
 
`;

const CloseButton = styled.button`
  color: #000000; // Couleur du texte fixe
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
`;

function Followers({ userInfo }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ProfileDetailLi key={location.pathname}>
      <button onClick={() => document.getElementById('followerModal').showModal()}>
        <ProfileDetailSpan>{userInfo.followers.length || 0}</ProfileDetailSpan> followers
      </button>
      <Modal id='followerModal' className='modal'>
        <ModalBox className='modal-box'>
          <h3 className='font-bold text-lg mb-10'>Followers - {userInfo.followers.length || 0}</h3>
          <ul>
            {userInfo.followers.map((follower) => (
              <FollowerLinkItem key={follower.id} onClick={() => navigate(`/user/${follower.id}`)}>
                <UserAvatar src={`https://www.gravatar.com/avatar/${md5(follower.email)}?d=identicon`} alt={follower.name} />
                <span>{`@${follower.name}`}</span>
              </FollowerLinkItem>
            ))}
          </ul>
        </ModalBox>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </Modal>
    </ProfileDetailLi>
  );
}

function Followings({ userInfo }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ProfileDetailLi key={location.pathname}>
      <button onClick={() => document.getElementById('followingModal').showModal()}>
        <ProfileDetailSpan>{userInfo.following.length || 0}</ProfileDetailSpan> following
      </button>
      <Modal id='followingModal' className='modal'>
        <ModalBox className='modal-box'>
          <h3 className='font-bold text-lg mb-10'>Following - {userInfo.following.length || 0}</h3>
          <ul>
            {userInfo.following.map((following) => (
              <FollowerLinkItem key={following.id} onClick={() => navigate(`/user/${following.id}`)}>
                <UserAvatar src={`https://www.gravatar.com/avatar/${md5(following.email)}?d=identicon`} alt={following.name} />
                <span>{`@${following.name}`}</span>
              </FollowerLinkItem>
            ))}
          </ul>
        </ModalBox>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </Modal>
    </ProfileDetailLi>
  );
}

export { Followers, Followings };

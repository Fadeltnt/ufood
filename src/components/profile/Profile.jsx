import { useEffect, useState } from 'react';
import md5 from 'md5';
import styled from 'styled-components';
import { KeyNumbers } from '../userKey/userKey.jsx';
import { getUserInformation } from '../../api/User.js';
import { CgProfile } from 'react-icons/cg';
import { Gallery } from '../RestaurantVisited/RestaurantPictures.jsx';
import { useGlobalState } from '../../GlobalState/GlobalStateContext.js';

const Header = styled.header`
    margin-bottom: 44px;
    background: var(--ins-background-primary);
    color: var(--ins-content-primary);
    @media only screen and (max-width: 735px) {
        display: block;
        margin-bottom: 0px;
    }
`;
const HeaderWrap = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    column-gap: 30px;
    
    @media only screen and (max-width: 735px) {
        display: flex;
        padding: 14px;
        column-gap: 0px;
    }
`;
const ProfilePic = styled.div`
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    @media only screen and (max-width: 735px) {
        width: 77px;
        height: 77px;
        margin-right: 28px;
    }
`;
const ProfileImg = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 1000px;
    border: 1px solid var(--ins-border-primary);
    @media only screen and (max-width: 735px) {
        width: 100%;
        height: 100%;
    }
`;
const ProfileH2 = styled.h2`
    font-size: 28px;
    font-weight: 300;
 
    @media only screen and (max-width: 735px) {
        display: inline-block;
        margin-bottom: 12px;
    }
`;
const ProfileIcon = styled.span`
    margin-left: 8px;
    @media only screen and (max-width: 735px) {
        display: inline-block;
    }
`;
const ProfileTitle = styled.div`
    display: flex;
    align-items: center;
    @media only screen and (max-width: 735px) {
        display: block;
    }
`;
const ProfileRow = styled.div`
    margin-bottom: 20px;
    
`;
const Verified = styled.span`
    display: inline-block;
    background-image: url('/images/icons.png');
    background-position: -194px -351px;
    background-size: 440px 411px;
    width: 18px;
    height: 18px;
    
`;
const ProfileDetailUl = styled.ul`
    display: flex;
    @media only screen and (max-width: 735px) {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        padding: 12px 0;
        border-top: 1px solid var(--ins-border-primary);
    }
`;

export function Profile({ userId }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchUserInfo = async () => {
      if (userId) {
        const userData = await getUserInformation(userId);
        setUserInfo(userData);
      }
    };
    fetchUserInfo();
  }, [userId]);

  // Utilisez md5 pour hasher l'email et générer l'URL Gravatar
  const gravatarUrl = userInfo ? `https://www.gravatar.com/avatar/${md5(userInfo.email)}?d=identicon` : '';

  return (
    <Header>
      <HeaderWrap>
        <ProfilePic>
          {userInfo ? <ProfileImg src={gravatarUrl} alt="User Avatar" /> : <CgProfile size={150} />}
        </ProfilePic>
        <div>
          <ProfileRow>
            <ProfileTitle>
              <ProfileH2>{userInfo && userInfo.name}</ProfileH2>
              <ProfileIcon>
                <Verified />
              </ProfileIcon>
            </ProfileTitle>
          </ProfileRow>
          <KeyNumbers userInfo={userInfo} />
        </div>
      </HeaderWrap>
    </Header>
  );
}

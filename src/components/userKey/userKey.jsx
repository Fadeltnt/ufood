import styled from 'styled-components'
import { Followers, Followings } from './UserStats'

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
`
const ProfileDetailSpan = styled.span`
  font-weight: 600;
  @media only screen and (max-width: 735px) {
    font-weight: 600;
    color: var(--ins-content-primary);
    display: block;
  }
`
const ProfileDetailUl = styled.ul`
  display: flex;
  @media only screen and (max-width: 735px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 12px 0;
    border-top: 1px solid var(--ins-border-primary);
  }
`

export const KeyNumbers = ({ userInfo }) => {
  if (!userInfo) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <ProfileDetailUl>
        <KeyNumber label='score' number={userInfo.rating || 0} />
        <Followers userInfo={userInfo} />
        <Followings userInfo={userInfo} />
      </ProfileDetailUl>
    </div>
  )
}

function KeyNumber({ label, number }) {
  return (
    <ProfileDetailLi>
      <ProfileDetailSpan>{number}</ProfileDetailSpan> {label}
    </ProfileDetailLi>
  )
}

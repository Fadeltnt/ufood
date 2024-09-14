import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalState } from '../../GlobalState/GlobalStateContext'
import { followUser, unfollowUser } from '../../api/User'
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

const checkIfUserIsFollowed = (userInfo, userId) => {
  if (!userId) return false
  console.log(userInfo)
  return userInfo.followers?.some((follower) => follower.id === userId)
}

export const KeyNumbers = ({ userInfo, setUserInfo }) => {
  const { globalState } = useGlobalState()
  const [isFollowed, setIsFollowed] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  useEffect(() => {
    if (!userInfo) return
    setIsFollowed(checkIfUserIsFollowed(userInfo, globalState.userId))
  }, [userInfo, globalState.userId])

  const handleFollow = async () => {
    setIsFollowLoading(true)
    await followUser(userInfo.id)
      .then((res) => {
        setUserInfo((prev) => ({
          ...prev,
          followers: [res, ...prev.followers],
        }))
        setIsFollowed(true)
      })
      .catch((err) => {
        console.log(err)
      })
    setIsFollowLoading(false)
  }

  const handleUnfollow = async () => {
    setIsFollowLoading(true)
    await unfollowUser(userInfo.id)
      .then((res) => {
        setUserInfo((prev) => ({
          ...prev,
          followers: prev.followers.filter(
            (follower) => follower.id !== res.id,
          ),
        }))
        setIsFollowed(false)
      })
      .catch((err) => {
        console.log(err)
      })
    setIsFollowLoading(false)
  }

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
      {isFollowed ? (
        <button
          onClick={handleUnfollow}
          className={`mt-6 btn btn-outline btn-error ${isFollowLoading ? 'disabled' : ''}`}
        >
          {isFollowLoading ? (
            <span className='loading loading-spinner loading-md'></span>
          ) : (
            'Unfollow'
          )}
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className={`mt-6 btn btn-outline btn-info ${isFollowLoading ? 'disabled' : ''}`}
        >
          {isFollowLoading ? (
            <span className='loading loading-spinner loading-md'></span>
          ) : (
            'Follow'
          )}
        </button>
      )}
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

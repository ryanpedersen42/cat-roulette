import { SET_ETH_ADDRESS, LOG_IN, LOG_OUT, SET_USER_PROFILE, SET_BOX, SET_DAPP, SET_USER_POSTS } from '../constants';

export const setEthAddress = ethAddress => ({
  type: SET_ETH_ADDRESS,
  payload: ethAddress
})

export const logUserIn = () => ({
  type: LOG_IN,
})

export const logUserOut = () => ({
  type: LOG_OUT,
})

export const setUserProfile = userProfile => ({
  type: SET_USER_PROFILE,
  payload: userProfile
})

export const setUserPosts = userPosts => ({
  type: SET_USER_POSTS,
  payload: userPosts
})

export const setBox = box => ({
  type: SET_BOX,
  payload: box
})

export const setDappSpace = dapp => ({
  type: SET_DAPP,
  payload: dapp
})

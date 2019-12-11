import { SET_ETH_ADDRESS, LOG_IN, LOG_OUT, SET_USER_PROFILE } from '../constants';

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
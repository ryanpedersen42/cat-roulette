import { SET_ETH_ADDRESS, LOG_IN, LOG_OUT } from '../constants';

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
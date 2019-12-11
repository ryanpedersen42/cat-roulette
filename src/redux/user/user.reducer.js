import { SET_ETH_ADDRESS, LOG_IN, LOG_OUT, SET_USER_PROFILE } from '../constants';

const INITIAL_STATE = {
  ethAddress: '',
  isAuth: false,
  userProfile: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ETH_ADDRESS: 
      return {
        ...state,
        ethAddress: action.payload
      }
      case LOG_IN: 
        return {
          ...state,
          isAuth: true
        }
      case LOG_OUT:
        return {
          ...state,
          isAuth: false,
          ethAddress: '',
          userProfile: null,
        }
      case SET_USER_PROFILE: 
        return {
          ...state,
          userProfile: action.payload
        }
    default:
      return state;
  }
};

export default userReducer;
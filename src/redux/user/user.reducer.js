import { SET_ETH_ADDRESS, LOG_IN, LOG_OUT, SET_USER_PROFILE, SET_BOX, SET_DAPP, SET_USER_POSTS } from '../constants';

const INITIAL_STATE = {
  ethAddress: '',
  isAuth: false,
  userProfile: null,
  box: null,
  dappSpace: '',
  userPosts: [],
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
      case SET_BOX: 
        return {
          ...state,
          box: action.payload
        }
      case SET_DAPP: 
        return {
          ...state,
          dappSpace: action.payload
        }
      case SET_USER_PROFILE: 
        return {
          ...state,
          userProfile: action.payload
        }
      case SET_USER_POSTS: 
        return {
          ...state,
          userPosts: action.payload
      }
    default:
      return state;
  }
};

export default userReducer;
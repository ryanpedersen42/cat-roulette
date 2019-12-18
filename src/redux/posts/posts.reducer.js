import { SET_IPFS_POSTS, SET_CURRENT_RESULT } from '../constants';

const INITIAL_STATE = {
  currentResult: {},
  ipfsPosts: [],
};

const postsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
      case SET_CURRENT_RESULT:
        return {
          ...state,
          currentResult: action.payload
      };
      case SET_IPFS_POSTS:
        return {
          ...state,
          ipfsPosts: action.payload
        };
    default:
      return state;
  }
};

export default postsReducer;
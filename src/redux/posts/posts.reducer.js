import { SET_PET_HASH } from '../constants';

const INITIAL_STATE = {
  currentPetHash: null
};

const postsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_PET_HASH:
      return {
        ...state,
        currentPetHash: action.payload
      };
    default:
      return state;
  }
};

export default postsReducer;
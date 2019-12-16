import { TOGGLE_DROPDOWN, TOGGLE_ADD_IMAGE, START_LOADING_SCREEN, END_LOADING_SCREEN } from '../constants';

const INITIAL_STATE = {
  dropdownOpen: false,
  addImageOpen: false,
  isLoading: false,
};

const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_DROPDOWN: 
      return {
        ...state,
        dropdownOpen: !state.dropdownOpen
      }
      case TOGGLE_ADD_IMAGE: 
      return {
        ...state,
        addImageOpen: !state.addImageOpen
      }
      case START_LOADING_SCREEN: 
      return {
        ...state,
        isLoading: true
      }
      case END_LOADING_SCREEN: 
      return {
        ...state,
        isLoading: false
      }
    default:
      return state;
  }
};

export default uiReducer;
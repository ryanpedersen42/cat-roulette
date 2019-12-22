import { TOGGLE_DROPDOWN, TOGGLE_ADD_IMAGE, START_LOADING_SCREEN, END_LOADING_SCREEN, RESET_STATE } from '../constants';

export const toggleDropdown = () => ({
  type: TOGGLE_DROPDOWN,
})

export const toggleAddImage = () => ({
  type: TOGGLE_ADD_IMAGE,
})

export const startLoading = () => ({
  type: START_LOADING_SCREEN
})

export const endLoading = () => ({
  type: END_LOADING_SCREEN
})

export const resetState = () => ({
  type: RESET_STATE
})
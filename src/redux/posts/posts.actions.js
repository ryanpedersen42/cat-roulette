import { SET_PET_HASH } from '../constants';

export const setCurrentPetHash = petHash => ({
  type: SET_PET_HASH,
  payload: petHash
});
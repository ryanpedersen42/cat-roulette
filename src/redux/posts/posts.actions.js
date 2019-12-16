import { SET_PET_HASH, SET_CURRENT_RESULT, SET_IPFS_POSTS } from '../constants';

export const setCurrentPetHash = petHash => ({
  type: SET_PET_HASH,
  payload: petHash
});

export const setCurrentResult = currentResult => ({
  type: SET_CURRENT_RESULT,
  payload: currentResult
});

export const setCurrentIPFS = ipfsPosts => ({
  type: SET_IPFS_POSTS,
  payload: ipfsPosts
});
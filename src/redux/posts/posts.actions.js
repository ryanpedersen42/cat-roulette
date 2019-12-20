import { SET_CONTRACT, SET_CURRENT_RESULT, SET_IPFS_POSTS } from '../constants';

export const setContract = contract => ({
  type: SET_CONTRACT,
  payload: contract
});

export const setCurrentResult = currentResult => ({
  type: SET_CURRENT_RESULT,
  payload: currentResult
});

export const setCurrentIPFS = ipfsPosts => ({
  type: SET_IPFS_POSTS,
  payload: ipfsPosts
});
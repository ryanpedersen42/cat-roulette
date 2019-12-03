import { createSelector } from 'reselect';

const selectPetHash = state => state.petHash;

export const selectCurrentPetHash = createSelector(
  [selectPetHash],
  (petHash) => petHash.currentPetHash
);
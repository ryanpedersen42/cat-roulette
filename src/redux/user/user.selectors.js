import { createSelector } from 'reselect';

const selectUserData = state => state.user;

export const selectCurrentUserData = createSelector(
  [selectUserData],
  (user) => user
);
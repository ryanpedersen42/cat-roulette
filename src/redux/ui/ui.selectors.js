import { createSelector } from 'reselect';

const selectUI = state => state.ui;

export const selectCurrentUI = createSelector(
  [selectUI],
  (ui) => ui
);
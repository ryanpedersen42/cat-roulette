
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import postsReducer from './posts/posts.reducer';
import uiReducer from './ui/ui.reducer';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  petHash: postsReducer,
  ui: uiReducer,
  posts: postsReducer
});

export default persistReducer(persistConfig, rootReducer);
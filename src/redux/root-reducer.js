
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import postsReducer from './posts/posts.reducer';

// import cartReducer from './cart/cart.reducer';
// import shopReducer from './shop/shop.reducer';
// import directoryReducer from './directory/directory.reducer';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  petHash: postsReducer,
});

export default persistReducer(persistConfig, rootReducer);
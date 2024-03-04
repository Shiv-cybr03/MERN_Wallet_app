// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice.js';

const store = configureStore({
  reducer: {
    users: usersReducer,
    // Add other reducers if necessary
  },
});

export default store;

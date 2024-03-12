import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
  },
  reducers: {
    setUser(state, action){
      state.user = action.payload;
    },
    ReloadUser(state, action){
      state.reloadUser = action.payload;
    }
  },
});

export const { setUser, ReloadUser } = usersSlice.actions;
export default usersSlice.reducer;

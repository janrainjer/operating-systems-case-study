import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/User";
import { RootState } from "../store"

// Type for our state
interface UserState {
  user : IUser | null;
}

// Initial state
const initialState: UserState = {
  user : null
};

// Actual Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the authentication status
    setUser(state, action) {
      state.user = action.payload;
    },
    deleteUser(state){
        state.user = null
    }
  },
});

export const { setUser,deleteUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
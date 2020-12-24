import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { uid: "", photoUrl: "", displayName: "", emailVerified: false },
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    setEmailVerified: (state, action) => {
      state.user.emailVerified = action.payload.emailVerified;
    },
    logout: (state) => {
      state.user = {
        uid: "",
        photoUrl: "",
        displayName: "",
        emailVerified: false,
      };
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
      state.user.emailVerified = false;
    },
  },
});
export const {
  login,
  logout,
  updateUserProfile,
  setEmailVerified,
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;

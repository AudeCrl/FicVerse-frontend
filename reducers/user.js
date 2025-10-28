import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { example },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    example: (state, action) => {
      state.value.example = action.payload;
    },
  },
});

export const { example } = userSlice.actions;
export default userSlice.reducer;

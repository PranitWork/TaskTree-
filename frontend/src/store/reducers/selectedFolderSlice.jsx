// src/store/reducers/selectedFolderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
};

const selectedFolderSlice = createSlice({
  name: "selectedFolder",
  initialState,
  reducers: {
    selectedFolderId: (state, action) => {
      state.id = action.payload; 
    },
  },
});

export const { selectedFolderId } = selectedFolderSlice.actions;
export default selectedFolderSlice.reducer;

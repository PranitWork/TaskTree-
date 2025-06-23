// src/store/reducers/selectedTaskSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState =({
id: null ,
name:""
})

const selectedTaskSlice = createSlice({
  name: "selectedTask",
  initialState,       
  reducers: {
    setSelectedTaskId: (state, action) => {
      state.id = action.payload;      
      state.name = action.payload;
    },
   
  },
});

export const { setSelectedTaskId } = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
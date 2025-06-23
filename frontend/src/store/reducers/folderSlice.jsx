
import {createSlice} from "@reduxjs/toolkit"


const initialState ={
  folders:[],
};

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers:{
    loadfolder : (state, action)=>{
      state.folders = action.payload;
    },
  },
});

export default folderSlice.reducer;

export const {loadfolder}= folderSlice.actions;
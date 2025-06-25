
import {createSlice} from "@reduxjs/toolkit"


const initialState ={
  users:[],
};

const todoSlicer = createSlice({
  name: "users",
  initialState,
  reducers:{
    loadusers : (state, action)=>{
      state.users = action.payload;
    },
    logoutuser: (state,action)=>{
      state.users =null;
    },
  },
});

export default todoSlicer.reducer;

export const {loadusers, logoutuser}= todoSlicer.actions;
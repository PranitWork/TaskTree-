
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
  },
});

export default todoSlicer.reducer;

export const {loadusers}= todoSlicer.actions;

import {createSlice} from "@reduxjs/toolkit"


const initialState ={
  todos:[],
};

const todoSlicer = createSlice({
  name: "todos",
  initialState,
  reducers:{
    loadtodo : (state, action)=>{
      state.todos = action.payload;
    },
  },
});

export default todoSlicer.reducer;

export const {loadtodo}= todoSlicer.actions;
import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    tasks:[],
};


const taskSlide = createSlice({
    name: "task",
    initialState,
    reducers:{
        loadTask : (State , Action)=>{
            State.tasks= Action.payload;
        }
    }
});

export default taskSlide.reducer;

export const {loadTask} = taskSlide.actions
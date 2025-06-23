import {loadtodo} from "../reducers/todoSlice"
import axios from "../../api/config";


export const asyncLoadTodo = () => async (dispatch, getState) => {
  try {
    // Remove limit — load all todos
    const { data } = await axios.get("/todos");
    dispatch(loadtodo(data));

  } catch (err) {
    console.log("Error loading todos:", err);
  }
};

export const asyncTodoCreate= (todo)=> async (dispatch,getState)=>{
    try{
        await axios.post("/todos",todo);
        dispatch(asyncLoadTodo());

    }catch(err){
        console.log(err);
        
    }
}
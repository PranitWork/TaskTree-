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

export const asyncTodoCreate= (id,todo)=> async (dispatch,getState)=>{
    try{
        await axios.post("/todos",todo);
        dispatch(asyncLoadTodo());

    }catch(err){
        console.log(err);
        
    }
}

export const asyncUpdateTodo = (updatedTodo) => async (dispatch) => {
  try {
    await axios.patch(`/todos/${updatedTodo.id}`, updatedTodo);
    dispatch(asyncLoadTodo());
  } catch (err) {
    console.log("Error updating todo:", err);
  }
};


export const asyncDeleteTodo = (id)=> async(dispatch, getState)=>{
  try{
    await axios.delete(`/todos/${id}`)
    dispatch(asyncLoadTodo());
    
  }catch(err){
    console.log(err)
  }
}
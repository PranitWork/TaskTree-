import { loadTask } from "../reducers/taskSlice";
import axios from "../../api/config"
import {toast} from "react-toastify"

export const asyncLoadTask=()=> async(dispatch,getState)=>{
    try{
        
        const {data}= await axios.get(`/task`);
        dispatch(loadTask(data));

    }catch(err){
        console.log(err);
        
    }
}

export const asyncTaskCreate=(tasks)=> async(dispatch, getState)=>{
    try{
        await axios.post(`/task/`,tasks);

        dispatch(asyncLoadTask());

    }catch(err){
        console.log(err);
    }
}

export const asyncdeleteTask = (id)=> async(dispatch,getState)=>{
    try{
        await axios.delete(`/task/${id}`);
        toast.warning("Task deleted")
    }catch(err){
        console.log(err);
        
    }
}
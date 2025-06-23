import { loadTask } from "../reducers/taskSlice";
import axios from "../../api/config"


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
        await axios.post("/task", tasks);
        dispatch(asyncLoadTask());

    }catch(err){
        console.log(err);
        
    }
}
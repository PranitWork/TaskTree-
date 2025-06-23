import axios from "../../api/config"
import {loadfolder} from "../reducers/folderSlice"


export const asyncloadFolders = ()=> async (dispatch,getState)=>{
    try{

        const {data}= await axios.get("/folders");
        dispatch(loadfolder(data));
        console.log("product loaded")
    }catch(err){console.log(err)}
}

export const asynccreateFolder = (folders)=> async (dispatch, getState)=>{
    try{
        await axios.post("/folders",folders)
        dispatch(asyncloadFolders());
        console.log("product created")
    }catch(err){
        console.log(err)
    }
}
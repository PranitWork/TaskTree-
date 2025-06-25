import axios from "../../api/config"
import {loadfolder} from "../reducers/folderSlice"
import {toast} from "react-toastify"

export const asyncloadFolders = ()=> async (dispatch,getState)=>{
    try{

        const {data}= await axios.get("/folders");
        dispatch(loadfolder(data));

    }catch(err){console.log(err)}
}

export const asynccreateFolder = (folders)=> async (dispatch, getState)=>{
    try{
        await axios.post("/folders",folders)
        dispatch(asyncloadFolders());

    }catch(err){
        console.log(err)
    }
}


export const asyncdeleteFolder = (id) => async (dispatch, getState) => {
  try {
    await axios.delete(`/folders/${id}`);
    toast.warning("Folder deleted");
  } catch (err) {
    console.error("Delete Folder Error:", err);
  }
};

import { loadusers, logoutuser } from "../reducers/userSlice";
import axios from "../../api/config"

export const asyncCurrentUser = () => async (dispatch, getState) => {
    try{
        const user = JSON.parse(localStorage.getItem("users"));
        if(user){
            dispatch(loadusers(user));
            console.log("session restored")
        }
    }catch(err){console.log(err)}
};


export const asyncCreateUser=(data)=> async (dispatch, getState)=>{
    try{
        const user = await axios.post("/users", data);
        dispatch(asyncCurrentUser);

    }catch(err){
        console.log(err)
    }
}


export const asyncsigninuser = (users) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(
            `/users?email=${users.email}&password=${users.password}`
        );
       
        if (data[0]) {
            console.log("User logged in!");
            localStorage.setItem("users", JSON.stringify(data[0]));
            dispatch(asyncCurrentUser());

        } else {
            alert("Wrong Credientials!");
        }
    } catch (error) {
        console.log(error);
    }
};


export const ayncsignoutuser =()=> async (dispatch,getState)=>{
    try{
        localStorage.removeItem("users");
        dispatch(logoutuser());
        console.log("users logout")
    }catch(err){
        console.log(err)
    }
}
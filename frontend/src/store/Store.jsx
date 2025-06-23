
import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./reducers/userSlice"
import folderSlice from "./reducers/folderSlice"
import todoSlice from "./reducers/todoSlice"
import taskSlice from "./reducers/taskSlice"
import  selectedTaskSlice  from "./reducers/selectedTaskSlice"
export const Store = configureStore( {
  reducer:{
    userReducer: userSlice,
    folderReducer: folderSlice,
    todoReducer: todoSlice,
    taskReducer: taskSlice,
    selectedTaskReducer: selectedTaskSlice,
  },
})

import React, { useEffect } from "react";
import MainRouter from "./router/MainRouter";
import LeftSide from "./components/LeftSide";
import { useDispatch } from "react-redux";
import { asyncLoadTask } from "./store/actions/TaskActions";
import { asyncLoadTodo } from "./store/actions/todoActions";
import { asyncloadFolders } from "./store/actions/folderActions";
import { asyncCurrentUser } from "./store/actions/userActions";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncLoadTask());
    dispatch(asyncLoadTodo());
    dispatch(asyncloadFolders());
    dispatch(asyncCurrentUser());

  }, [dispatch]);

  return (
    <div className="flex">
      <LeftSide />
      <MainRouter />
    </div>
  );
};

export default App;

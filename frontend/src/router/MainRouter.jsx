import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import TodoDetails from "../pages/TodoDetails";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { Auth, UnAuth } from "./Auth";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth><Home /></Auth>} />
      <Route path="/details/:id" element={<Auth><TodoDetails /></Auth>} />
      <Route path="/register" element={<UnAuth><Register /></UnAuth>} />
      <Route path="/login" element={<UnAuth><Login /></UnAuth>} />
    </Routes>
  );
};

export default MainRouter;

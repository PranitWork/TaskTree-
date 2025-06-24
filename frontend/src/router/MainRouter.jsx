import {Route, Routes} from "react-router-dom"
import Home from "../pages/Home"
import TodoDetails from "../pages/TodoDetails"

const MainRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/details/:id" element={<TodoDetails/>} />
        <Route path="/" element="" />
        <Route path="/" element="" />
    </Routes>
  )
}

export default MainRouter
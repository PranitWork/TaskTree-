import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const TodoCard = () => {
  const todos = useSelector((state) => state.todoReducer.todos);
  const selectedTaskId = useSelector((state) => state.selectedTaskReducer.id);

  const filteredTodos =
    selectedTaskId ? todos.filter((todo) => todo.taskId === selectedTaskId.id)
      : [];
  return (
    <>
      {filteredTodos.length ? (
        filteredTodos.map((t) => (
          <div key={t.id} className="mb-4 w-[25%] cursor-pointer">
            <div className="relative w-full bg-[#F0F0F0] p-3 rounded-t-2xl h-[200px]">
              <h1 className="text-[2.5vh] w-full font-semibold">{t.title}</h1>
              <hr className="my-3 text-gray-300" />
              <div className="w-full overflow-y-auto">
                <p className="text-gray-700 text-[2vh] ">
                  {t.description.slice(0, 100) + "..."}
                </p>
              </div>
              <p className="text-[2vh] text-gray-500 absolute bottom-0">
                Created: {new Date(t.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="rounded-b-2xl w-full bg-[#d2fe94] p-3 flex justify-center">
          <NavLink to={`/details/${t.id}`}>
              <button className="font-medium cursor-pointer text-black">
                Detail
              </button>
      </NavLink>
            </div>
          </div>
        ))
      ) : (
        <h1>No Task Found...</h1>
      )}
    </>
  );
};

export default TodoCard;

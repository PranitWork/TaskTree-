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
            <div
              key={t.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden"
            >
              <div className="bg-[#F0F0F0] p-4 h-[200px] relative">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {t.title}
                </h2>
                <hr className="my-3 border-gray-300" />
                <p className="text-sm text-gray-700 max-h-[90px] overflow-y-auto">
                  {t.description.slice(0, 100)}...
                </p>
                <p className="absolute bottom-2 text-xs text-gray-500">
                  Created: {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-[#d2fe94] p-3 text-center">
                <NavLink to={`/details/${t.id}`} className="text-sm font-medium text-black">
                  Detail
                </NavLink>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">No Task Found...</p>
        )}
    </>
  );
};

export default TodoCard;

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { asyncDeleteTodo, asyncUpdateTodo } from "../store/actions/todoActions";
import { toast } from "react-toastify";

const TodoDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const { id } = useParams();

  const todos = useSelector((state) => state.todoReducer.todos);
  const tododata = todos.find((t) => String(t.id) === String(id));
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (tododata) {
      setValue("title", tododata.title);
      setValue("description", tododata.description);
    }
  }, [tododata, setValue]);

  const enableEditMode = () => setIsEditable(true);

  const submitHandler = (data) => {
    const updatedData = { ...data, id: tododata.id };
    dispatch(asyncUpdateTodo(updatedData));
    toast.success("Todo updated successfully");
    setIsEditable(false);
  };

  const deleteTodo = () => {
    dispatch(asyncDeleteTodo(tododata.id));
    toast.error("Todo deleted");
    navigate("/");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-100 rounded-3xl shadow-lg relative mt-6 mb-10 min-h-[70vh]">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Todo Title..."
          readOnly={!isEditable}
          {...register("title")}
          className="w-full text-2xl font-semibold px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
        />
        <hr className="border-gray-300" />
        <textarea
          rows={15}
          placeholder="Enter Todo..."
          readOnly={!isEditable}
          {...register("description")}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
        />
        {isEditable && (
          <button
            type="submit"
            className="mt-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md"
          >
            Save
          </button>
        )}
      </form>

      {/* Action Buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-4">
        {!isEditable && (
          <button
            onClick={enableEditMode}
            className="w-12 h-12 bg-white rounded-full shadow-lg hover:scale-105 transition"
            title="Edit Todo"
          >
            <img src="/image3.png" alt="Edit" className="w-full h-full object-contain" />
          </button>
        )}
        <button
          onClick={deleteTodo}
          className="w-12 h-12 bg-white rounded-full shadow-lg hover:scale-105 transition"
          title="Delete Todo"
        >
          <img src="/image2.png" alt="Delete" className="w-full h-full object-contain" />
        </button>
      </div>
    </div>
  );
};

export default TodoDetails;

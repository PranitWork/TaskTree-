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
  const tododata = todos.find((p) => String(p.id) === String(id));

  const [isEditable, setIsEditable] = useState(false);


  useEffect(() => {
    if (!tododata) return;
      setValue("title", tododata.title);
      setValue("description", tododata.description);
    
  }, [tododata, setValue]);

  const enableEditMode = () => setIsEditable(true);

  const submitHandler = (data) => {
    const updatedData = { ...data, id: tododata.id };
    dispatch(asyncUpdateTodo(updatedData));
    toast.success("Todo updated successfully");
    setIsEditable(false);
  };
  const deleteTodo  =()=>{
    const todoid = tododata.id;
    dispatch(asyncDeleteTodo(todoid));
      toast.error("data deleted")
    navigate("/")
  }

  return (
    <div className="w-[80%] shadow-lg relative m-auto h-[90vh] p-5 rounded-3xl bg-[#F0F0F0]">
      <form onSubmit={handleSubmit(submitHandler)}>
        <input
          className="w-full font-medium text-2xl outline-0"
          type="text"
          placeholder="Enter Todo Title..."
          readOnly={!isEditable}
          {...register("title")}
        />
        <hr className="my-4" />
        <textarea
          className="w-full outline-0 resize-none"
          rows="19"
          placeholder="Enter Todo"
          readOnly={!isEditable}
          {...register("description")}
        ></textarea>

        {isEditable && (
          <button
            type="submit"
            className="mt-3 py-1 px-4 bg-green-500 rounded-full text-white font-medium"
          >
            Save
          </button>
        )}
      </form>

      <div onClick={deleteTodo} className="absolute w-13 bottom-6 shadow-lg cursor-pointer rounded-full right-6">
        <img src="../../public/image2.png" alt="Decorative" />
      </div>

      {!isEditable && (
        <div
          onClick={enableEditMode}
          className="absolute w-13 bottom-24 shadow-lg cursor-pointer rounded-full right-6"
        >
          <img src="../../public/image3.png" alt="Edit" />
        </div>
      )}
    </div>
  );
};

export default TodoDetails;

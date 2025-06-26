import TodoCard from "../components/TodoCard";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { asyncTodoCreate } from "../store/actions/todoActions";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const folders = useSelector((state) => state.folderReducer.folders);
  const Tasks = useSelector((state) => state.taskReducer.tasks);
  const selectedname = useSelector((state) => state.selectedTaskReducer.name);
  const userDetails = JSON.parse(localStorage.getItem("users"));

  const [userFolders, setUserFolders] = useState([]);
  const [userTasks, setUserTasks] = useState([]);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { title: "", description: "" },
  });

  const selectedFolderId = watch("folderId");

  useEffect(() => {
    if (!userDetails?.id) return;

    const filteredFolders = folders.filter(
      (folder) => folder && folder.userId === userDetails.id
    );
    const folderIds = filteredFolders.map((f) => f.id);
    const filteredTasks = Tasks.filter((task) => folderIds.includes(task.folderId));

    setUserFolders(filteredFolders);
    setUserTasks(filteredTasks);
  }, [folders, Tasks]);

  const taskTitle = selectedname?.name || "";
 
  const showDefaultText = !taskTitle || userTasks.length === 0 || userFolders.length === 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    data.id = nanoid();
    data.userId = userDetails.id;
    data.createdAt = Date.now();
    dispatch(asyncTodoCreate(data));
    closeModal();
  };

  return (
    <div className="relative w-full p-5">
     <h1 className="text-[4vh] font-bold mb-5 ml-[50px]">
        {showDefaultText ? "Start writing your tasks..." : taskTitle}
      </h1>

      <div className="w-full flex flex-wrap gap-4 -mx-2">
       <TodoCard/>
      </div>

      <button
        onClick={openModal}
        className="fixed bottom-5 right-5 bg-green-600 text-white p-3 rounded-full shadow hover:bg-green-700 z-20"
      >
        + Create Todo
      </button>

      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add Task</h2>
              <button
                onClick={closeModal}
                className="text-2xl font-bold text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Todo Title…"
                {...register("title", { required: "Title is required" })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

              <textarea
                rows="5"
                placeholder="Enter Todo…"
                {...register("description", { required: "Description is required" })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

              <select
                {...register("folderId", { required: "Please select a folder" })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Select Folder --</option>
                {userFolders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.FolderName || "Untitled Folder"}
                  </option>
                ))}
              </select>

              <select
                {...register("taskId", { required: "Please select a task" })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Select Task --</option>
                {userTasks
                  .filter((task) => String(task.folderId) === String(selectedFolderId))
                  .map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.TaskTitle || "Untitled Task"}
                    </option>
                  ))}
              </select>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-semibold"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

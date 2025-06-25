import React, { useEffect, useState } from "react";
import TodoCard from "../components/TodoCard";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { asyncTodoCreate } from "../store/actions/todoActions";
import { nanoid } from "@reduxjs/toolkit";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const folders = useSelector((state) => state.folderReducer.folders);
  const Tasks = useSelector((state) => state.taskReducer.tasks);
  const selectedname = useSelector((state) => state.selectedTaskReducer.name);
  const userDetails = JSON.parse(localStorage.getItem("users"));

  const [userFolders, setUserFolders] = useState([]);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    if (!userDetails || !userDetails.id) {
      console.warn("User not found in localStorage");
      return;
    }

    const filteredFolders = folders.filter(
      (folder) => folder && folder.userId === userDetails.id
    );

    const folderIds = filteredFolders.map((f) => f.id);

    const filteredTasks = Tasks.filter((task) =>
      folderIds.includes(task.folderId)
    );

    setUserFolders(filteredFolders);
    setUserTasks(filteredTasks);
  }, [folders, Tasks]);

  // ✅ Safe access to task title
  const taskTitle = selectedname?.name || "";

  // ✅ Condition to show fallback text
  const showDefaultText =
    !taskTitle || userTasks.length === 0 || userFolders.length === 0;

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
  const dispatch = useDispatch();

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
    <div className="relative w-full">
      <div className="p-5 w-full relative inline-block">
        <h1 className="text-[4vh] mb-5 font-bold">
          {showDefaultText ? "Start writing your tasks..." : taskTitle}
        </h1>
        <div className="w-full flex gap-3">
          <TodoCard />
        </div>
      </div>

      {/* floating “Create Todo” button */}
      <button
        onClick={openModal}
        className="absolute cursor-pointer bottom-5 right-5 bg-green-600 p-3 rounded-full text-white text-sm"
      >
        + Create Todo
      </button>

      {/* modal */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/30"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="shadow-lg w-[50%] max-w-xl bg-white rounded-2xl p-6"
          >
            {/* header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Add Task</h2>
              <button onClick={closeModal} className="text-2xl leading-none">
                &times;
              </button>
            </div>

            {/* form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Enter Todo Title…"
                {...register("title", { required: "Title is required" })}
                className="rounded-2xl bg-gray-100 p-3 outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}

              <textarea
                rows="5"
                placeholder="Enter Todo…"
                {...register("description", {
                  required: "Description is required",
                })}
                className="rounded-2xl bg-gray-100 p-3 resize-none outline-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}

              <select
                {...register("folderId", {
                  required: "Please select a folder",
                })}
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
                {...register("taskId", {
                  required: "Please select a task",
                })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Select Task --</option>
                {userTasks
                  .filter(
                    (task) =>
                      String(task.folderId) === String(selectedFolderId)
                  )
                  .map((Task) => (
                    <option key={Task.id} value={Task.id}>
                      {Task.TaskTitle || "Untitled Task"}
                    </option>
                  ))}
              </select>

              <button
                type="submit"
                className="self-start bg-green-500 hover:bg-green-600 text-white rounded-2xl py-2 px-6 shadow-lg"
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

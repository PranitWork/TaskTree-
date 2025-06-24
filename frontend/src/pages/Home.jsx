import React, { useState } from "react";
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
  
  const taskTitle = String(selectedname.name);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { title: "", description: "" },
  });


  const selectedFolderId = watch("folderId"); // 👈 watch the folder selection
  const dispatch = useDispatch();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const todo = { ...data, id: nanoid(), createdAt: Date.now() };
    dispatch(asyncTodoCreate(todo));
    closeModal();
  };

  return (
    <div className="relative w-full">
      <div className="p-5 w-full relative inline-block">
        <h1 className="text-[4vh] mb-5 font-bold">{taskTitle}</h1>
        <div className=" w-full flex gap-3">
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

              <select
                {...register("folderId", {
                  required: "Please select a folder",
                })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Select Folder --</option>
                {folders.map((folder) => (
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
                {Tasks.filter(
                  (task) => String(task.folderId) === String(selectedFolderId)
                ).map((Task) => (
                  <option key={Task.id} value={Task.id}>
                    {Task.TaskTitle || "Untitled Task"}
                  </option>
                ))}
              </select>

              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}

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

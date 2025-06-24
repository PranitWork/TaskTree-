import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import { asynccreateFolder } from "../store/actions/folderActions";
import { asyncTaskCreate } from "../store/actions/TaskActions";
import { setSelectedTaskId } from "../store/reducers/selectedTaskSlice";

const LeftSide = () => {
  const folderForm = useForm();
  const taskForm = useForm();
  const dispatch = useDispatch();

  const folders = useSelector((state) => state.folderReducer.folders);
  const Tasks = useSelector((state) => state.taskReducer.tasks);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const [ToggletFolder, setToggletFolder] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState(null);

  /* --- click handler --- */
  const folderOpenClose = (id) => {
    // clicking the same folder toggles it; clicking a different one opens that one
    if (activeFolderId === id) {
      setToggletFolder((prev) => !prev);
    } else {
      setActiveFolderId(id);
      setToggletFolder(true);
    }
  };

  const openCreateFolder = () => setShowCreateFolder(true);
  const openAddTask = () => setShowAddTask(true);
  const closeModal = () => {
    setShowCreateFolder(false);
    setShowAddTask(false);
    folderForm.reset();
    taskForm.reset();
  };

  const newFolderHandler = (data) => {
    data.id = nanoid();
    dispatch(asynccreateFolder(data));
    closeModal();
  };

  const saveTaskHandler = (data) => {
    data.id = nanoid();
    dispatch(asyncTaskCreate(data));
    closeModal();
  };

  return (
    <>
      {/* Sidebar */}
      <div className="flex flex-col w-[17%] min-h-screen bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] shadow-xl rounded-se-3xl">
        {/* Folders Section */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <h1 className="text-xl font-bold text-gray-700 mb-3">Task <span className="text-green-600">Tree</span></h1>
          <h2 className="text-[2.5vh] font-semibold text-gray-500 mb-3">Folders</h2>
          <div className="bg-white rounded-xl p-3 shadow hover:shadow-md transition cursor-pointer">
            {folders.map((f) => (
              /* ↓ 1. pass the folder id to the handler */
              <div
                key={f.id}
                onClick={() => folderOpenClose(f.id)}
                className=""
              >
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-folder-5-line text-yellow-500 text-xl"></i>
                  <h3 className="text-base font-medium text-gray-700">
                    {f.FolderName}
                  </h3>
                </div>
                {ToggletFolder && activeFolderId === f.id && (
                  <div className="space-y-1 mt-3">
                    {Tasks.filter((t) => t.folderId === f.id).map((t) => (
                      <p  onClick={(e) => {e.stopPropagation()
                        dispatch(setSelectedTaskId({id:t.id, name:t.TaskTitle}))
                      }}
                        key={t.id}
                        className="text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md cursor-pointer"
                      >
                        {t.TaskTitle}
                      </p>

                    ))}
                   
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-white shadow-inner rounded-ee-3xl space-y-3">
          <button
            onClick={openAddTask}
            className="w-full cursor-pointer py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition shadow"
          >
            + Add Task
          </button>
          <button
            onClick={openCreateFolder}
            className="w-full cursor-pointer py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition shadow"
          >
            + Create Folder
          </button>
        </div>
      </div>

      {/* Folder Modal */}
      {showCreateFolder && (
        <div
          onClick={closeModal}
          className="z-20 fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-xl w-[90%] max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Create Folder</h2>
              <button
                onClick={closeModal}
                className="text-2xl font-bold text-gray-500 hover:text-red-500 transition"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={folderForm.handleSubmit(newFolderHandler)}
              className="space-y-4"
            >
              <input
                {...folderForm.register("FolderName", {
                  required: "Folder name is required",
                })}
                type="text"
                placeholder="Folder Name"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {folderForm.formState.errors.FolderName && (
                <p className="text-red-500 text-sm">
                  {folderForm.formState.errors.FolderName.message}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 font-semibold transition"
              >
                Create Folder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showAddTask && (
        <div
          onClick={closeModal}
          className="z-20 fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-xl w-[90%] max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Add Task</h2>
              <button
                onClick={closeModal}
                className="text-2xl font-bold text-gray-500 hover:text-red-500 transition"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={taskForm.handleSubmit(saveTaskHandler)}
              className="space-y-4"
            >
              <input
                {...taskForm.register("TaskTitle", {
                  required: "Todo title is required",
                })}
                type="text"
                placeholder="Task Title"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <select
                {...taskForm.register("folderId", {
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
              {taskForm.formState.errors.TaskTitle && (
                <p className="text-red-500 text-sm">
                  {taskForm.formState.errors.TaskTitle.message}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-2 font-semibold transition"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSide;

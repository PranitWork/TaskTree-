import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate, NavLink } from "react-router-dom";
import { asynccreateFolder } from "../store/actions/folderActions";
import { asyncTaskCreate } from "../store/actions/TaskActions";
import { setSelectedTaskId } from "../store/reducers/selectedTaskSlice";
import { ayncsignoutuser } from "../store/actions/userActions";

const LeftSide = () => {
  const folderForm = useForm();
  const taskForm = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [ToggletFolder, setToggletFolder] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState(null);
  
  const folders = useSelector((state) => state.folderReducer.folders);
  const Tasks = useSelector((state) => state.taskReducer.tasks);
  const userAuth = JSON.parse(localStorage.getItem("users"));
  const userDetails = JSON.parse(localStorage.getItem("users"))

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



  const folderOpenClose = (id) => {
    if (userAuth) {
      if (activeFolderId === id) {
        setToggletFolder((prev) => !prev);
      } else {
        setActiveFolderId(id);
        setToggletFolder(true);
      }
    } else {
      navigate("/login");
    }
  };

  const openCreateFolder = () => {
    if (userAuth) {
      setShowCreateFolder(true);
    } else {
      navigate("/login");
    }
  };

  const openAddTask = () => {
    if (userAuth) {
      setShowAddTask(true);
    } else {
      navigate("/login");
    }
  };

  const closeModal = () => {
    setShowCreateFolder(false);
    setShowAddTask(false);
    folderForm.reset();
    taskForm.reset();
  };

  const newFolderHandler = (data) => {
    if (userAuth) {
      data.userId = userDetails.id;
      data.id = nanoid();
      dispatch(asynccreateFolder(data));
      closeModal();
    } else {
      navigate("/login");
    }
  };

  const saveTaskHandler = (data) => {
    if (userAuth) {
      data.id = nanoid();
       data.userId = userDetails.id;
      dispatch(asyncTaskCreate(data));
      closeModal();
    } else {
      navigate("/login");
    }
  };
  const backtrack = () => {
    navigate("/");
  };

  const logout = () => {
    dispatch(ayncsignoutuser());
    navigate("/register");
  };

  return (
    <>
      {/* Sidebar */}
      <div className="relative flex flex-col w-[17%] min-h-screen bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] shadow-xl rounded-se-3xl">
        {/* Folders Section */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <h1 className="text-xl font-bold text-gray-700 mb-3">
            Task <span className="text-green-600">Tree</span>
          </h1>
          <h2 className="text-[2.5vh] font-semibold text-gray-500 mb-3">
            Folders
          </h2>
         <div className="bg-white h-[60vh] overflow-x-hidden overflow-y-scroll rounded-xl p-3 shadow hover:shadow-md transition cursor-pointer">
  {userFolders.map((f) => (
    <div key={f.id} onClick={() => folderOpenClose(f.id)}>
      <div className="flex items-center gap-2 mb-2">
        <i className="ri-folder-5-line text-yellow-500 text-xl"></i>
        <h3 className="text-base font-medium text-gray-700">
          {f.FolderName}
        </h3>
      </div>

      {ToggletFolder && activeFolderId === f.id && (
        <div className="space-y-1 mt-3">
          {userTasks
            .filter((t) => t.folderId === f.id)
            .map((t) => (
              <p
                key={t.id}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setSelectedTaskId({ id: t.id, name: t.TaskTitle }));
                  backtrack();
                }}
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
          <div className="w-full flex gap-5">
            <button
              onClick={logout}
              className="w-full text-center cursor-pointer text-[13px] py-1 px-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition shadow"
            >
              <i className="ri-login-box-line"></i>
            </button>
            <NavLink
              to={"/register"}
              className="w-full text-center cursor-pointer text-[13px] py-1 px-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition shadow"
            >
              <i className="ri-user-fill"></i>
            </NavLink>
          </div>
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
                {userFolders.map((folder) => (
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

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate, NavLink } from "react-router-dom";
import {
  asynccreateFolder,
  asyncdeleteFolder,
  asyncloadFolders,
} from "../store/actions/folderActions";
import { asyncdeleteTask, asyncLoadTask, asyncTaskCreate } from "../store/actions/TaskActions";
import { setSelectedTaskId } from "../store/reducers/selectedTaskSlice";
import { ayncsignoutuser } from "../store/actions/userActions";
import { selectedFolderId } from "../store/reducers/selectedFolderSlice";
import { asyncDeleteTodo, asyncLoadTodo } from "../store/actions/todoActions";

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
  const todos = useSelector((state) => state.todoReducer.todos);

  const selectedFolder = useSelector((state) => state.selectedFolderReducer.id);
  const selectedTask = useSelector((state) => state.selectedTaskReducer);

  const [userFolders, setUserFolders] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userAuth = JSON.parse(localStorage.getItem("users"));
  const userDetails = JSON.parse(localStorage.getItem("users"));

 

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const closeSidebar = () => {
    if (window.innerWidth < 640) setIsSidebarOpen(false);
  };

  const folderOpenClose = (id) => {
    if (userAuth) {
      if (activeFolderId === id) setToggletFolder((prev) => !prev);
      else {
        setActiveFolderId(id);
        setToggletFolder(true);
      }
    } else navigate("/login");
  };

  const openCreateFolder = () =>
    userAuth ? setShowCreateFolder(true) : navigate("/login");
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
    } else navigate("/login");
  };

  const saveTaskHandler = (data) => {
    if (userAuth) {
      data.id = nanoid();
      data.userId = userDetails.id;
      dispatch(asyncTaskCreate(data));
      closeModal();
    } else navigate("/login");
  };

 const deletefolder = async () => {
  // 1. Get all tasks under the selected folder
  const taskFilterDelete = Tasks.filter(task => task.folderId === selectedFolder);

  // 2. For each task, delete its todos
  for (const task of taskFilterDelete) {
    const relatedTodos = todos.filter(todo => todo.taskId === task.id);
    for (const todo of relatedTodos) {
      await dispatch(asyncDeleteTodo(todo.id));
    }

    await dispatch(asyncdeleteTask(task.id)); // delete the task
      dispatch(asyncloadFolders());
  dispatch(asyncLoadTask());
  dispatch(asyncLoadTodo());
  }

  // 3. Finally, delete the folder
  await dispatch(asyncdeleteFolder(selectedFolder));
};
const deleteTask = async () => {
  const taskId = selectedTask.id.id;

  const relatedTodos = todos.filter(todo => todo.taskId === taskId);

  for (const todo of relatedTodos) {
    await dispatch(asyncDeleteTodo(todo.id));
  }

  await dispatch(asyncdeleteTask(taskId));
        dispatch(asyncloadFolders());
  dispatch(asyncLoadTask());
  dispatch(asyncLoadTodo());
};


  const backtrack = () => navigate("/");

  const logout = () => {
    dispatch(ayncsignoutuser());
    navigate("/register");
          dispatch(asyncloadFolders());
  dispatch(asyncLoadTask());
  dispatch(asyncLoadTodo());
  };



   useEffect(() => {
    if (!userDetails || !userDetails.id) return;

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

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`sm:hidden fixed top-4 z-30 bg-white p-2 rounded-full shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "right-4" : "left-4"
        }`}
      >
        <i
          className={`ri-menu-line text-2xl transition-transform duration-300 ${
            isSidebarOpen ? "rotate-90" : ""
          }`}
        ></i>
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="sm:hidden fixed inset-0 bg-black/30 z-10"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed sm:relative z-20 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-[80%] sm:w-[60%] md:w-[40%] lg:w-[25%] xl:w-[17%] min-h-screen bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] shadow-xl rounded-se-3xl`}
      >
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-3">
            Task <span className="text-green-600">Tree</span>
          </h1>
          <h2 className="text-lg sm:text-[2.5vh] font-semibold text-gray-500 mb-3">
            Folders
          </h2>

          <div className="bg-white max-h-[60vh] overflow-y-auto rounded-xl p-3 shadow hover:shadow-md transition">
            {userFolders.map((f) => (
              <div
                key={f.id}
                onClick={() => folderOpenClose(f.id)}
                className="mb-3"
              >
                <div className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-gray-100 transition group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <i className="ri-folder-5-line text-yellow-500 text-xl"></i>
                    <h3 className="text-base font-medium text-gray-700 truncate max-w-[140px]">
                      {f.FolderName}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(selectedFolderId(f.id));
                      deletefolder();
                    }}
                    className="text-gray-400 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 hover:text-red-600 transition"
                    title="Delete Folder"
                  >
                    <i className="ri-delete-bin-line text-lg"></i>
                  </button>
                </div>

                {ToggletFolder && activeFolderId === f.id && (
                  <div className="flex flex-col mt-2 space-y-2">
                    {userTasks
                      .filter((t) => t.folderId === f.id)
                      .map((t) => (
                        <div
                          key={t.id}
                          className="group flex items-center justify-between px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 shadow-sm transition cursor-pointer relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              setSelectedTaskId({ id: t.id, name: t.TaskTitle })
                            );
                            backtrack();
                            closeSidebar();
                          }}
                        >
                          <p className="text-sm text-gray-800 font-medium truncate max-w-[85%]">
                            {t.TaskTitle}
                          </p>
                          <button
                            className="absolute right-3 text-gray-400 hover:text-red-700 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                setSelectedTaskId({
                                  id: t.id,
                                  name: t.TaskTitle,
                                })
                              );
                              deleteTask();
                            }}
                          >
                            <i className="ri-delete-bin-line text-lg"></i>
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white shadow-inner space-y-3">
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5">
            <button
              onClick={() => {
  logout();
  closeSidebar();
}}
              className="w-full text-center text-[13px] py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition shadow"
            >
              <i className="ri-login-box-line"></i>
            </button>
            <NavLink
              to="/register"
              className="w-full text-center text-[13px] py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition shadow"
            >
              <i className="ri-user-fill"></i>
            </NavLink>
          </div>
          <button
            onClick={openAddTask}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition shadow"
          >
            + Add Task
          </button>
          <button
            onClick={openCreateFolder}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition shadow"
          >
            + Create Folder
          </button>
        </div>
      </div>

      {/* Create Folder Modal */}
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

      {/* Add Task Modal */}
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

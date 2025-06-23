

const TodoDetails = () => {
  return (
    <div className="w-[80%] shadow-lg relative m-auto h-[90vh] p-5 rounded-3xl bg-[#F0F0F0]">
      <form action="">
        <input
          className="w-full outline-0 "
          type="text"
          placeholder="Enter Todo Title..."
        />
        <hr className="my-4" />
        <textarea
          className="w-full outline-0 resize-none"
          rows="18"
          placeholder="Enter Todo"
          id=""
        ></textarea>
      </form>
      <div className="absolute w-13 bottom-6 shadow-lg cursor-pointer  rounded-full right-6">
        <img src="../../public/image2.png" alt="" />
      </div>
      <div className="absolute w-13 bottom-23 shadow-lg cursor-pointer  rounded-full right-6">
        <img src="../../public/image3.png" alt="" />
      </div>
    </div>
  );
};

export default TodoDetails;

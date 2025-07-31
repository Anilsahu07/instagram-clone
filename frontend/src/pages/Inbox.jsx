import React, { useContext, useEffect, useState } from "react";
import { usercontext } from "../context/Maincontext";
import { Link } from "react-router-dom";
import axios from "../api/ApiConfig";

const Inbox = () => {
  const { fetchAllUsers, users, singleUser, toggle, messages, setMessages} =
  useContext(usercontext);
  const [search, setsearch] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const time = new Date().toLocaleTimeString();

  const showUsers = users?.filter((s) =>
    [s?.profile?.fullName, s?.username].filter(Boolean).some((field) =>
      field.toLowerCase().includes(search)
    )
   );

  const deleteChat = async (otherUserId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      await axios.delete(`/messages/delete/${singleUser?._id}/${otherUserId}`);
      fetchAllUsers();
      setMessages([])
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="lg:w-full w-screen flex flex-col items-center gap-2 p-1">
      <h2 className="text-xl font-semibold border-b w-full border-gray-500 text-center p-3">
        Inbox
      </h2>
      <input
        onChange={(e) => setsearch(e.target.value)}
        value={search}
        className="border p-1.5 lg:w-1/2 w-2/3 text-black"
        type="text"
        placeholder="Search Person..."
      />
      {search ? (
        showUsers?.length > 0 ? (
          showUsers?.map(
            (user) =>
              user?._id !== singleUser?._id && (
                <div
                  key={user?._id}
                  className={`group flex lg:w-fit w-full border-gray-400 font-[montserrat] ${
                    toggle
                      ? " hover:bg-gray-300"
                      : " hover:bg-gray-500"
                  }`}
                >
                  <Link
                    to={`/chat/${user?._id}`}
                    className="flex items-center lg:gap-4 w-full justify-center p-1 gap-2 border-b-2"
                  >
                    <img
                      className="lg:w-18 h-16 w-16 lg:h-18 rounded-full"
                      src={user?.profile?.avatar}
                      alt=""
                    />
                    <div className="flex flex-col">
                      <h2 className="font-semibold lg:text-xl text-sm">
                        {user?.username}
                      </h2>
                      <p className="lg:text-sm text-[12px]">Sent at {time}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteChat(user._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-[roboto] text-sm hover:bg-black rounded-full px-1"
                    >
                      <i className="ri-delete-bin-5-line text-xl"></i>
                    </button>
                  </Link>
                </div>
              )
          )
        ) : (
          <p className="mt-3">No User to Chat/Text...</p>
        )
      ) : null}
    </div>
  );
};

export default Inbox;

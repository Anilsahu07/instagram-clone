import React, { useContext, useEffect, useState, useRef } from "react";
import { usercontext } from "../context/Maincontext";
import { useParams } from "react-router-dom";
import axios from "../api/ApiConfig";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // backend URL

const Chat = () => {
  const { singleUser, messages, setMessages } = useContext(usercontext);
  const [text, setText] = useState("");
  const { id: receiver } = useParams();
  const bottomRef = useRef();

  // Fetch old messages from DB
  const fetchMessages = async () => {
    const { data } = await axios.get(
      `/messages/${singleUser?._id}/${receiver}`
    );
    setMessages(data);
  };


  useEffect(() => {
    if (singleUser?._id) {
      socket.emit("join", singleUser._id); // Join your personal room
      fetchMessages();
    }
  }, [receiver, singleUser?._id]);



  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);



  const sendMessage = async () => {
    if (!text.trim()) return;
    const { data } = await axios.post("/messages/send", {
      sender: singleUser?._id,
      receiver,
      text,
    });

    setMessages([...messages, data]);

    // Emit socket message
    socket.emit("sendMessage", {
      sender: singleUser?._id,
      receiver,
      text,
    });

    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);



  return (
    <div className="flex flex-col p-5 items-center justify-between lg:w-full w-screen">
      <div className="w-full flex flex-col gap-2 overflow-y-auto ">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded p-1.5 flex gap-2 items-center ${
              msg.sender === singleUser?._id
                ? "bg-blue-700 text-white text-center w-fit flex ms-auto"
                : "border border-gray-400 self-start w-fit"
            }`}
          >
            {msg.text} {msg.sender ===singleUser?._id? <i class="ri-arrow-up-fill text-black text-xl"></i>:<i class="ri-arrow-down-fill text-black text-xl"></i>}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex justify-center gap-0.5 lg:w-full w-screen fixed lg:bottom-2 bottom-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="rounded p-2 lg:w-1/2 w-4/5 border text-black border-black"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white rounded px-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

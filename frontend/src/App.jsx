import React, { useContext, useEffect, useRef, useState } from "react";
import MainRouter from "./router/MainRouter";
import Nav from "./components/Nav";
import { usercontext } from "./context/Maincontext";
import axios from "./api/ApiConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { toast, ToastContainer } from "react-toastify";

const App = () => {
  const {
    users,
    setfollowers,
    setfollowing,
    followers,
    following,
    color,
    setusers,
    toggle,
    changeColor,
  } = useContext(usercontext);
  const logged = JSON.parse(localStorage.getItem("logged"));
  const profile = JSON.parse(localStorage.getItem("logged"));
  const location = useLocation();
  const currentUser = logged?.user?._id || null;
  const otherUsers = users?.filter((u) => u._id !== currentUser) || [];
  const [toggleMenu, settoggleMenu] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    await axios.get("/users/logout");
    setusers(null);
    localStorage.removeItem("logged");
    navigate("/users/login");
  };

  const fetchUsersData = async () => {
    try {
      const { data } = await axios.get("/users/data", {
        withCredentials: true,
      });
      setfollowers(data.followers || []);
      setfollowing(data.following || []);
    } catch (error) {
      console.log("Problem in fetchind user's data", error);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const followUser = async (id) => {
    try {
      await axios.patch(`/users/follow/${id}`, {}, { withCredentials: true });
      if (!followers.includes(id)) {
        setfollowers((prev) => [...prev, { _id: id }]);
      }
      await fetchUsersData();
    } catch (error) {
      console.log("Error following user:", error);
    }
  };

  const UnfollowUser = async (id) => {
    try {
      await axios.patch(`/users/unfollow/${id}`, {}, { withCredentials: true });
      setfollowers((prev) => prev.filter((f) => f._id !== id));
      await fetchUsersData();
    } catch (error) {
      console.log("Error Unfollowing user:", error);
    }
  };

  const navigateToProfile = (id) => {
    navigate(`/user/profile/${id}`);
  };

  const navigateBack = () => {
    navigate(-1);
  };

  const showSettings = () => {
    settoggleMenu(!toggleMenu);
  };

  // gsap for toggling menu
  const move = useRef(null);
  const moveLarge = useRef(null);
  useEffect(() => {
    if (toggle) {
      gsap.to(move.current, {
        x: 30,
        duration: 0.1,
      });
      gsap.to(moveLarge.current, {
        x: 30,
        duration: 0.1,
      });
    } else {
      gsap.to(move.current, {
        x: 0,
        duration: 0.1,
      });
      gsap.to(moveLarge.current, {
        x: 0,
        duration: 0.1,
      });
    }
  }, [toggle]);

  const divRef = useRef(null);
  const iconRef = useRef(null);
  const divRefLarge = useRef(null);
  const iconRefLarge = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !divRefLarge.current.contains(event.target) &&
        !divRef.current.contains(event.target) &&
        !iconRefLarge.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
        settoggleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(followers);
  console.log(following);

  return (
    <div>
      {location.pathname !== "/users/signup" && location.pathname !== "/users/login"? (
        <div className="sticky top-0 lg:hidden z-50 bg-black text-white border-b border-gray-600 w-full flex justify-between p-1">
          <div className="px-2 py-2">
            {location.pathname !== `/` ? (
              <Link
                onClick={navigateBack}
                className="ri-arrow-left-line  lg:hidden flex text-2xl font-semibold"
              ></Link>
            ) : (
              <h1 className="font-[pacifico] text-2xl text-white lg:flex">
                Instagram
              </h1>
            )}
          </div>
          <div className="flex items-center px-3 gap-3">
            <div className="flex items-center gap-2">
              <Link to={`/notification`}>
                <i class="ri-notification-fill text-2xl font-semibold"></i>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link to={`/message`}>
                <i class="ri-messenger-line text-2xl font-semibold"></i>
              </Link>
            </div>
          </div>
        </div>
      ):""}
      {logged?.user?.isProfileComplete ? (
        <div className=" flex flex-col w-full">
          <div className="w-full flex ">
            <div className="w-1/5 lg:flex lg:flex-col justify-between p-8 gap-9 h-screen  hidden">
              <div className="flex flex-col gap-9 fixed">
                <h1 className="font-[pacifico] text-3xl">Instagram</h1>
                <Nav />
              </div>
              <div ref={iconRefLarge} className="fixed bottom-2">
                <div onClick={showSettings}>
                  {toggleMenu ? (
                    <p className="flex items-center gap-3 hover:cursor-pointer">
                      {" "}
                      <i className="ri-close-line text-2xl "></i>More
                    </p>
                  ) : (
                    <p className="flex items-center gap-3 hover:cursor-pointer">
                      {" "}
                      <i className="ri-menu-line text-2xl"></i>More
                    </p>
                  )}
                </div>
                <div
                  ref={divRefLarge}
                  className="absolute flex left-0 bottom-10"
                >
                  {toggleMenu && (
                    <div className=" w-[230px] bg-white text-black p-4 shadow-xl rounded z-50 border border-black">
                      <p className="font-semibold mb-2">Settings</p>

                      <div
                        onClick={changeColor}
                        className="w-[60px] md:w-[70px] h-[34px] md:h-[38px] bg-white border border-black p-1 flex items-center justify-start rounded-3xl cursor-pointer relative"
                      >
                        <div
                          ref={moveLarge}
                          className="w-5 h-5 md:w-8 md:h-8 bg-black rounded-full absolute transition-all duration-300"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className=" lg:w-3/5 w-4/5 h-auto border-l border-gray-500">
              <MainRouter />
            </div>

            <div className="w-1/5 flex-col gap-3 items-center h-screen border-l p-1 fixed right-0 font-[poppins] pt-10 lg:flex hidden">
              {otherUsers?.find((f) => f.isProfileComplete) && (
                <div className="w-full lg:flex justify-around items-center leading-4 text-center">
                  <p className="text-[12px]">Suggestions for you</p>
                  <p className="text-[12px] font-semibold">See All</p>
                </div>
              )}
              {otherUsers?.map((u) => (
                <div
                  key={u._id}
                  className="lg:flex lg:items-center lg:justify-around w-full text-center "
                >
                  <div
                    onClick={() => navigateToProfile(u._id)}
                    className="flex items-center gap-2 flex-wrap justify-center"
                  >
                    <img
                      className="w-[40px] h-[40px] rounded-full"
                      src={u?.profile?.avatar}
                      alt=""
                    />
                    <div>
                      <h2 className="text-[12px] leading-3">
                        {u?.profile?.fullName}
                      </h2>
                    </div>
                  </div>

                  {following?.some((f) => f._id === u._id) ? (
                    <button
                      onClick={() => UnfollowUser(u._id)}
                      className="text-[11px] text-blue-600 bg-white border p-1 rounded"
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      onClick={() => followUser(u._id)}
                      className="text-white bg-blue-500 text-[11px] p-1 rounded"
                    >
                      Follow
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {location.pathname === "/" && (
            <div className="lg:hidden flex items-center justify-center fixed bottom-0 z-50">
              <div className="w-screen">
                {profile?.user.isProfileComplete ? (
                  <div className="flex gap-4 p-3 bg-black">
                    <div className="flex items-center gap-2">
                      <Link to={`/`}>
                        <i class="ri-home-5-line text-3xl font-semibold text-white"></i>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/search`}>
                        <i class="ri-search-line text-3xl font-semibold text-white"></i>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/create`}>
                        <i class="ri-add-box-line text-3xl font-semibold text-white"></i>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link onClick={logout}>
                        <i class="ri-logout-box-line text-3xl text-gray-500 font-semibold"></i>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/user/profile`}>
                        <img
                          className="w-[32px] h-[32px] rounded-full border outline object-cover font-semibold"
                          src={profile?.user.profile.avatar}
                          alt=""
                        />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>{/* <Link to={`/users/signup`}>Signup</Link> */}</div>
                )}
              </div>
              <div ref={iconRef} className="fixed bottom-2 right-2">
                <div onClick={showSettings}>
                  {toggleMenu ? (
                    <p className="flex items-center gap-3 hover:cursor-pointer text-white">
                      {" "}
                      <i className="ri-close-line text-3xl "></i>
                    </p>
                  ) : (
                    <p className="flex items-center gap-3 hover:cursor-pointer text-white">
                      {" "}
                      <i className="ri-menu-line text-3xl"></i>
                    </p>
                  )}
                </div>
                <div
                  className={`absolute flex right-2 bottom-16 `}
                  ref={divRef}
                >
                  {toggleMenu && (
                    <div className=" w-[230px] border border-gray-700 flex flex-col items-center p-4 shadow-xl rounded z-50">
                      <p className="font-semibold mb-2 text-black">
                        {toggle ? "Black Theme" : "White Theme"}
                      </p>

                      <div
                        onClick={changeColor}
                        className="w-[60px] md:w-[70px] h-[34px] md:h-[38px] border border-black p-1 flex items-center justify-start rounded-3xl cursor-pointer relative"
                      >
                        <div
                          ref={move}
                          className="w-5 h-5 md:w-8 md:h-8 bg-black rounded-full absolute transition-all duration-300"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="">
          <MainRouter />
        </div>
      )}
      <ToastContainer autoClose={1500} theme="dark" position="top-center" />
    </div>
  );
};

export default App;

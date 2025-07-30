import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { usercontext } from "../context/Maincontext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useForm } from "react-hook-form";
import axios from "../api/ApiConfig";
import { data, Link, Navigate, useNavigate } from "react-router-dom";

const Home = () => {
  const {
    posts,
    setposts,
    setusers,
    users,
    favPost,
    setfavPost,
    loading,
    setcomments,
    comments,
    stories,
    setstories,
    fetchAllStories,
    fetchAllUsers,
    fetchAllPosts,
    singleUser
  } = useContext(usercontext);

  const [showHeart, setshowHeart] = useState(null);
  const [toggleComment, settoggleComment] = useState(false);
  const [show, setshow] = useState(false);
  const [storyView, setStoryView] = useState(null);
  const [toggleStory, settoggleStory] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [usersId, setusersId] = useState(null)
  const { register, handleSubmit, reset } = useForm();
  const profile = JSON.parse(localStorage.getItem("logged"));
  const navigate = useNavigate();

  const loggedUserId = profile?.user?._id;
  const otherUsers = users?.filter((u) => u._id !== loggedUserId);
  const story = otherUsers?.filter((e) => e.stories.length > 0);


  
  

  const toggleLike = async (postId) => {
    try {
      setshowHeart(postId);
      setTimeout(() => {
        setshowHeart(null);
      }, 600);

      const { data } = await axios.put(
        `/posts/like/${postId}`,
        {},
        { withCredentials: true }
      );
      const updatedPosts = posts?.posts?.map((post) => {
        if (post._id === postId) {
          return { ...post, likes: data.likes };
        }
        return post;
      });

      setposts({ posts: updatedPosts });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };



  const commentHandler = (id) => {
    settoggleComment(toggleComment === id ? null : id);
  };



  const addComment = async (comment, postId) => {
    const { data } = await axios.post(
      "/posts/comment",
      {
        text: comment.comment,
        postId: postId,
        user: profile?.user?.username,
      },
      { withCredentials: true }
    );
    const updatedComments = [...comments, data.addComment];
    setcomments(updatedComments);

    reset();
    settoggleComment(null);
  };



  const removeComment = async (id) => {
    try {
      await axios.delete(`/posts/comment/${id}`, { withCredentials: true });
      const deleted = comments.filter((c) => c._id !== id);
      setcomments(deleted);
    } catch (error) {
      console.log("Not Deleted", error);
    }
  };



  const showme = (id) => {
    setshow(show === id ? null : id);
  };



  const hideRef = useRef(null);
  const divRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hideRef.current &&
        !hideRef.current.contains(event.target) &&
        divRef.current &&
        !divRef.current.contains(event.target)
      ) {
        settoggleComment(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const navigatetoProfile = (id) => {
    if (loggedUserId ===id) {
    navigate(`/user/profile`);
    }else{
      navigate(`/user/profile/${id}`);
    }
  };



  const createStory = () => {
    navigate("/users/story");
  };



  const showStory = (id) => {
    const story = stories?.find((f) => f._id === id);
    const selectedUser = story?.stories?.map((f) => f.image);

    if (selectedUser && selectedUser.length > 0) {
      setStoryView(selectedUser);
      settoggleStory(true);
      setcurrentIndex(currentIndex);
      setusersId(id)
    }
    if (loggedUserId === (!selectedUser && !selectedUser.length > 0)) {
      navigate("/user/story");
    }
  };


  useEffect(() => {
    if (!toggleStory || !storyView || storyView.length === 0) return;

    const timer = setTimeout(() => {
      if (currentIndex < storyView.length - 1) {
        setcurrentIndex((prev) => prev + 1);
      } else {
        settoggleStory(false);
        setStoryView(null);
        setcurrentIndex(0);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, toggleStory, storyView]);


  useEffect(() => {
    fetchAllStories();
    fetchAllUsers();
    fetchAllPosts();
  }, []);


  const removeStory = async(imageUrl) => {
    try {
    const { data } = await axios.put("/users/story/delete", {
      image: imageUrl,
    }, {
      withCredentials: true
    });
    setStoryView(data);
  } catch (error) {
    console.error("Failed to delete story:", error);
  }
  };

const myId= singleUser?._id
const followerIds = singleUser?.followers || [];

const visiblePosts = posts?.posts?.filter(post =>
  post?.createdBy?._id === myId || followerIds?.includes(post?.createdBy?._id)
);


  return (
    <div
      onClick={() => {
        if (currentIndex < storyView.length - 1) {
          setcurrentIndex((prev) => prev + 1);
        } else {
          settoggleStory(false);
          setStoryView(null);
          setcurrentIndex(0);
        }
      }}
      className=" h-auto flex flex-col lg:gap-0 items-center lg:p-5 p-3 font-[montserrat] lg:w-full w-screen lg:mt-0 lg:mb-0 mb-14"
    >
      {toggleStory && storyView.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col gap-3 justify-center items-center transition-all duration-300">
          <div className="relative lg:w-[270px] lg:h-[390px] w-full h-1/2 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center lg:border-2 lg:border-white lg:p-0 p-5">
            <img
              src={storyView[currentIndex]}
              alt={`story-${currentIndex}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => {
                settoggleStory(false);
                setStoryView([]);
                setcurrentIndex(0);
              }}
              className="absolute lg:top-2 right-3 -top-1 text-white text-2xl"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
          {usersId===loggedUserId && (
            <Link
              onClick={()=>removeStory(storyView[currentIndex])}
              className="text-blue-500 text-sm font-[montserrat] font-semibold"
            >
              Remove Story
            </Link>
          )}
        </div>
      )}

      <div className="w-full p-3 lg:p-2 rounded-xl font-[poppins] border">
        <Swiper
          spaceBetween={2}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 7 },
            1280: { slidesPerView: 8 },
          }}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          style={{ "--swiper-navigation-size": "30px" }}
        >
          {/* Your Story */}
          {profile?.user && (
            <SwiperSlide key="my-story">
              <div className="flex flex-col items-center text-center gap-1 p-1">
                <div className="relative">
                  <img
                    onClick={() => showStory(profile?.user?._id)}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-full ring-4 ring-white object-cover object-top cursor-pointer border border-black"
                    src={profile.user?.profile?.avatar}
                    alt="Your Story"
                  />
                  <i
                    onClick={createStory}
                    className="ri-add-circle-fill text-xl md:text-2xl absolute -bottom-1 -right-1 cursor-pointer text-black bg-white rounded-full"
                  ></i>
                </div>
                <p className="text-[11px] md:text-sm truncate w-20">
                  Your Story
                </p>
              </div>
            </SwiperSlide>
          )}

          {/* Other Stories */}
          {story?.map((u,i) => (
            <SwiperSlide key={u._id}>
              <div className="flex flex-col items-center text-center gap-1 p-1">
                <img
                  onClick={() => showStory(u._id)}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full ring-2 ring-white object-cover object-top cursor-pointer border border-orange-500"
                  src={u?.profile?.avatar}
                  alt={u?.profile?.fullName}
                />
                <p className="text-[11px] md:text-sm text-white truncate w-20">
                  {u?.profile?.fullName}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="w-full flex flex-col gap-5">
        {visiblePosts?.length>0 ?visiblePosts?.map((p) =>(
          <div
            key={p._id}
            className=" border border-gray-600 flex flex-col lg:gap-2 items-start rounded-lg p-3"
          >
            <div className="flex items-center gap-4 p-2">
              <img
                onClick={() => navigatetoProfile(p.createdBy?._id)}
                className="w-12 h-12 rounded-full"
                src={p?.createdBy?.profile?.avatar}
                alt=""
              />
              <div>
                <h2 className="text-whit lg:text-2xl text-[18px] font-semibold">
                  {p?.createdBy?.username}
                </h2>
                <p className=" font-light font-[roboto condensed] lg:text-xl text-[14px] flex items-center gap-1">
                  <i className="ri-map-pin-fill text-green-600 lg:text-xl text-lg"></i>
                  {p?.createdBy?.profile?.location}
                </p>
              </div>
            </div>

            <div
              className="relative w-full"
              onDoubleClick={() => toggleLike(p._id)}
            >
              <img
                className="w-full  h-[400px] lg:object-contain object-fill"
                src={p.post}
                alt=""
              />
              {showHeart === p._id && (
                <div className="absolute inset-0 flex justify-center items-center  ">
                  {" "}
                  <i className="ri-heart-fill text-7xl opacity-80 scale-150 transition-all animate-fade"></i>
                </div>
              )}
            </div>
            <div className="lg:px-3 px-2">
              <p className="">{p.caption}</p>
            </div>

            <div className="px-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <p className="">{p.likes?.length || 0}</p>
                {p.likes?.includes(loggedUserId) ? (
                  <i
                    onClick={() => toggleLike(p._id)}
                    className="ri-heart-3-fill text-red-500 text-2xl"
                  ></i>
                ) : (
                  <i
                    onClick={() => toggleLike(p._id)}
                    className="ri-heart-3-line text-whit text-2xl"
                  ></i>
                )}
              </div>

              <div className="flex items-center gap-1" ref={hideRef}>
                <p className="">
                  {comments?.filter((c) => c.postId === p._id).length || 0}
                </p>
                {toggleComment === p._id ? (
                  <form
                    ref={divRef}
                    className="flex items-center gap-1"
                    action=""
                    onSubmit={handleSubmit((data) => addComment(data, p._id))}
                  >
                    <input
                      className="text-sm p-1 lg:w-full w-1/2 text-black"
                      {...register("comment")}
                      placeholder="Comment..."
                      type="text"
                    />
                    <button className=" text-center">
                      <i class="ri-send-plane-fill text-[20px]  text-blue-800"></i>
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center">
                    <i
                      onClick={() => commentHandler(p._id)}
                      className="ri-chat-1-line text-2xl"
                    ></i>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col px-3">
              {comments
                ?.filter((e) => e.postId === p._id)
                .map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center lg:gap-4 gap-2 justify-between"
                  >
                    {show && (
                      <>
                        <p className=" font-[roboto condensed] lg:text-[13px] text-[11px]">
                          <strong className="font-semibold lg:text-[14px] font-[montserrat] text-[10px]">
                            {c.user}-
                          </strong>{" "}
                          {c.text}
                        </p>
                        <div className="flex items-center">
                          <button
                            className=""
                            onClick={() => removeComment(c._id)}
                          >
                            <i class="ri-delete-bin-5-line lg:text-[15px] text-[9px]  bg-blue-800 text-white p-1 rounded-full"></i>
                          </button>
                        </div>
                      </>
                    )}
                    {}
                  </div>
                ))}

              <button
                className="text-blue-500 text-sm font-semibold"
                onClick={() => showme(p._id)}
              >
                {show === p._id ? "Less" : "More"}
              </button>
            </div>
          </div>
        )):<p>No posts from you or people you follow yet.</p>}
      </div>
    </div>
  );
};

export default Home;

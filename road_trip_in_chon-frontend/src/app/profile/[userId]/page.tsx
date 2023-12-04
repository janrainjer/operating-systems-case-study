"use client";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUser, deleteUser } from "../../../store/slice/userSlice";
import { IUser } from "../../../types/User";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPenToSquare,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import EditUserModal from "../../../components/EditUserModal";
import EditPasswordModal from "@/components/EditPasswordModal";
import EditUserImg from "@/components/EditUserImg";
import { ICommentInfo } from "../../../types/Comment";
import { IAllBlog } from "../../../types/Blog";
import CommentBox from "@/components/CommentBox";
import LocationBox from "@/components/LocationBox";
import Link from "next/link";

type jwtType = {
  userId: string;
};

export default function Profile({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const { data: user, status } = useSession();
  const searchParams = useSearchParams();
  const userInfo: IUser | null = useAppSelector((state) => state.user.user);
  const [fetchUser, setFetchUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<number>(1);
  const [isMe, setIsMe] = useState<boolean>(false);
  const [showEditUser, setShowEditUser] = useState<boolean>(false);
  const [showEditImg, setShowEditImg] = useState<boolean>(false);
  const [showEditPassword, setShowEditPassword] = useState<boolean>(false);
  const [review, setReview] = useState<ICommentInfo[] | null>(null);
  const [bookmark, setBookmark] = useState<IAllBlog[] | null>(null);
  const state = searchParams.get("state");

  const getUserById = async (id: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/${id}`
    );
    if (res.status == 500) {
      alert("kuy");
    }
    setFetchUser(res.data);
    setLoading(true);
  };

  useEffect(() => {
    if (status === "unauthenticated" && user == null) {
      getUserById(userId);
    } else if (
      status === "authenticated" &&
      user != null &&
      userId != jwt_decode<jwtType>(user.accessToken).userId
    ) {
      getUserById(userId);
    } else if (
      status === "authenticated" &&
      user != null &&
      userId == jwt_decode<jwtType>(user.accessToken).userId
    ) {
      setIsMe(true);
      setFetchUser(userInfo);
      setLoading(true);
    }
    getBookmarkByUserId(userId);
    getReviewByUserId(userId);
    if (state != null) {
      setContent(parseInt(state));
    }
  }, [status]);

  const getReviewByUserId = async (id: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/review/get/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    setReview(res.data);
    console.log("review : ", res.data);
  };

  const getBookmarkByUserId = async (id: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/get/bookmark/${id}`
    );
    setBookmark(res.data);
    console.log("bookmark : ", res.data);
  };

  return loading && fetchUser != null ? (
    <div className="pt-24 w-full font-karnit max-w-screen-2xl mx-auto">
      <div className="w-full bg-[url('https://cdn.pic.in.th/file/picinth/bgdcca7009fd1b7f73.png')] h-96 bg-center bg-no-repeat bg-cover relative mx-auto mb-32">
        <div className="absolute bottom-[-115px] left-1/2 translate-x-[-50%] flex flex-col items-center">
          <div className="relative">
            <Image
              alt=""
              src={fetchUser?.profile}
              width={0}
              height={0}
              sizes="100vw"
              className="w-48 h-48 rounded-full"
            ></Image>
            {isMe ? (
              <div
                className="absolute bottom-4 right-4 bg-red-400 w-10 h-10 flex justify-center items-center rounded-full cursor-pointer"
                onClick={() => setShowEditImg(true)}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  style={{ color: "#000000" }}
                  size="xl"
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-xl">{fetchUser.name}</h1>
            <p className="text-sm">{fetchUser.email}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-evenly border-y-2 py-4">
        <div onClick={() => setContent(1)} className="cursor-pointer">
          <h1
            className={`${
              content === 1 ? "border-b-2 border-[#276968] border-solid" : ""
            }`}
          >
            Account
          </h1>
        </div>
        <div className="border-l-2"></div>
        <div onClick={() => setContent(2)} className="cursor-pointer">
          <h1
            className={`${
              content === 2 ? "border-b-2 border-[#276968] border-solid" : ""
            }`}
          >
            Review
          </h1>
        </div>
        <div className="border-r-2"></div>
        <div onClick={() => setContent(3)} className="cursor-pointer">
          <h1
            className={`${
              content === 3 ? "border-b-2 border-[#276968] border-solid" : ""
            }`}
          >
            Bookmark
          </h1>
        </div>
      </div>
      <div className={`${content === 1 ? "block" : "hidden"}`}>
        <div className="flex flex-col mr-auto p-8 rounded-lg w-5/6 mx-auto mb-16 border-2 border-[#276968] bg-gray-100 mt-5">
          <div>
            <p className="text-gray-500 mb-1 text-sm">Name</p>
            <p className="text-lg mb-4">{fetchUser.name}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1 text-sm">Email</p>
            <p className="text-lg mb-4">{fetchUser.email}</p>
          </div>
          <div className={`${isMe && fetchUser.accountType === "normal" ? "block" : "hidden"} mb-4`}>
            <p className="text-gray-500 mb-1 text-sm">Password</p>
            <div
              className="p-2 bg-inherit border-[#276968] rounded-xl flex border-2 cursor-pointer w-fit"
              onClick={() => setShowEditPassword(true)}
            >
              <FontAwesomeIcon
                icon={faLock}
                style={{ color: "#276968" }}
                size="lg"
              />
              <h1 className="text-[#276968] ml-2">Change Password</h1>
            </div>
          </div>
          <div>
            <p className="text-gray-500 mb-1 text-sm">Bio</p>
            {userInfo?.bio === "" || userInfo?.bio == null ? (
              <p className="text-gray-500 rounded-lg indent-10">
                เพิ่ม Bio ของคุณ
              </p>
            ) : (
              <p className="rounded-lg indent-10">{userInfo?.bio}</p>
            )}
          </div>
          {isMe ? (
            <div className="w-full flex justify-center mt-5">
              <div
                className="py-3 px-5 bg-inherit border-[#276968] rounded-xl flex border-2 cursor-pointer"
                onClick={() => setShowEditUser(true)}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{ color: "#276968" }}
                  size="lg"
                />
                <h1 className="text-[#276968] ml-2">Edit</h1>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={`${content === 2 ? "block" : "hidden"} p-4`}>
        {review && review.length > 0
          ? review.map((element: ICommentInfo, key: any) => {
              return (
                <CommentBox commentInfo={element} canEdit={isMe} key={key} />
              );
            })
          : <div className="flex w-full justify-center items-center h-72">
              <h1>ไม่มีรีวิวสถานที่ท่องเที่ยว....</h1>
            </div>}
      </div>
      <div
        className={`${
          content === 3 ? "block" : "hidden"
        } lg:w-full w-[95%] mx-auto flex flex-wrap`}
      >
        {bookmark && bookmark.length > 0
          ? bookmark.map((element: IAllBlog, key: any) => {
              return (
                <div key={key} className="my-5 lg:w-[50%] w-full lg:p-4">
                  <Link href={`/location/${element._id}`}>
                    <LocationBox blogInfo={element} />
                  </Link>
                </div>
              );
            })
          : <div className="flex w-full justify-center items-center h-72">
          <h1>ไม่มีสถานที่ท่องเที่ยวที่บันทึกไว้....</h1>
        </div>}
      </div>
      <main></main>
      {showEditUser && userInfo != null ? (
        <EditUserModal userInfo={userInfo} setShow={setShowEditUser} />
      ) : (
        ""
      )}
      {showEditImg && userInfo != null ? (
        <EditUserImg userInfo={userInfo} setShow={setShowEditImg} />
      ) : (
        ""
      )}
      {showEditPassword && userInfo != null ? (
        <EditPasswordModal userInfo={userInfo} setShow={setShowEditPassword} />
      ) : (
        ""
      )}
    </div>
  ) : null;
}

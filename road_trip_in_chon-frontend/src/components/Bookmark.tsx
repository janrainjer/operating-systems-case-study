"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import { IUser } from "../types/User";
import axios from "axios";
import { setUser } from "../store/slice/userSlice";

export default function Bookmark({ blogID }: { blogID: string }) {
  const { data: user, status } = useSession();
  const dispacth = useAppDispatch();
  const userInfo: IUser | null = useAppSelector((state) => state.user.user);
  const { push } = useRouter();
  const [checkBookmark, setCheckBookMark] = useState<boolean>(false);

  const handleClick = async () => {
    if (status === "authenticated") {
      if (checkBookmark == true) {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND}/users/delete-bookmark/${blogID}`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );
        if (res.status === 200) {
          const updateUser = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND}/users/user/me`,
            {
              headers: {
                Authorization: `Bearer ${user?.accessToken}`,
              },
            }
          );
          dispacth(setUser(updateUser.data));
        }
      } else if (checkBookmark == false) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND}/users/add-bookmark/${blogID}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );
        if (res.status === 201) {
          const updateUser = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND}/users/user/me`,
            {
              headers: {
                Authorization: `Bearer ${user?.accessToken}`,
              },
            }
          );
          dispacth(setUser(updateUser.data));
        }
      }
      return setCheckBookMark(!checkBookmark);
    }
    push("/signin");
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.bookmark.includes(blogID)) {
        return setCheckBookMark(true);
      }
      return setCheckBookMark(false);
    }
    return setCheckBookMark(false);
  }, []);

  const isBookmark = useMemo(() => {
    if (checkBookmark) {
      return (
        <div className="bg-[#276968] items-center text-white rounded-xl p-2 cursor-pointer">
          <FontAwesomeIcon icon={faBookmark} style={{ color: "#ffffff" }} />{" "}
          บันทึกแล้ว
        </div>
      );
    }
    return (
      <div className="bg-[#276968] items-center text-white rounded-xl p-2 cursor-pointer">
        <FontAwesomeIcon icon={farBookmark} style={{ color: "#ffffff" }} />{" "}
        บันทึก
      </div>
    );
  }, [checkBookmark]);

  return <div onClick={handleClick}>{isBookmark}</div>;
}

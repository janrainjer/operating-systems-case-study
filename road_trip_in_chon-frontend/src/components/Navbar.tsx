"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession, signIn, signOut } from "next-auth/react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../app/assets/logo.png";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, deleteUser } from "../store/slice/userSlice";
import { IUser } from "../types/User";
import axios from "axios";
import jwt_decode from "jwt-decode";

const navMenu = [
  {
    title: "Home",
    linkTo: "/",
  },
  {
    title: "Location",
    linkTo: "/location",
  },
  // {
  //   title: "About us",
  //   linkTo: "#aboutus",
  // },
  // {
  //   title: "Contact",
  //   linkTo: "#contact",
  // },
];

type jwtType = {
  userId: string;
};

export default function Navbar() {
  const { data: user, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const dispacth = useAppDispatch();
  const userInfo: IUser | null = useAppSelector((state) => state.user.user);
  const [isProfileToggle, setIsProfileToggle] = useState(false);
  const [isBarsToggle, setIsBarsToggle] = useState(false);

  const fetchUser = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/user/me`,
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );

    dispacth(setUser(res.data));
    console.log(userInfo);
  };

  const handleSignout = () => {
    dispacth(deleteUser());
    signOut();
    setIsBarsToggle(false);
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  return (
    <>
      <div
        className={`${
          pathname === "/signin" || pathname === "/register" ? "hidden" : ""
        } fixed h-20 w-full z-50 top-0 left-0 flex items-center justify-between py-4 lg:px-16 px-8 font-karnit bg-white border-b-2`}
      >
        <div>
          <Link href="/">
            <Image
              alt=""
              src={logo}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full lg:h-auto h-16"
            />
          </Link>
        </div>
        <div className="lg:flex hidden">
          {navMenu.map((val, index) => {
            return (
              <div
                className="xl:mx-8 mx-2 text-[#276968] text-lg hover:bg-[#276968] p-2 rounded-xl hover:text-white duration-300"
                key={index}
              >
                <Link href={val.linkTo}>{val.title}</Link>
              </div>
            );
          })}
        </div>
        <div className="lg:block hidden">
          {status != null && status === "authenticated" && userInfo != null ? (
            <div className="flex">
              <Link
                className="flex items-center p-2 border-2 rounded-xl cursor-pointer"
                href={{
                  pathname: `/profile/${
                    jwt_decode<jwtType>(user.accessToken).userId
                  }`,
                  query: { state: "3" },
                }}
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  style={{ color: "#276968" }}
                  className="text-xl"
                />
                <h1 className="ml-3">Bookmark</h1>
              </Link>
              <div className="border-l-2 mx-5"></div>
              <div
                className="flex items-center w-36 whitespace-nowrap overflow-hidden p-2 border-2 rounded-xl cursor-pointer relative"
                onClick={() => setIsProfileToggle(!isProfileToggle)}
              >
                {userInfo?.profile ? (
                  <Image
                    alt=""
                    src={userInfo.profile}
                    width={30}
                    height={30}
                    sizes="100vw"
                    className=" rounded-[50%]"
                  />
                ) : (
                  ""
                )}
                <h1 className="ml-3">{userInfo?.name}</h1>
              </div>
              <div
                className={`absolute  right-16  z-0 bg-gray-200 px-8 py-4 rounded ${
                  isProfileToggle ? "top-20" : "top-[-400px]"
                }`}
              >
                <ul className="space-y-3">
                  <li
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/profile/${
                          jwt_decode<jwtType>(user.accessToken).userId
                        }`
                      );
                      setIsProfileToggle(false);
                    }}
                  >
                    บัญชีของฉัน
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => handleSignout()}
                  >
                    ออกจากระบบ
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div onClick={() => signIn()} className="cursor-pointer text-[#276968]">
              <h1>Signin</h1>
            </div>
          )}
        </div>
        <div
          className="lg:hidden block cursor-pointer"
          onClick={() => setIsBarsToggle(!isBarsToggle)}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
      <div
        className={`fixed bg-[#276968] w-full lg:hidden rounded-b-xl h-fit z-40 duration-500 transition-all font-karnit  ${
          isBarsToggle ? "top-20" : "top-[-400px]"
        }`}
      >
        <div className="flex flex-col items-center">
          {navMenu.map((val, index) => {
            return (
              <div className="text-white text-lg my-3" key={index}>
                <Link href={val.linkTo} onClick={() => setIsBarsToggle(false)}>
                  {val.title}
                </Link>
              </div>
            );
          })}
          {status != null && status === "authenticated" && user != null ? (
            <>
              <div className="text-white text-lg my-3">
                <Link href={{
                  pathname: `/profile/${
                    jwt_decode<jwtType>(user.accessToken).userId
                  }`,
                  query: { state: "3" },
                }} onClick={() => setIsBarsToggle(false)}>
                  Bookmark
                </Link>
              </div>
              <div className="text-white text-lg my-3">
                <Link
                  href={`/profile/${
                    jwt_decode<jwtType>(user.accessToken).userId
                  }`}
                  onClick={() => setIsBarsToggle(false)}
                >
                  บัญชีของฉัน
                </Link>
              </div>
              <div
                className="text-white text-lg my-3"
                onClick={() => handleSignout()}
              >
                <h1>ออกจากระบบ</h1>
              </div>
            </>
          ) : (
            <div className="text-white text-lg my-3" onClick={() => signIn()}>
              <h1>Signin</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

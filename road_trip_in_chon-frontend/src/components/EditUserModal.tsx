"use client";
import React, { useEffect, useState } from "react";
import { IUser } from "../types/User";
import Swal from "sweetalert2";
import axios from "axios";
// import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, deleteUser } from "../store/slice/userSlice";
import { useSession, signIn, signOut } from "next-auth/react";

interface IEditUserModal {
  userInfo: IUser;
  setShow: (show: boolean) => void;
}

export default function EditUserModal({ userInfo, setShow }: IEditUserModal) {
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();
  const dispacth = useAppDispatch();
  const { data: user, status } = useSession();

  // const setUserInfo = async()=>{
  //     await
  // }

  useEffect(() => {
    setName(userInfo.name);
    setBio(userInfo.bio);
    setLoading(true);
  }, []);

  const handleShow = () => {
    setShow(false);
  };

  const updateUserInfo = async () => {
    console.log(name,bio)
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/update/name-bio/${userInfo._id}`,
      {
        name: name,
        bio: bio,
      }
    );
  };

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
  };

  const handleUpdateInfo = async () => {
    Swal.fire({
      title: "บันทึกแก้ไขข้อมูล",
      confirmButtonText: "บันทึก",
      confirmButtonColor: "#276968",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#276968",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserInfo().then((e) => {
          Swal.fire("Saved!", "", "success").then(async (res) => {
            if (res.isConfirmed == true)
              await fetchUser().then((res) => {
                window.location.reload()
              });
          });
        });
      }
    });
  };

  return loading ? (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-50">
      <div className="max-w-screen-xl h-fit sm:w-[70%] lg:[50%] w-[90%] gap-1 bg-white p-6 overflow-hidden rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="px-5 py-2 bg-[#276968] text-white w-fit rounded-xl">
            <h2>แก้ไขข้อมูล</h2>
          </div>
          <div
            className="w-8 h-8 bg-[#276968] text-white rounded-[50%] flex justify-center items-center cursor-pointer"
            onClick={() => handleShow()}
          >
            <h2>X</h2>
          </div>
        </div>
        <div className="my-5">
          <div className="my-2">
            <h1>Name</h1>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border-2 border-[#276968] w-full rounded-lg indent-2 my-2"
            />
          </div>
          <div className="my-2">
            <h1>Bio</h1>
            <textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border-2 border-[#276968] w-full rounded-lg indent-2 my-2"
            ></textarea>
          </div>
        </div>
        <div className="w-full flex justify-evenly">
          <div className="py-3 px-5 rounded-xl flex border-2 cursor-pointer bg-[#276968] text-white" onClick={()=>handleUpdateInfo()}>
            <h1>บันทึก</h1>
          </div>
          <div
            className="py-3 px-5 rounded-xl flex border-2 cursor-pointer bg-[#276968] text-white"
            onClick={() => handleShow()}
          >
            <h1>ยกเลิก</h1>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

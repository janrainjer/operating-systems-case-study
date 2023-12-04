"use client";
import React, { useEffect, useState, useRef } from "react";
import { IUser } from "../types/User";
import Swal from "sweetalert2";
import axios from "axios";
// import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, deleteUser } from "../store/slice/userSlice";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

interface IEditUserModal {
  userInfo: IUser;
  setShow: (show: boolean) => void;
}

export default function EditUserImg({ userInfo, setShow }: IEditUserModal) {
  const [loading, setLoading] = useState<boolean>(false);
  //   const router = useRouter();
  const dispacth = useAppDispatch();
  const { data: user, status } = useSession();
  const [uploadImages, setUploadImages] = useState<File | null>(null);
  const addImage = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
  }, []);

  const handleShow = () => {
    setShow(false);
  };

  const handleUploadImageClick = () => {
    if (addImage.current !== null) {
      addImage.current.click();
    }
  };

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files != null) {
      setUploadImages(event.target.files[0]);
    }
  };

    const updateUserImg = async () => {
      if(uploadImages !=null){
        const formData = new FormData();
      formData.append(`image`, uploadImages)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/upload/image`,formData,{
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      console.log(res)
      }
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

  const handleUpdateImg = async () => {
    if(uploadImages!=null){
      Swal.fire({
        title: "บันทึกแก้ไขภาพโปรไฟล์",
        confirmButtonText: "บันทึก",
        confirmButtonColor: "#276968",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        cancelButtonColor: "#276968",
      }).then((result) => {
          if (result.isConfirmed) {
            updateUserImg().then((e) => {
              Swal.fire("Saved!", "", "success").then(async (res) => {
                if (res.isConfirmed == true)
                  await fetchUser().then((res) => {
                    window.location.reload()
                  });
              });
            });
          }
      });
    }else{
      Swal.fire({
        icon: "error",
        title: "กรุณาอัพโหลดรูปภาพ",
      });
    }
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-50">
      <div className="max-w-screen-xl h-fit w-[300px] gap-1 bg-white p-6 overflow-hidden rounded-xl">
        <div className="flex justify-center items-center mb-3">
          <div className="px-5 py-2 bg-[#276968] text-white w-fit rounded-xl">
            <h2>แก้ไขภาพโปรไฟล์</h2>
          </div>
        </div>
        <div className="p-2 w-full flex justify-center items-center">
          {uploadImages != null ? (
           <div className="relative">
             <div
            className="absolute top-3 right-3 w-8 h-8 rounded-[50%] bg-red-400 z-50 flex justify-center items-center text-white cursor-pointer"
            onClick={() =>setUploadImages(null)}
          >
            X
          </div>
            <Image
              src={URL.createObjectURL(uploadImages)}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-48 h-48 rounded-full"
            ></Image>
           </div>
          ) : (
            ""
          )}
          {uploadImages == null ? <div
            className="flex items-center flex-col justify-center w-48 h-48 rounded-full bg-[#E1DFDF] cursor-pointer"
            onClick={handleUploadImageClick}
          >
            <h1>+</h1>
            <h1>เพิ่มรูปรูปภาพ</h1>
          </div>
          :""}
          <input
            type="file"
            onChange={handleUploadImage}
            className="hidden"
            ref={addImage}
          />
        </div>
        <div className="w-full flex justify-evenly">
          <div className="py-3 px-7 rounded-xl flex border-2 cursor-pointer bg-[#276968] text-white" onClick={()=>handleUpdateImg()}>
            <h1>บันทึก</h1>
          </div>
          <div
            className="py-3 px-7 rounded-xl flex border-2 cursor-pointer bg-[#276968] text-white"
            onClick={() => handleShow()}
          >
            <h1>ยกเลิก</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

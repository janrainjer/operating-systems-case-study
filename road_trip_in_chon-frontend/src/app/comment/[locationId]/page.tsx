"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import LocationBox from "../../../components/LocationBox";
import Rating from "../../../components/Rating";
import { IAllBlog, IBlog } from "../../../types/Blog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";

interface IUserComment {
  rating: number;
  title: string;
  description: string;
  recommendActivity: string;
  spendTime: string;
}

export default function CommentPage({
  params: { locationId },
}: {
  params: { locationId: string };
}) {
  const { data: user, status } = useSession();
  const router = useRouter();
  const addImage = useRef<HTMLInputElement>(null);
  const [blog, setBlog] = useState<IAllBlog | null>(null);
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [comment, setComment] = useState<IUserComment>({
    rating: 0,
    title: "",
    description: "",
    recommendActivity: "",
    spendTime: "",
  });
  const [count, setCount] = useState({
    title: 0,
    description: 0,
    recommendActivity: 0,
    spendTime: 0,
  });
  console.log("oot");

  if (status === "unauthenticated") {
    redirect("/signin");
  }

  const inputValue =
    (name: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event?.target != null) {
        setComment({ ...comment, [name]: event.target.value });
        setCount({ ...count, [name]: event.target.value.length });
      }
    };

  const setVote = (vote: number) => {
    setComment({ ...comment, rating: vote });
  };

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files != null) {
      setUploadImages([...uploadImages, event.target.files[0]]);
    }
  };

  const handleUploadImageClick = () => {
    if (uploadImages.length < 10) {
      if (addImage.current !== null) {
        addImage.current.click();
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "อัพโหลดได้ไม่เกิน 10 รูป",
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    setUploadImages((prevState: File[]) => {
      return prevState.filter((_, i) => i != index);
    });
  };

  const checkContentLength = () => {
    if (
      count.description > 700 || count.description == 0 || 
      count.recommendActivity > 40 || count.recommendActivity == 0 ||
      count.spendTime > 40 ||  count.spendTime ==0 ||
        count.title > 80 || count.title ==0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const saveReview = async () => {
    const formData = new FormData();
    for (let i = 0; i < uploadImages.length; i++) {
      formData.append(`images`, uploadImages[i]);
    }
    formData.append("blogId", locationId);
    formData.append("title", comment.title);
    formData.append("description", comment.description);
    formData.append("recommendActivity", comment.recommendActivity);
    formData.append("spendTime", comment.spendTime);
    formData.append("rating", String(comment.rating));
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/review`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
  };

  const handleSaveReview = () => {
    if (comment.rating == 0) {
      Swal.fire({
        icon: "error",
        title: "กรุณาใส่เรตติ้ง",
      });
    } else if (checkContentLength()) {
      Swal.fire({
        title: "บันทึกรีวิวสถานที่ท่องเที่ยวนี้",
        confirmButtonText: "บันทึก",
        confirmButtonColor: "#276968",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        cancelButtonColor: "#276968",
      }).then((result) => {
        if (result.isConfirmed) {
          saveReview().then((e) => {
            Swal.fire("Saved!", "", "success").then((res) => {
              if (res.isConfirmed == true) router.back();
            });
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "ตัวอักษรเกินกว่าที่กำหนด หรือไม่มีตัวอักษร",
      });
    }
  };

  const fetchLocation = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/blogs/brief/${locationId}`
    );
    setBlog(res.data);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="pt-24 max-w-screen-xl w-full mx-auto font-karnit">
      <div className="w-[95%] mx-auto">
        <LocationBox blogInfo={blog} />
      </div>
      <div className="flex flex-col items-center justify-center my-6">
        <h1>ให้คะแนนสถานที่</h1>
        <Rating
          rating={comment.rating}
          vote={true}
          setVote={setVote}
          size="text-2xl"
          mx="mx-4"
        />
      </div>
      <div className="my-2 bg-[#F8F8F8] sm:px-6 px-3 py-2 rounded-xl w-[95%] mx-auto">
        <div className="my-5">
          <div className="my-2">
            <h1>เขียนรีวิว</h1>
          </div>
          <div className="border-b-2 border-[#D9D9D9] w-full my-2"></div>
        </div>
        <div className="my-5">
          <div className="flex justify-between my-2">
            <h2>หัวเรื่องรีวิว</h2>
            <p
              className={`${count.title > 80 ? "text-red-700" : "text-black"}`}
            >
              {count.title} / 80
            </p>
          </div>
          <input
            type="text"
            value={comment.title}
            onChange={inputValue("title")}
            className="w-full border-2 rounded-lg h-10 bg-inherit indent-2.5"
          />
        </div>
        <div className="my-5">
          <div className="flex justify-between my-2">
            <h2>รายละเอียดรีวิว</h2>
            <p
              className={`${
                count.description > 700 ? "text-red-700" : "text-black"
              }`}
            >
              {count.description} / 700
            </p>
          </div>
          <textarea
            rows={5}
            value={comment.description}
            onChange={inputValue("description")}
            className="w-full border-2 rounded-lg indent-2.5"
          />
        </div>
        <div className="my-5">
          <div className="flex justify-between my-2 ">
            <h2>กิจกรรมแนะนำ</h2>
            <p
              className={`${
                count.recommendActivity > 40 ? "text-red-700" : "text-black"
              }`}
            >
              {count.recommendActivity} / 40
            </p>
          </div>
          <input
            type="text"
            value={comment.recommendActivity}
            onChange={inputValue("recommendActivity")}
            className="w-full border-2 rounded-lg h-10 bg-inherit indent-2.5"
          />
        </div>
        <div className="my-5">
          <div className="flex justify-between my-2">
            <h2>ระยะเวลาที่ใช้กับสถานที่นี้</h2>
            <p
              className={`${
                count.spendTime > 40 ? "text-red-700" : "text-black"
              }`}
            >
              {count.spendTime} / 40
            </p>
          </div>
          <input
            type="text"
            value={comment.spendTime}
            onChange={inputValue("spendTime")}
            className="w-full border-2 rounded-lg h-10 bg-inherit indent-2.5"
          />
        </div>
      </div>
      <div className="my-5 bg-[#F8F8F8] sm:px-6 px-3 py-2 w-[95%] mx-auto rounded-xl">
        <div className="mb-5">
          <div className="my-2">
            <h1>เพิ่มรูปรูปภาพ</h1>
          </div>
          <div className="border-b-2 border-[#D9D9D9] w-full my-2"></div>
        </div>
        <div className="w-full flex flex-wrap">
          {uploadImages.length
            ? uploadImages.map((img, index) => {
                return (
                  <div
                    key={index}
                    className="w-[50%] md:w-[25%] lg:w-[20%] h-36 md:h-48 lg:h-64 p-2"
                  >
                    <div className="relative w-full h-full">
                      <div
                        className=" absolute top-3 right-3 w-8 h-8 rounded-[50%] bg-red-400 z-40 flex justify-center items-center text-white cursor-pointer"
                        onClick={() => handleDeleteImage(index)}
                      >
                        X
                      </div>
                      <Image
                        src={URL.createObjectURL(img)}
                        alt=""
                        sizes="100vw"
                        fill
                        className="rounded-xl"
                      ></Image>
                    </div>
                  </div>
                );
              })
            : ""}
          <div className="w-[50%] md:w-[25%] lg:w-[20%] h-36 md:h-48 lg:h-64 p-2">
            <div
              className="flex items-center flex-col justify-center w-full h-full bg-[#E1DFDF] rounded-xl cursor-pointer"
              onClick={handleUploadImageClick}
            >
              <h1>+</h1>
              <h1>เพิ่มรูปรูปภาพ</h1>
            </div>
            <input
              type="file"
              onChange={handleUploadImage}
              className="hidden"
              ref={addImage}
            />
          </div>
        </div>
        <div className="flex items-center my-2">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            style={{ color: "#f0c528" }}
            size="xl"
          />
          <p className="mx-2">อัพโหลดได้ไม่เกิน 10 รูป</p>
        </div>
        <div className="flex justify-evenly my-5">
          <div
            className="py-3 w-[20%] min-w-[120px] flex justify-center items-center bg-[#276968] rounded-xl cursor-pointer text-white"
            onClick={() => handleSaveReview()}
          >
            <h1>บันทึกรีวิว</h1>
          </div>
          <div className="py-3 w-[20%] min-w-[120px] flex justify-center items-center bg-[#276968] rounded-xl cursor-pointer text-white">
            <h1>ยกเลิก</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

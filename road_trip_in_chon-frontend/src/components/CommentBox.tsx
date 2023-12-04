"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession, signIn, signOut } from "next-auth/react";
import { faBookmark, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import { ICommentInfo } from "@/types/Comment";
import Image from "next/image";
import Rating from "./Rating";
import AllImageModal from "./AllImageModal";
import LikeComment from "./LikeComment";
import Swal from "sweetalert2";
import axios from "axios";

export default function CommentBox({
  commentInfo,
  canEdit,
}: {
  commentInfo: ICommentInfo;
  canEdit: boolean;
}) {
  const { data: user, status } = useSession();
  const router = useRouter();
  const [showImage, setShowImage] = useState(false);

  const handleShowImage = () => {
    setShowImage(true);
  };

  useEffect(() => {
    if (showImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showImage]);

  const handleDeleteComment = async () => {
    Swal.fire({
      title: "ลบรีวิวนี้",
      confirmButtonText: "บันทึก",
      confirmButtonColor: "#276968",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#276968",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(
            `${process.env.NEXT_PUBLIC_BACKEND}/review/${commentInfo.id}`,
            {
              headers: {
                Authorization: `Bearer ${user?.accessToken}`,
              },
            }
          )
          .then((e) => {
            if (e.status == 200) {
              Swal.fire("Saved!", "", "success").then((res) => {
                if (res.isConfirmed == true) window.location.reload();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "ไม่สามารถลบรีวิวนี้ได้",
              });
            }
          });
      }
    });
  };

  const showImg = useMemo(() => {
    if (commentInfo.images.length > 4) {
      const temp = commentInfo.images.slice(0, 5);
      return temp.map((img, key) => {
        return (
          <div className="relative min-w-fit" key={key}>
            {key == 4 ? (
              <div
                className="absolute z-30 bg-black/[0.25] w-full h-full flex justify-center items-center text-white rounded-lg"
                onClick={() => handleShowImage()}
              >
                {commentInfo.images.length - 4}+
              </div>
            ) : (
              ""
            )}
            <Image
              alt=""
              src={img}
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-lg lg:w-56 lg:h-56 md:w-44 md:h-44 w-36 h-36"
            ></Image>
          </div>
        );
      });
    } else if (
      commentInfo.images.length > 0 &&
      commentInfo.images.length <= 5
    ) {
      return commentInfo.images.map((img, key) => {
        return (
          <div className="relative min-w-fit" key={key}>
            <Image
              alt=""
              src={img}
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-lg lg:w-56 lg:h-56 md:w-44 md:h-44 w-36 h-36"
            ></Image>
          </div>
        );
      });
    } else {
      return null;
    }
  }, [commentInfo]);

  return (
    <>
      <div className="w-full my-2 mb-5 bg-[#F8F8F8] p-4 font-karnit rounded-xl">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center mb-2">
            <Image
              alt=""
              src={`${commentInfo.author.profile}`}
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-[50%] mr-2 sm:w-[50px] sm:h-[50px] w-[30px] h-[30px]"
            ></Image>
            <h1 className="sm:text-base text-xs cursor-pointer hover:underline" onClick={()=>router.push(`/profile/${commentInfo.author._id}`)}>{commentInfo.author.name}</h1>
          </div>
          <div className="flex items-center">
            <LikeComment reviewId={commentInfo.id} score={commentInfo.score} />
            {canEdit ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="m-1 cursor-pointer">
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    style={{ color: "#000000" }}
                    size="xl"
                  />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a
                      onClick={() =>
                        router.push(`/editcomment/${commentInfo.id}`)
                      }
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handleDeleteComment()}>Delete</a>
                  </li>
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-center my-2">
          <Rating
            setVote={null}
            rating={commentInfo.rating}
            vote={false}
            size="text-xl"
            mx="mx-1"
          />
        </div>
        <div className="my-2 sm:text-xl text-base">
          <h1>{commentInfo.title}</h1>
        </div>
        <div className="my-2 text-[#8A8A8A] sm:text-base text-xs">
          <p>{commentInfo.description}</p>
        </div>
        <div className="my-2 text-[#8A8A8A] sm:text-base text-xs">
          <h5>กิจกรรมแนะนำ : {commentInfo.recommendActivity}</h5>
        </div>
        <div className="my-2 text-[#8A8A8A] sm:text-base text-xs">
          <h5>ระยะเวลาที่ใช้กับสถาานที่นี้ : {commentInfo.spendTime}</h5>
        </div>
        <div className="w-full md:gap-5 gap-1 flex overflow-x-auto">
          {showImg}
        </div>
      </div>
      {showImage ? (
        <AllImageModal photos={commentInfo.images} setShow={setShowImage} />
      ) : (
        ""
      )}
    </>
  );
}

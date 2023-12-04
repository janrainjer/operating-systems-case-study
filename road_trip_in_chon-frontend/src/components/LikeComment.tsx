"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as farThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setUser } from "../store/slice/userSlice";
import { IUser } from "../types/User";
import { useAppSelector, useAppDispatch } from "../store/hooks";

export default function LikeComment({ reviewId,score }: { reviewId: string,score : number }) {
  const { data: user, status} = useSession();
  const userInfo: IUser | null = useAppSelector((state) => state.user.user);
  const { push } = useRouter();
  const [checkUseful, setCheckUseful] = useState(false);
  const [isLike,setIsLike] = useState(false)
  const dispacth = useAppDispatch()
  const [countScore,setCountScore] =useState<number>(0)

  const handleClick = async() => {
    if (status === "authenticated") {
      if(checkUseful == true){
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/review/dislike/${reviewId}`,null,{
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        })
        if(res.status == 201){
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
      }else if(checkUseful == false){
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/review/like/${reviewId}`,null,{
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        })
        if(res.status == 201){
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
      if(isLike === false && !checkUseful === true){
        setCountScore(countScore+1)
        setIsLike(true)
      }else if(isLike === true && !checkUseful === false){
        setCountScore(countScore-1)
        setIsLike(false)
      }
      return setCheckUseful(!checkUseful);
    }
    push('/signin');
  };

  useEffect(() => {
    setCountScore(score)
    if (userInfo) {
      if (userInfo.likedReview.includes(reviewId)) {
        setIsLike(true)
        return setCheckUseful(true);
      }
      setIsLike(false)
      return setCheckUseful(false);
    }
    setIsLike(false)
    return setCheckUseful(false);
  }, [reviewId]);

  const isUseful = useMemo(() => {
    if (checkUseful) {
      return (
        <div className="items-center p-2 cursor-pointer flex">
          <FontAwesomeIcon icon={faThumbsUp} style={{color: "#e81a54"}}/>
          <p className="text-[#e81a54] mx-2 sm:text-base text-xs">มีประโยชน์ {`(${countScore})`}</p>
        </div>
      );
    }
    return (
      <div className="items-center rounded-xl p-2 cursor-pointer flex sm:text-base text-xs">
        <FontAwesomeIcon icon={farThumbsUp} style={{color: "#000000"}}/>
        <p className="mx-2">มีประโยชน์ {`(${countScore})`}</p>
      </div>
    );
  }, [checkUseful,countScore]);

  return <div onClick={handleClick} className="min-w-fit">{isUseful}</div>;
}

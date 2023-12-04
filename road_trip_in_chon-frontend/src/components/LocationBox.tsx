"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import {
  faLocationPin,
  faStar,
  faCalendarDay,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { IAllBlog} from "../types/Blog";
import Image from "next/image";

export default function LocationBox({
  blogInfo,
}: {
  blogInfo: IAllBlog | null;
}) {
  const [firstImage, setFirstImage] = useState<any>(null);
  const { data: session, status } = useSession();
  const { push } = useRouter();

  return blogInfo != null ? (
    <div className="flex flex-wrap bg-[#F8F8F8] rounded-xl overflow-hidden w-full h-[32] relative font-karnit">
      <div className="md:w-[30%] sm:w-[40%] w-[100%] sm:h-72 h-48 relative">
        {blogInfo.firstImage ? (
          <div className="w-full h-full" style={{ backgroundImage: `url(${blogInfo.firstImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="sm:w-[60%] md:w-[70%] w-full sm:p-5 p-3">
        <p className="sm:text-2xl text-lg line-clamp-1">{blogInfo.title}</p>
        <div className=" border-b-2 border-[#D9D9D9] w-full my-2"></div>
        <div className="flex items-center my-2">
          <FontAwesomeIcon icon={faLocationPin} style={{ color: "#37454D" }} />{" "}
          <p className="text-[#8A8A8A] ml-1 sm:text-base text-sm">{blogInfo.address}</p>
        </div>

        {blogInfo.openTime != null ? (
          <div className="flex my-2">
            {blogInfo.openTime.map((opneTime: any, key: any) => {
              return (
                <div className="mr-2" key={key}>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      style={{ color: "#276968" }}
                    />{" "}
                    <p className="ml-2 sm:text-base text-sm">{opneTime.day}</p>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faClock}
                      style={{ color: "#276968" }}
                    />{" "}
                    <p className="ml-2 sm:text-base text-sm">{opneTime.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}

        <div className="flex items-center my-2">
          <div className="p-1 px-2 flex items-center mr-2 bg-[#FF6F6B] rounded-xl text-white">
            <h4 className="mr-1 sm:text-base text-sm">{blogInfo.rating}</h4>
            <FontAwesomeIcon icon={faStar} style={{ color: "#ffffff" }} />
          </div>
          <p className="sm:text-base text-sm">{blogInfo.reviewLength} รีวิว</p>
        </div>
        <h3 className="text-[#8A8A8A] my-2 sm:text-base text-sm">{blogInfo.category}</h3>
      </div>
    </div>
  ) : (
    <div>null</div>
  );
}

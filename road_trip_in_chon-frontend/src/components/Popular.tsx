import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import CommentUser from "./CommentUser";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { error } from "console";
import { number } from "yup";

interface BlogProps {
  _id: string;
  title: string;
  category: string;
  rating: number;
  reviewLength: number;
  address: string;
  firstImage: string;
}

export default function Popular() {
  const [topBlog, setTopBlog] = useState<BlogProps[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/blogs/top-location`)
      .then((response) => {
        setTopBlog(response.data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className=" flex flex-row flex-wrap gap-4 gap-y-24 md:gap-10 md:gap-y-24 justify-center bg-[#F3F3F3] rounded-3xl p-2 md:p-8 pt-10 pb-28 md:pb-28">
      {topBlog
        .filter((item, index) => index < 9)
        .map((bl) => (
          <Link
            href={`/location/${bl._id}`}
            className="hover:scale-105 transition ease-in-out"
            key={bl._id}
          >
            <div className=" w-32 h-32 md:w-60 md:h-64 rounded-3xl shadow-lg relative">
              <img src={bl.firstImage} className=" rounded-t-3xl h-full" />
              <div className=" bg-slate-400 absolute w-full bottom-0">
                <div className=" absolute -top-6 w-full px-5 bg-white rounded-b-3xl">
                  <h1 className=" font-semibold pt-2 truncate">{bl.title}</h1>
                  <div className="flex flex-row justify-between">
                    <div className=" flex md:flex-row flex-col items-start md:items-center gap-x-2">
                      <div className="flex flex-row items-center bg-[#FF6F6B] p-0.5 text-xs gap-x-0 md:gap-x-1 rounded-md text-white px-2">
                        <h1 className=" font-semibold pr-0.5 text-ellipsis">
                          {bl.rating.toFixed(2)}
                        </h1>
                        <FontAwesomeIcon icon={faStar} />
                      </div>
                      <p className=" opacity-30 text-xs">
                        {bl.reviewLength > 10 ? "10+" : bl.reviewLength} รีวิว
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className=" text-left md:text-center text-xs opacity-30 pb-3 md:pt-2 truncate">
                      {bl.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}

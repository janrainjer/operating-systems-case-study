"use client";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface carouselProps {
  studentId: string;
  name: string;
  role: string;
  pic: string;
  nickname: string;
  x: number;
}

export default function Carousel() {
  const [curr, setCurr] = useState<number>(0);

  const prevFunction = () => {
    var x = curr;
    if (x == 0) {
      setCurr(person.length - 1);
    } else {
      x -= 1;
      setCurr(x);
    }
  };

  const nextFunction = () => {
    var x = curr;
    if (x == person.length - 1) {
      setCurr(0);
    } else {
      x += 1;
      setCurr(x);
    }
  };

  const person = [
    {
      studentId: "64010516",
      name: "ปัณณวิชญ์ วชิรเศรษฐหิรัญ",
      role: '"Devops"',
      pic: "imgProfile/boat.png",
      nickname: "Boat",
    },
    {
      studentId: "64010597",
      name: "พิภูษณะ พิงคะสัน",
      role: '"Frontend"',
      pic: "imgProfile/nay.jpg",
      nickname: "Nay",
    },
    {
      studentId: "64010659",
      name: "ภัทราภรณ์ จันเดชา",
      role: '"UX/UI & Frontend"',
      pic: "imgProfile/jan.png",
      nickname: "Jan",
    },
    {
      studentId: "64010681",
      name: "ภูมิ ไพรศรี",
      role: '"Frontend"',
      pic: "imgProfile/non.jpg",
      nickname: "Non",
    },
    {
      studentId: "64010720",
      name: "รสริน นิยมสันติสุข",
      role: '"Backend"',
      pic: "imgProfile/yaya.png",
      nickname: "Yaya",
    },
    {
      studentId: "64010755",
      name: "วรชนนน์ ชัยประเสริฐสุด",
      role: '"Backend"',
      pic: "imgProfile/pune.png",
      nickname: "Pune",
    },
    {
      studentId: "64010761",
      name: "วรพล รังษี",
      role: '"Backend"',
      pic: "imgProfile/nine.png",
      nickname: "Nine",
    },
    {
      studentId: "64010845",
      name: "ศิรสิทธิ์ เทียนเจริญชัย",
      role: '"Frontend"',
      pic: "imgProfile/oot.png",
      nickname: "Oot",
    },
    {
      studentId: "64011204",
      name: "พัฒพนพล ชัยวงษา",
      role: '"Frontend"',
      pic: "imgProfile/aof.jpg",
      nickname: "Aof",
    },
  ];

  return (
    <div>
      <div className="flex flex-row justify-around gap-x-5 mt-5 mx-5">
        <div
          className={`md:border-2 border-white rounded-xl md:w-72 hidden md:block ${
            curr - 1 < 0 ? " opacity-0" : "opacity-30"
          }`}
        >
          <div className=" bg-white text-black text-xl text-center rounded-xl m-3 py-4 ">
            <p className=" text-lg">
              {curr - 1 < 0 ? "" : person[curr - 1].studentId}
            </p>
            <p className=" text-lg">
              {curr - 1 < 0 ? "" : person[curr - 1].name}
            </p>
            <p className=" font-semibold">
              {curr - 1 < 0 ? "" : person[curr - 1].role}
            </p>
          </div>
          <div className="flex justify-center my-4 ">
            <img
              className="bg-white w-16 h-16 rounded-full object-cover"
              src={curr - 1 < 0 ? "" : person[curr - 1].pic}
            />
          </div>
        </div>
        <div
          className={`border-2 border-white rounded-xl w-72 after:delay-1000`}
        >
          <div className=" bg-white text-black text-xl text-center rounded-xl m-3 py-4 ">
            <p className=" text-lg">{person[curr].studentId}</p>
            <p className=" text-lg">{person[curr].name}</p>
            <p className=" font-semibold">{person[curr].role}</p>
          </div>
          <div className="flex justify-center my-4 ">
            <img
              className="bg-white w-16 h-16 rounded-full object-cover"
              src={person[curr].pic}
            />
          </div>
        </div>
        <div
          className={`md:border-2 border-white rounded-xl md:w-72 hidden md:block ${
            curr + 1 > 8 ? "opacity-0" : "opacity-30"
          }`}
        >
          <div className=" bg-white text-black text-xl text-center rounded-xl m-3 py-4 ">
            <p className=" text-lg">
              {curr + 1 > 8 ? "" : person[curr + 1].studentId}
            </p>
            <p className=" text-lg">
              {curr + 1 > 8 ? "" : person[curr + 1].name}
            </p>
            <p className=" font-semibold">
              {curr + 1 > 8 ? "" : person[curr + 1].role}
            </p>
          </div>
          <div className="flex justify-center my-4 ">
            <img
              className="bg-white w-16 h-16 rounded-full object-cover"
              src={curr + 1 > 8 ? "" : person[curr + 1].pic}
            />
          </div>
        </div>
      </div>
      <div className=" flex flex-row items-center justify-around m-7 gap-x-10 relative">
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="cursor-pointer flex-1"
          onClick={() => prevFunction()}
        />
        <p className=" absolute text-3xl flex-1">{person[curr].nickname}</p>
        <FontAwesomeIcon
          icon={faChevronRight}
          className=" cursor-pointer flex-1"
          onClick={() => nextFunction()}
        />
      </div>
    </div>
  );
}

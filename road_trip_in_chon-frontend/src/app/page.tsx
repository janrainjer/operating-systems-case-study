"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cetagories from "@/components/Cetagories";
import Search from "@/components/Search";
import Popular from "@/components/Popular";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Carousel from "@/components/Carousel";
import GoogleMapComponent from "@/components/GoogleMap";
import Footer from "@/components/Footer";

const cetagories = [
  {
    name: "ชายหาดและทะเล",
    place: 15,
    pic: "/sea.png",
  },
  {
    name: "ช๊อปปิ้ง",
    place: 15,
    pic: "/shop.png",
  },
  {
    name: "ประวัติศาสตร์ วัฒนธรรมและศาสนา",
    place: 15,
    pic: "/history.png",
  },
  {
    name: "สวนสัตว์ สวนน้ำ และสวนสนุก",
    place: 15,
    pic: "/zoo.png",
  },
  {
    name: "พิพิธภัณฑ์และ การเรียนรู้ ธรรมชาติ",
    place: 15,
    pic: "/museum.png",
  },
];

export default function Home() {
  return (
    <div className=" border-2 flex justify-center flex-col w-screen font-karnit">
      {/* Header */}
      <div className="bg-base bg-cover rounded-3xl m-6 bg-no-repeat bg-center h-full">
        <div className=" text-white flex pt-40 justify-center items-center flex-col w-full ">
          <h1 className=" text-[48px] text-center">Chonburi Thailand</h1>
          <p className=" text-center md:text-[18px] text-[9px] mx-10 pt-6 font-thin text-sm">
            เมืองที่มีทั้งความสดใสของทะเลและภูเขา
            <br />
            พบกับทัศนียภาพที่งดงามของชายหาดที่สวยงามอย่างไม่ธรรมดา
            <br />
            รวมทั้งชมโบราณสถานที่ประวัติศาสตร์และวัฒนธรรมที่น่าสนใจ
          </p>
          <Search />
        </div>
      </div>
      {/* Preview */}
      <section className="flex flex-wrap flex-col md:flex-row mx-4 items-center gap-x-10">
        <div className=" flex-1 px-10">
          <img src="/sea_1.png" className=" scale-75"></img>
        </div>

        <div className="flex-1">
          <div className=" text-center md:text-start my-10">
            <p className="text-xs text-[#276968]">Preview</p>
            <h1 className="text-3xl">Review your perfect trip</h1>
            <p className=" m-2 mx-12 text-xs opacity-70">
              ไม่ว่าคุณจะเลือกที่จะพักผ่อนบนชายหาดหรือสำรวจสถานที่ท่องเที่ยวที่น่าสนใจ
              ที่ชลบุรีจะทำให้คุณมีความทรงจำที่ยิ่งใหญ่และประทับใจที่สุด
              มาเยือนในช่วงเวลาใดก็ได้และร่วมสนุกกับความสนุกสุดพิเศษในชลบุรีร่วมกัน
              !
            </p>
          </div>
          <div className="flex">
            <div className="flex-1">
              <div>
                <h1 className=" text-2xl font-semibold text-[#276968]">50+</h1>
                <p className="text-xs text-[#37454D]">สถานที่ท่องเที่ยว</p>
              </div>
              <div className=" pt-4">
                <h1 className=" text-2xl font-semibold text-[#276968]">90+</h1>
                <p className="text-xs text-[#37454D]">ผู้ใช้งาน</p>
              </div>
            </div>
            <div className=" flex-1">
              <div>
                <h1 className=" text-2xl font-semibold text-[#276968]">120+</h1>
                <p className="text-xs text-[#37454D]">รีวิว</p>
              </div>
              <div className="pt-4">
                <h1 className=" text-2xl font-semibold text-[#276968]">40+</h1>
                <p className="text-xs text-[#37454D]">ผู้เข้าชมเว็บไซต์</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cetagories */}
      <section className=" mx-4" id="CATEGORIES">
        <h1 className=" text-4xl mb-4 text-center my-10 md:text-start md:my-0">
          Cetagories
        </h1>
        <div className=" flex flex-row gap-y-5 gap-x-4 flex-wrap  justify-center">
          {cetagories.map((e,key) => (
            <Cetagories name={e.name} pic={e.pic} place={e.place} key={key}/>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className=" my-10 mx-4 text-center md:text-start" id="POPULAR">
        <p className="text-[#276968]">Top destination</p>
        <h1 className=" text-4xl mb-4">Popular</h1>
        <Popular />
      </section>

      {/* Map */}
      <section className=" lg:flex gap-y-10 justify-around  items-center  my-4">
        <div className=" text-center flex flex-col md:text-start mb-4 md:mb-0">
          <h1 className=" text-center lg:text-start text-4xl font-bold">
            Find Your
          </h1>
          <h2 className="sm:text-center lg:text-start ">Road Trip in CHON</h2>
          <p className="sm:text-center lg:text-start text-sm text-[#276968]">
            Everything you need to organize your trip
          </p>
        </div>
        <div className="flex justify-center items-center" id="MAP">
          <GoogleMapComponent />
        </div>
      </section>

      {/* Testtimonial */}
      <section className="w-screen bg-no-repeat text-white my-5">
        <div className="bg-person object-fill bg-cover  pb-4 w-full">
          <div className=" w-screen flex flex-col items-center">
            <p className="text-sm mt-8">Testimonials</p>
            <h1 className=" text-3xl">About us</h1>
            <div className=" my-5 flex flex-row gap-4 text-[#FE940A]">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </div>
            <p className=" w-2/3 text-center text-sm font-light">
              We are web application developers. For people with passion for
              travelling Chonburi, Thailand offers places of breathtaking
              natural beauty waiting for you to discover, from the span of
              towering mountains of the north to the tropical powdery-white
              sandy beaches of the south.
            </p>
          </div>
          <Carousel />
        </div>
      </section>
      {/* <Footer/> */}
    </div>
  );
}

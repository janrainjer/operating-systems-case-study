"use client";
import React from "react";
import Image from "next/image";

interface IAllImageModal{
  photos : Array<string>
  setShow : (show : boolean) => void,
}

export default function AllImageModal({ photos,setShow }: IAllImageModal) {
  
  const handleShowImage =() =>{
    setShow(false)
  }

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-50">
      <div className="w-full h-full  max-w-screen-xl md:w-[90%]  lg:h-[70%] gap-1 bg-white p-6 overflow-hidden rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="px-5 py-2 bg-[#276968] text-white w-fit rounded-xl">
            <h2>รูปภาพทั้งหมด</h2>
          </div>
          <div className="w-8 h-8 bg-[#276968] text-white rounded-[50%] flex justify-center items-center cursor-pointer" onClick={()=>handleShowImage()}>
            <h2>X</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 w-full h-full overflow-y-scroll gap-1">
          {photos.map((img,key)=>{
            return (
                <div className="col-span-1 relative h-64" key={key}>
                  <Image src={img} alt="" fill></Image>
                </div>
            )
        })}
        </div>
      </div>
  </div>
  );
}

"use client"
import Link from "next/link";
import {
  AiFillYoutube,
  AiFillFacebook,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  return (
    <footer
      className={`${
        pathname === "/signin" || pathname === "/register" ? "hidden" : ""
      } text-white pd-4 bg-[#276968] w-screen flex md:flex-row flex-col gap-y-4 md:gap-0 justify-between flex-wrap p-4`}
    >
      <div>
        <div className=" flex justify-center">
          <img className="" src="./Header.png" />
        </div>
        <div className="flex flex-row justify-between mt-2">
          <div className=" text-2xl">
            <AiFillFacebook />
          </div>
          <div className=" text-3xl">
            <AiOutlineTwitter />
          </div>
          <div className=" text-3xl">
            <AiFillYoutube />
          </div>

          <div className=" text-2xl">
            <AiFillInstagram />
          </div>
        </div>
      </div>
      <div className=" flex flex-col">
        <p className=" font-bold">Links</p>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Stays
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Discover
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          About us
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Contact
        </Link>
      </div>
      <div className=" flex flex-col">
        <p className=" font-bold">Our Activities</p>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Ocean Trip
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Shopping
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Historical and Cultural
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Zoo, Water park and Amusement park
        </Link>
      </div>
      <div className="flex flex-col">
        <p className=" font-bold">About us</p>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Our Story
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Work with us
        </Link>
      </div>
      <div className="flex flex-col">
        <p className=" font-bold">Contact</p>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Address : Chonburi 1010101
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Phone : 099 999 9999
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Email : roadtripinchom@mail.com
        </Link>
        <Link href="#" className=" text-sm opacity-60 font-semibold">
          Phone : 099 999 9999
        </Link>
      </div>
    </footer>
  );
}

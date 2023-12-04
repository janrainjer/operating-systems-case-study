import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMap,
  faStar,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Search() {
  return (
    <div className=" mx-20 flex mt-8 mb-16 text-xs font-light flex-wrap flex-col md:flex-row md:items-center items-start gap-x-10 gap-y-2 text-black bg-white p-2 px-4 rounded-md">
      <Link href="#CATEGORIES">
        <FontAwesomeIcon icon={faCreditCard} />
        <span className="ml-2">Categories</span>
      </Link>
      <span className=" invisible md:visible">|</span>
        <Link href="#POPULAR">
          <FontAwesomeIcon icon={faStar} />
          <span className="ml-2">Popular</span>
        </Link>
      <div className=" invisible md:visible">
        <span>|</span>
      </div>
      <div className="flex justify-center md:items-center items-start gap-6 flex-col md:flex-row">
        <Link href="#MAP">
          <FontAwesomeIcon icon={faMap} />
          <span className="ml-2">Map</span>
        </Link>
        {/* <Link href="#" className="p-2 px-4 bg-[#29AAA8] rounded-sm">
          <span className="mr-2">Search</span>
          <FontAwesomeIcon icon={faSearch} />
        </Link> */}
      </div>
    </div>
  );
}

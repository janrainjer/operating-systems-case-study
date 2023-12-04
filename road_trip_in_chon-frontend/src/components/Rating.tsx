"use client";
import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar
} from "@fortawesome/free-solid-svg-icons";

interface IRatingProps {
  rating: number;
  vote: boolean;
  setVote: any;
  size : string;
  mx : string;
}

export default function Rating({ 
  rating, 
  vote = false, 
  setVote = null,
  size = "text-xl",
  mx="mx-1"
}: IRatingProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const getColor = (index : number) => {
    if (hoverRating >= index) {
      return "#FF6F6B"
    } else if (!hoverRating && rating >= index) {
      return "#FF6F6B"
    }
    return "#DCDCDC"
  };

  const handleVote =(idx:number)=>{
    if(vote){
      setVote(idx)
    }
  }

  const handleHover =(idx:number)=>{
    if(vote){
      setHoverRating(idx)
    }
  }

  const starRating = useMemo(() => {
    return Array(5)
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => (
        <FontAwesomeIcon
          key={idx}
          className={`${vote == true ? "cursor-pointer" : ""} ${size} ${mx}`}
          icon={faStar}
          onClick={() => handleVote(idx)}
          style={{ color: getColor(idx) }}
          onMouseEnter={() => handleHover(idx)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ));
  }, [rating, hoverRating]);


  return (
    <div>{starRating}</div>
  );
}

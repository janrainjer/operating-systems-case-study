import Link from "next/link";
interface WindowInfoProps {
  id: string;
  img: string;
  title: string;
  openTime: Array<{ day: string; time: string }>;
  typo: string;
}

export function WindowInfo({
  id,
  img,
  title,
  openTime,
  typo,
}: WindowInfoProps) {
    
  return (
    <div className="w-54">
      <div className=" flex justify-center">
        <img src={img} className=" w-40 rounded-xl"></img>
      </div>
      <h1 className=" mt-1">{title}</h1>
      {openTime.map((e) => (
        <div className=" flex flex-row gap-x-1 text-[9px]">
          <h1>{e.day}</h1>
          <h1>{e.time}</h1>
        </div>
      ))}
      <div className="">
        <p className=" opacity-50 font-thin truncate text-[9px]">{typo}</p>
        <Link href={`/location/${id}`} className="text-[9px]">
          see map
        </Link>
      </div>
    </div>
  );
//   652be5ba9b2177f1cd12f648
}

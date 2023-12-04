import Image from "next/image";
import Link from "next/link";

interface CetagoriesProps {
  name: string;
  place: number;
  pic: string;
}

export default function Cetagories({ name, place, pic }: CetagoriesProps) {
  return (
    <Link href="/location">
      <div className="flex flex-row items-center w-40 md:w-auto text-xs">
        <div className=" w-[162px] rounded-md">
          <img src={pic} className="object-cover"></img>
        </div>
        <div className=" ml-1 md:ml-6 w-40">
          <h1 className="  text-sm font-bold text-ellipsis">{name}</h1>
          <p
            className={` text-xs mt-2 text-slate-500 ${
              window.innerWidth > 675 ? "" : "hidden"
            }`}
          >{`${place} places`}</p>
        </div>
      </div>
    </Link>
  );
}
